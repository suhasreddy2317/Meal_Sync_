"use client";

import { useState } from "react";
import { getAllMenus, FOOD_IMAGES } from "@/lib/data/mess-store";
import { resolveDishImage } from "@/lib/data/dish-images";
import { formatTime } from "@/lib/utils";
import { Clock, Flame, Sparkles, Check, X, Calendar as CalendarIcon, ShieldCheck, Utensils } from "lucide-react";
import { submitMealPlanAction } from "@/app/actions/meal-plan-actions";
import { toast } from "sonner";
import { MealType, Menu } from "@/lib/types/database";
import { DishImageBadge } from "@/components/shared/dish-image-badge";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/**
 * Calculates the exact target calendar date (YYYY-MM-DD) for a given weekday name
 * within the active 7-day schedule window starting today.
 */
function getTargetDateForWeekday(dayName: string): { dateStr: string; label: string; isToday: boolean } {
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const candidate = new Date(today);
    candidate.setDate(today.getDate() + i);
    const candidateDayName = candidate.toLocaleDateString("en-US", { weekday: "long" });

    if (candidateDayName.toLowerCase() === dayName.toLowerCase()) {
      const dateStr = candidate.toISOString().split("T")[0];
      const label = candidate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return { dateStr, label, isToday: i === 0 };
    }
  }

  const fallback = today.toISOString().split("T")[0];
  return { dateStr: fallback, label: today.toLocaleDateString("en-US", { month: "short", day: "numeric" }), isToday: true };
}

export default function StudentWeeklyMenuPage() {
  const allMenus = getAllMenus();
  const currentDayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const [activeDay, setActiveDay] = useState<string>(
    daysOfWeek.includes(currentDayName) ? currentDayName : "Monday"
  );
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [userBookings, setUserBookings] = useState<Record<string, "yes" | "no">>({});

  const mealOrder: MealType[] = ["breakfast", "lunch", "snacks", "dinner"];

  // Filter or synthesize menus for the active day with its exact calendar date
  const getDayMeals = (dayName: string): Menu[] => {
    const { dateStr } = getTargetDateForWeekday(dayName);

    return mealOrder.map((type) => {
      const meta = FOOD_IMAGES[type];

      // 1. Direct match by date and meal type
      const match = allMenus.find(
        (m) => m.meal_type === type && m.menu_date === dateStr
      );

      if (match) return match;

      // 2. Synthesize deterministically with target calendar date
      const item1Name = meta.desc.split("+")[0]?.trim() || "Main Serving";
      const item2Name = meta.desc.split("+")[1]?.trim() || "Accompaniment";

      return {
        id: `menu-${dateStr}-${type}`,
        menu_date: dateStr,
        meal_type: type,
        cutoff_time: type === "breakfast" ? "06:00:00" : type === "lunch" ? "10:00:00" : type === "snacks" ? "15:30:00" : "17:00:00",
        serving_start_time: type === "breakfast" ? "07:30:00" : type === "lunch" ? "12:30:00" : type === "snacks" ? "17:00:00" : "19:30:00",
        serving_end_time: type === "breakfast" ? "09:30:00" : type === "lunch" ? "14:30:00" : type === "snacks" ? "18:00:00" : "21:30:00",
        is_published: true,
        image_url: resolveDishImage(item1Name, null, "main"),
        calories: meta.calories,
        special_badge: type === "dinner" && dayName === "Sunday" ? "Grand Feast" : type === "dinner" ? "Chef's Special" : undefined,
        items: [
          {
            id: `item-${dateStr}-${type}-1`,
            menu_id: `menu-${dateStr}-${type}`,
            name: item1Name,
            category: "main" as const,
            is_vegetarian: true,
            image_url: resolveDishImage(item1Name, null, "main"),
            description: meta.desc,
            created_at: "",
          },
          {
            id: `item-${dateStr}-${type}-2`,
            menu_id: `menu-${dateStr}-${type}`,
            name: item2Name,
            category: (type === "snacks" ? "snack" : "side") as any,
            is_vegetarian: true,
            image_url: resolveDishImage(item2Name, null, type === "snacks" ? "snack" : "side"),
            description: meta.desc,
            created_at: "",
          },
        ],
        expected_attendance: 18,
        user_meal_plan: null,
        created_at: "",
        updated_at: "",
      };
    });
  };

  const handleBooking = async (menuId: string, status: "yes" | "no") => {
    setLoadingId(menuId);
    const res = await submitMealPlanAction({ menu_id: menuId, status });
    setLoadingId(null);

    if (res.success) {
      setUserBookings((prev) => ({ ...prev, [menuId]: status }));
      toast.success(status === "yes" ? "Meal booked successfully!" : "Meal opt-out confirmed.");
    } else {
      toast.error(res.error || "Failed to update meal booking");
    }
  };

  const dayMeals = getDayMeals(activeDay);

  return (
    <div className="space-y-8">
      {/* 1. TOP HERO HEADER ROW: Left Eyebrow+H1+Subtitle, Right compact KPI stat chips */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <CalendarIcon className="w-3.5 h-3.5 text-amber-500" />
            <span>Weekly Dining Schedule</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Complete Weekly Mess Menu
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Plan your meals across all seven days with nutritional counts, booking cutoffs, and instant attendance opt-in.
          </p>
        </div>

        {/* Right-aligned compact KPI stat cards */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center shrink-0">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                7 Days Active
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Mon – Sun Cycle
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center shrink-0">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                4 Daily Slots
              </p>
              <p className="text-[10px] text-emerald-700 font-medium">
                Breakfast to Dinner
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                Cutoff Guard
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Zero Food Wastage
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monday to Sunday Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {daysOfWeek.map((day) => {
          const isSelected = activeDay === day;
          const info = getTargetDateForWeekday(day);

          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`py-2.5 px-4 rounded-xl font-semibold text-xs shrink-0 transition-all flex flex-col items-center gap-0.5 ${
                isSelected
                  ? "bg-slate-900 text-amber-400 shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100/70 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>{day}</span>
                {info.isToday && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                    isSelected ? "bg-amber-400 text-slate-950" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}>
                    Today
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-normal ${isSelected ? "text-amber-200" : "text-slate-400"}`}>
                {info.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4 Meals Grid for Selected Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {dayMeals.map((meal) => {
          const meta = FOOD_IMAGES[meal.meal_type];
          const primaryDish = meal.items?.[0];
          const heroImage = primaryDish
            ? resolveDishImage(primaryDish.name, primaryDish.image_url, primaryDish.category)
            : resolveDishImage(meal.meal_type, meal.image_url || meta.url);
          const mealTitle = meal.items && meal.items.length > 0 ? meal.items.map(i => i.name).slice(0, 2).join(" + ") : meta.desc;
          const currentPlan = userBookings[meal.id] || (meal as Menu).user_meal_plan?.status || null;
          const isVeg = meal.items && meal.items.length > 0 ? meal.items.every(i => i.is_vegetarian !== false) : true;

          return (
            <div
              key={meal.meal_type}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                  <img
                    src={heroImage}
                    alt={mealTitle}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-900/85 text-amber-300 backdrop-blur-xs">
                      {meta.label}
                    </span>
                  </div>
                  {meal.special_badge && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                        <Sparkles className="w-2.5 h-2.5" /> {meal.special_badge}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-2.5 left-3 bg-slate-900/75 backdrop-blur-xs px-2.5 py-0.5 rounded-lg text-[10px] font-medium text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>
                      {formatTime(meal.serving_start_time)} – {formatTime(meal.serving_end_time)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-semibold text-base text-slate-900 line-clamp-1">
                      {mealTitle}
                    </h3>
                  </div>

                  {/* Individual Dishes with Photos */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {meal.items && meal.items.length > 0 ? (
                      meal.items.map((item) => (
                        <DishImageBadge
                          key={item.id}
                          name={item.name}
                          category={item.category}
                          imageUrl={(item as any).image_url}
                          description={(item as any).description}
                          isVegetarian={item.is_vegetarian}
                          size="sm"
                        />
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No dishes listed</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      {meal.calories || meta.calories} kcal
                    </span>
                    {isVeg ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-semibold">
                        Pure Veg
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 text-[10px] font-semibold">
                        Non-Veg
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Booking Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-500">Attendance:</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    disabled={loadingId === meal.id}
                    onClick={() => handleBooking(meal.id, "yes")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors ${
                      currentPlan === "yes"
                        ? "bg-amber-400 text-slate-950 font-bold ring-2 ring-amber-400"
                        : "bg-white hover:bg-amber-100/70 text-slate-700 border border-slate-200"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" /> {currentPlan === "yes" ? "Booked" : "Book"}
                  </button>
                  <button
                    type="button"
                    disabled={loadingId === meal.id}
                    onClick={() => handleBooking(meal.id, "no")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                      currentPlan === "no"
                        ? "bg-rose-600 text-white shadow-xs"
                        : "bg-white hover:bg-rose-50 text-rose-600 border border-slate-200"
                    }`}
                  >
                    <X className="w-3.5 h-3.5" /> {currentPlan === "no" ? "Skipped" : "Skip"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
