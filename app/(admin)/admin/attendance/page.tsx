import { getAllMenus, getDemandPredictionForMenu } from "@/lib/data/mess-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Sparkles, Scale, Calendar, Clock } from "lucide-react";
import { formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminAttendancePage() {
  const allMenus = getAllMenus();
  const today = new Date().toISOString().split("T")[0];

  // Upcoming and today's menus
  const activeMenus = allMenus
    .filter((m) => m.menu_date >= today)
    .sort((a, b) => a.menu_date.localeCompare(b.menu_date))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Attendance Headcount & Demand Forecast
        </h1>
        <p className="text-xs text-slate-500">
          Compare student declared opt-ins against explainable AI headcount predictions and recommended batch cooking sizes.
        </p>
      </div>

      <div className="space-y-4">
        {activeMenus.length === 0 ? (
          <Card className="p-12 text-center text-slate-400">
            No upcoming meals found.
          </Card>
        ) : (
          activeMenus.map((menu) => {
            const prediction = getDemandPredictionForMenu(menu.id);
            const formattedDate = new Date(menu.menu_date + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });

            return (
              <Card key={menu.id} className="p-5 hover:border-slate-300 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left Column: Menu Identity */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-slate-900 capitalize text-base">
                        {menu.meal_type}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {formattedDate}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> Cutoff: {formatTime(menu.cutoff_time)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      {menu.items?.map((i) => i.name).join(", ") || "No dishes specified"}
                    </p>

                    <div className="text-[11px] text-slate-400 italic">
                      {prediction.rationale}
                    </div>
                  </div>

                  {/* Right Column: Comparative Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
                    {/* Declared Headcount */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Opt-in Headcount
                      </span>
                      <span className="text-xl font-extrabold text-slate-800">
                        {menu.expected_attendance || 0}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Yes Responses</span>
                    </div>

                    {/* AI Predicted Turnout */}
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 block tracking-wider flex items-center justify-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Headcount
                      </span>
                      <span className="text-xl font-extrabold text-emerald-800">
                        {prediction.final_predicted_count}
                      </span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5">Blended Forecast</span>
                    </div>

                    {/* Recommended Prep Qty */}
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-center col-span-2 sm:col-span-1">
                      <span className="text-[10px] uppercase font-bold text-amber-700 block tracking-wider flex items-center justify-center gap-1">
                        <Scale className="w-3 h-3" /> Recommended
                      </span>
                      <span className="text-xl font-extrabold text-amber-900">
                        {prediction.recommended_prep_qty} {prediction.unit}
                      </span>
                      <span className="text-[10px] text-amber-700 block mt-0.5">+5% Kitchen Buffer</span>
                    </div>
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
