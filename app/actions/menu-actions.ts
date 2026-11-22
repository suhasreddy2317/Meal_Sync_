"use server";

import { revalidatePath } from "next/cache";
import { menuSchema, MenuInput } from "@/lib/validations/menu";
import {
  createMenuInStore,
  updateMenuInStore,
  deleteMenuFromStore,
  getAllMenus,
  getMenuById,
} from "@/lib/data/mess-store";
import { getCurrentUser } from "./auth-actions";

export async function createMenuAction(input: MenuInput) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized: Only administrators can create menus." };
  }

  const result = menuSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.errors[0]?.message || "Invalid menu data" };
  }

  try {
    const newMenu = createMenuInStore(result.data);
    revalidatePath("/admin/menus");
    revalidatePath("/admin/dashboard");
    revalidatePath("/student/dashboard");
    revalidatePath("/student/menu");
    return { success: true, menuId: newMenu.id };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create menu" };
  }
}

export async function updateMenuAction(menuId: string, input: MenuInput) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized: Only administrators can modify menus." };
  }

  const result = menuSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.errors[0]?.message || "Invalid menu data" };
  }

  try {
    const updated = updateMenuInStore(menuId, result.data);
    revalidatePath("/admin/menus");
    revalidatePath(`/admin/menus/${menuId}/edit`);
    revalidatePath("/student/dashboard");
    revalidatePath("/student/menu");
    return { success: true, menuId: updated.id };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update menu" };
  }
}

export async function deleteMenuAction(menuId: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized: Only administrators can delete menus." };
  }

  try {
    deleteMenuFromStore(menuId);
    revalidatePath("/admin/menus");
    revalidatePath("/student/dashboard");
    revalidatePath("/student/menu");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete menu" };
  }
}

export async function getSevenDayMenusAction() {
  const allMenus = getAllMenus();
  const today = new Date().toISOString().split("T")[0];

  const futureLimit = new Date();
  futureLimit.setDate(new Date().getDate() + 7);
  const futureLimitStr = futureLimit.toISOString().split("T")[0];

  return allMenus.filter(
    (m) => m.menu_date >= today && m.menu_date <= futureLimitStr && m.is_published
  );
}
