import Link from "next/link";
import { getAllMenus } from "@/lib/data/mess-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Calendar, Trash2, Utensils, Clock } from "lucide-react";
import { deleteMenuAction } from "@/app/actions/menu-actions";
import { formatTime } from "@/lib/utils";
import { DishImageBadge } from "@/components/shared/dish-image-badge";

export const dynamic = "force-dynamic";

export default async function AdminMenusPage({
  searchParams,
}: {
  searchParams?: { date?: string; meal_type?: string };
}) {
  const allMenus = getAllMenus();
  const filterDate = searchParams?.date;
  const filterMeal = searchParams?.meal_type;

  let filtered = allMenus;
  if (filterDate) {
    filtered = filtered.filter((m) => m.menu_date === filterDate);
  }
  if (filterMeal) {
    filtered = filtered.filter((m) => m.meal_type === filterMeal);
  }

  // Sort newest date first
  filtered.sort((a, b) => b.menu_date.localeCompare(a.menu_date));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Menu Management
          </h1>
          <p className="text-xs text-slate-500">
            Publish daily menus, define dishes, and configure meal-specific opt-in cutoffs.
          </p>
        </div>

        <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9">
          <Link href="/admin/menus/create">
            <PlusCircle className="w-4 h-4 mr-1.5" /> Create Menu
          </Link>
        </Button>
      </div>

      {/* Menus List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="p-12 text-center text-slate-500">
            <p>No menus found matching your filters.</p>
          </Card>
        ) : (
          filtered.map((menu) => {
            const formattedDate = new Date(menu.menu_date + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <Card key={menu.id} className="p-5 hover:border-slate-300 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 capitalize text-base">
                        {menu.meal_type}
                      </span>
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {formattedDate}
                      </span>
                      <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Serving: {formatTime(menu.serving_start_time)} – {formatTime(menu.serving_end_time)}
                      </span>
                      <Badge variant="outline" className="text-[10px] bg-slate-50">
                        Cutoff: {formatTime(menu.cutoff_time)}
                      </Badge>
                    </div>

                    {/* Dishes with Authentic Food Imagery */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {menu.items && menu.items.length > 0 ? (
                        menu.items.map((dish) => (
                          <DishImageBadge
                            key={dish.id}
                            name={dish.name}
                            category={dish.category}
                            imageUrl={dish.image_url}
                            description={dish.description}
                            isVegetarian={dish.is_vegetarian}
                            size="md"
                          />
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">No dishes listed.</span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Headcount */}
                  <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-sm font-bold text-slate-800 block">
                        {menu.expected_attendance || 0} Opt-ins
                      </span>
                      <span className="text-[11px] text-slate-400">Declared attendance</span>
                    </div>

                    <form action={async () => {
                      "use server";
                      await deleteMenuAction(menu.id);
                    }}>
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                        title="Delete menu"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
