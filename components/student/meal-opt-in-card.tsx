"use client";

import { useState } from "react";
import { Coffee, Sun, Moon, Cookie, Check, X, Users, Utensils } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CutoffCountdown } from "@/components/shared/cutoff-countdown";
import { RateMealDialog } from "@/components/student/rate-meal-dialog";
import { submitMealPlanAction } from "@/app/actions/meal-plan-actions";
import { Menu, MealType } from "@/lib/types/database";
import { formatTime } from "@/lib/utils";
import { isCutoffPassed } from "@/lib/services/cutoff-manager";
import { DishImageBadge } from "@/components/shared/dish-image-badge";

interface MealOptInCardProps {
  menu: Menu;
  onPlanChanged?: () => void;
}

export function MealOptInCard({ menu, onPlanChanged }: MealOptInCardProps) {
  const [currentStatus, setCurrentStatus] = useState<"yes" | "no" | null>(
    menu.user_meal_plan?.status || null
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mealIcons: Record<MealType, any> = {
    breakfast: Coffee,
    lunch: Sun,
    snacks: Cookie,
    dinner: Moon,
  };
  const Icon = mealIcons[menu.meal_type] || Utensils;

  const cutoffLocked = isCutoffPassed(menu.menu_date, menu.cutoff_time);

  const handleTogglePlan = async (status: "yes" | "no") => {
    if (cutoffLocked || loading) return;

    setLoading(true);
    setErrorMsg(null);

    const res = await submitMealPlanAction({
      menu_id: menu.id,
      status,
    });

    setLoading(false);

    if (res.success) {
      setCurrentStatus(status);
      onPlanChanged?.();
    } else {
      setErrorMsg(res.error || "Failed to submit meal plan");
    }
  };

  return (
    <Card className="overflow-hidden border border-slate-200/90 shadow-sm hover:shadow transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-brand-dark shadow-xs">
                <Icon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-base font-bold capitalize text-slate-800">
                  {menu.meal_type}
                </CardTitle>
                <p className="text-xs text-slate-500 font-medium">
                  {formatTime(menu.serving_start_time)} – {formatTime(menu.serving_end_time)}
                </p>
              </div>
            </div>

            <CutoffCountdown
              menuDate={menu.menu_date}
              cutoffTime={menu.cutoff_time}
            />
          </div>
        </CardHeader>

        {/* Content - Dishes List */}
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Dishes Served
            </p>
            <div className="flex flex-wrap gap-2 pt-0.5">
              {menu.items && menu.items.length > 0 ? (
                menu.items.map((item) => (
                  <DishImageBadge
                    key={item.id}
                    name={item.name}
                    category={item.category}
                    imageUrl={item.image_url}
                    description={item.description}
                    isVegetarian={item.is_vegetarian}
                    size="sm"
                  />
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No dishes listed yet.</p>
              )}
            </div>
          </div>

          {/* Expected Attendance Metric */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-400" /> Expected Headcount
            </span>
            <span className="font-semibold text-slate-800">
              {menu.expected_attendance || 0} students opted in
            </span>
          </div>

          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
              {errorMsg}
            </div>
          )}
        </CardContent>
      </div>

      {/* Footer Opt-In Actions */}
      <CardFooter className="bg-slate-50/40 p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-auto">
          <p className="text-[11px] font-medium text-slate-500 mb-1.5 sm:mb-0">
            Will you eat this meal?
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            type="button"
            size="sm"
            variant={currentStatus === "yes" ? "default" : "outline"}
            disabled={cutoffLocked || loading}
            onClick={() => handleTogglePlan("yes")}
            className={`text-xs h-9 px-3 flex-1 sm:flex-none ${
              currentStatus === "yes"
                ? "bg-brand-yellow text-brand-black hover:bg-brand-yellowHover font-bold"
                : "hover:border-brand-yellow hover:text-brand-dark"
            }`}
          >
            <Check className="w-3.5 h-3.5 mr-1" /> Yes, I will
          </Button>

          <Button
            type="button"
            size="sm"
            variant={currentStatus === "no" ? "destructive" : "outline"}
            disabled={cutoffLocked || loading}
            onClick={() => handleTogglePlan("no")}
            className={`text-xs h-9 px-3 flex-1 sm:flex-none ${
              currentStatus === "no"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "hover:border-red-300 hover:text-red-700"
            }`}
          >
            <X className="w-3.5 h-3.5 mr-1" /> No, I won&apos;t
          </Button>

          {/* Rating dialog */}
          <div className="ml-1">
            <RateMealDialog menu={menu} onRatingSuccess={onPlanChanged} />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
