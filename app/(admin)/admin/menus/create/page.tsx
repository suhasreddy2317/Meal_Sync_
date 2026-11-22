"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft, Utensils, Clock, Calendar, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { createMenuAction } from "@/app/actions/menu-actions";
import { resolveDishImage, DISH_PRESETS } from "@/lib/data/dish-images";
import Link from "next/link";

interface DishField {
  name: string;
  category: "main" | "bread" | "rice" | "dessert" | "beverage" | "side" | "snack";
  is_vegetarian: boolean;
  image_url?: string;
}

export default function CreateMenuPage() {
  const router = useRouter();
  const [menuDate, setMenuDate] = useState(new Date().toISOString().split("T")[0]);
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner">("lunch");
  const [cutoffTime, setCutoffTime] = useState("10:00");
  const [servingStart, setServingStart] = useState("12:30");
  const [servingEnd, setServingEnd] = useState("14:30");

  const [dishes, setDishes] = useState<DishField[]>([
    { name: "Punjabi Rajma Masala", category: "main", is_vegetarian: true },
    { name: "Steamed Basmati Rice", category: "rice", is_vegetarian: true },
    { name: "Fresh Phulka Rotis", category: "bread", is_vegetarian: true },
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleMealTypeChange = (type: "breakfast" | "lunch" | "dinner") => {
    setMealType(type);
    if (type === "breakfast") {
      setCutoffTime("06:00");
      setServingStart("07:30");
      setServingEnd("09:30");
    } else if (type === "lunch") {
      setCutoffTime("10:00");
      setServingStart("12:30");
      setServingEnd("14:30");
    } else {
      setCutoffTime("17:00");
      setServingStart("19:30");
      setServingEnd("21:30");
    }
  };

  const handleAddDish = () => {
    setDishes([...dishes, { name: "", category: "main", is_vegetarian: true }]);
  };

  const handleRemoveDish = (index: number) => {
    if (dishes.length <= 1) return;
    setDishes(dishes.filter((_, i) => i !== index));
  };

  const handleDishChange = (index: number, field: keyof DishField, value: any) => {
    const updated = [...dishes];
    updated[index] = { ...updated[index], [field]: value };
    setDishes(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic frontend check
    const emptyDishes = dishes.some((d) => !d.name.trim());
    if (emptyDishes) {
      setErrorMsg("Please enter names for all dishes before publishing.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const res = await createMenuAction({
      menu_date: menuDate,
      meal_type: mealType,
      cutoff_time: cutoffTime.length === 5 ? `${cutoffTime}:00` : cutoffTime,
      serving_start_time: servingStart.length === 5 ? `${servingStart}:00` : servingStart,
      serving_end_time: servingEnd.length === 5 ? `${servingEnd}:00` : servingEnd,
      is_published: true,
      items: dishes.map((d) => ({
        name: d.name.trim(),
        category: d.category,
        is_vegetarian: d.is_vegetarian,
        image_url: d.image_url || resolveDishImage(d.name),
      })),
    });

    setLoading(false);

    if (res.success) {
      router.push("/admin/menus");
    } else {
      setErrorMsg(res.error || "Failed to create menu.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0">
          <Link href="/admin/menus">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create & Publish Menu
          </h1>
          <p className="text-xs text-slate-500">
            Design dishes and publish the meal schedule to notify all students immediately.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Menu Timing & Date */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" /> Schedule & Timings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="date">Service Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={menuDate}
                  onChange={(e) => setMenuDate(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>Meal Type</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(["breakfast", "lunch", "dinner"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleMealTypeChange(type)}
                      className={`py-2 px-3 rounded-lg text-xs font-semibold capitalize border transition-colors ${
                        mealType === type
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="cutoff">Cutoff Time (Lock Opt-ins)</Label>
                <Input
                  id="cutoff"
                  type="time"
                  value={cutoffTime}
                  onChange={(e) => setCutoffTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="start">Serving Start Time</Label>
                <Input
                  id="start"
                  type="time"
                  value={servingStart}
                  onChange={(e) => setServingStart(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="end">Serving End Time</Label>
                <Input
                  id="end"
                  type="time"
                  value={servingEnd}
                  onChange={(e) => setServingEnd(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dishes Builder */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Utensils className="w-4 h-4 text-emerald-600" /> Menu Dishes with Culinary Imagery
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Each dish automatically pairs with an authentic food photo (e.g. Idli, Sambar, Paneer, Vada).
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddDish}
              className="text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50 h-8"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Dish
            </Button>
          </CardHeader>

          {/* Quick Presets */}
          <div className="px-6 pb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {DISH_PRESETS.slice(0, 8).map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setDishes([
                      ...dishes.filter((d) => d.name.trim().length > 0),
                      { name: preset.name, category: preset.category, is_vegetarian: preset.is_vegetarian, image_url: preset.image_url },
                    ]);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 transition-colors"
                >
                  <Plus className="w-3 h-3 text-emerald-600" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <CardContent className="space-y-3 pt-2">
            {dishes.map((dish, idx) => {
              const previewImg = resolveDishImage(dish.name, dish.image_url, dish.category);
              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80"
                >
                  {/* Live Food Image Thumbnail */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-200 border border-slate-300/80 shrink-0 shadow-2xs group">
                    <img
                      src={previewImg}
                      alt={dish.name || "Dish Preview"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[9px] font-bold">
                      Live
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-1">
                    <Input
                      placeholder="e.g. Idli with Coconut Chutney, Paneer Butter Masala..."
                      value={dish.name}
                      onChange={(e) => handleDishChange(idx, "name", e.target.value)}
                      required
                      className="bg-white"
                    />
                  </div>

                  <div className="w-full sm:w-36">
                    <select
                      value={dish.category}
                      onChange={(e) => handleDishChange(idx, "category", e.target.value)}
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
                    >
                      <option value="main">Main Curry</option>
                      <option value="bread">Bread / Roti</option>
                      <option value="rice">Rice / Pulao</option>
                      <option value="side">Side Sabzi</option>
                      <option value="dessert">Dessert</option>
                      <option value="beverage">Beverage</option>
                      <option value="snack">Snack</option>
                    </select>
                  </div>

                  {dishes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDish(idx)}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-9 w-9 p-0 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </CardContent>

          {errorMsg && (
            <div className="p-4 mx-6 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
              {errorMsg}
            </div>
          )}

          <CardFooter className="flex justify-end gap-3 border-t border-slate-100 p-4">
            <Button asChild variant="outline" type="button">
              <Link href="/admin/menus">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? "Publishing & Notifying Students..." : "Publish Menu"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
