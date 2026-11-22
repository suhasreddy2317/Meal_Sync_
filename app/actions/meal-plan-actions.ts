"use server";

import { revalidatePath } from "next/cache";
import { mealPlanSchema, MealPlanInput } from "@/lib/validations/meal-plan";
import { getMenuById, saveMealPlanInStore } from "@/lib/data/mess-store";
import { isCutoffPassed, getCutoffDateTime } from "@/lib/services/cutoff-manager";
import { getCurrentUser } from "./auth-actions";
import { createClient } from "@/lib/supabase/server";
import { Menu } from "@/lib/types/database";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function submitMealPlanAction(input: MealPlanInput) {
  const user = await getCurrentUser();
  if (!user || user.role !== "student") {
    return { success: false, error: "Only registered students can submit meal plans." };
  }

  const result = mealPlanSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.errors[0]?.message || "Invalid meal plan submission" };
  }

  const { menu_id, status } = result.data;
  let menu = getMenuById(menu_id);

  let supabaseMenuId: string | null = null;
  const isInputUuid = UUID_REGEX.test(menu_id);

  // If Supabase is connected, attempt to resolve or match database menu
  try {
    const supabase = createClient();

    if (isInputUuid) {
      supabaseMenuId = menu_id;
      if (!menu) {
        const { data: dbMenu } = await supabase.from("menus").select("*").eq("id", menu_id).maybeSingle();
        if (dbMenu) {
          const mDate = typeof dbMenu.menu_date === "string" ? dbMenu.menu_date.slice(0, 10) : new Date(dbMenu.menu_date).toISOString().slice(0, 10);
          menu = {
            id: dbMenu.id,
            menu_date: mDate,
            meal_type: dbMenu.meal_type,
            cutoff_time: dbMenu.cutoff_time,
            serving_start_time: dbMenu.serving_start_time,
            serving_end_time: dbMenu.serving_end_time,
            is_published: dbMenu.is_published,
            image_url: dbMenu.image_url,
            calories: dbMenu.calories,
            created_at: dbMenu.created_at,
            updated_at: dbMenu.updated_at,
          };
        }
      }
    } else if (menu) {
      // Find matching Supabase menu by date & meal_type
      const { data: dbMenu } = await supabase
        .from("menus")
        .select("id")
        .eq("menu_date", menu.menu_date)
        .eq("meal_type", menu.meal_type)
        .maybeSingle();

      if (dbMenu) {
        supabaseMenuId = dbMenu.id;
      }
    }
  } catch {
    // Offline / unconfigured Supabase fallback
  }

  if (!menu) {
    return { success: false, error: "The requested menu was not found." };
  }

  // FR3 Server-Side Cutoff Enforcement
  const now = new Date();
  if (isCutoffPassed(menu.menu_date, menu.cutoff_time, now)) {
    const cutoffDate = getCutoffDateTime(menu.menu_date, menu.cutoff_time);
    return {
      success: false,
      error: `Cutoff passed at ${cutoffDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}. Meal plans for this meal are locked.`,
    };
  }

  try {
    // 1. Update in-memory state repository
    const savedPlan = saveMealPlanInStore(user.id, menu.id, status);

    // 2. Persist to Supabase PostgreSQL when UUIDs are valid
    if (supabaseMenuId && UUID_REGEX.test(user.id)) {
      try {
        const supabase = createClient();
        await supabase.from("meal_plans").upsert(
          {
            student_id: user.id,
            menu_id: supabaseMenuId,
            status,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "student_id,menu_id" }
        );
      } catch (dbErr: any) {
        console.warn("Non-blocking Supabase meal_plans update warning:", dbErr?.message);
      }
    }

    const safeRevalidate = (p: string) => {
      try { revalidatePath(p); } catch {}
    };
    safeRevalidate("/student/dashboard");
    safeRevalidate("/student/meal-plans");
    safeRevalidate("/student/menu");
    safeRevalidate("/admin/attendance");
    safeRevalidate("/admin/dashboard");
    return { success: true, plan: savedPlan };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update meal plan." };
  }
}
