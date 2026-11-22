import {
  getAllMenus,
  getDemandPredictionForMenu,
  getAIRecommendationsForMess,
} from "@/lib/data/mess-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, AlertTriangle, Scale, Brain, ShieldAlert, CheckCircle2 } from "lucide-react";
import { formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminAIInsightsPage() {
  const allMenus = getAllMenus();
  const today = new Date().toISOString().split("T")[0];

  // Upcoming meals for prediction
  const upcomingMenus = allMenus
    .filter((m) => m.menu_date >= today)
    .slice(0, 6);

  const recommendations = getAIRecommendationsForMess();

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1">
          <Brain className="w-4 h-4" /> Explainable Machine Intelligence
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          AI Demand Forecasting & Wastage Recommendations
        </h1>
        <p className="text-xs text-slate-500">
          Transparent algorithmic guidance based on student opt-ins, historical turnout conversion ratios, and culinary feedback.
        </p>
      </div>

      {/* Section 1: AI Rule-Based Quality & Wastage Recommendations (FR8) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" /> Active Prescriptive Recommendations
        </h2>

        {recommendations.length === 0 ? (
          <Card className="p-8 text-center text-slate-400 text-sm">
            No active anomalies or warnings detected in current operational cycles.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, idx) => {
              const priorityIcons = {
                critical: ShieldAlert,
                high: AlertTriangle,
                medium: TrendingUp,
                low: CheckCircle2,
              };
              const Icon = priorityIcons[rec.priority] || Sparkles;

              const borderStyles = {
                critical: "border-rose-300 bg-rose-50/40",
                high: "border-amber-300 bg-amber-50/40",
                medium: "border-blue-200 bg-blue-50/30",
                low: "border-emerald-200 bg-emerald-50/30",
              };

              return (
                <Card key={idx} className={`p-5 border ${borderStyles[rec.priority]} space-y-3`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-xs">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{rec.title}</h3>
                        {rec.related_dish_name && (
                          <span className="text-[11px] text-slate-500">
                            Dishes: {rec.related_dish_name}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={rec.priority === "critical" ? "destructive" : rec.priority === "high" ? "warning" : "default"}
                      className="text-[10px] uppercase font-bold"
                    >
                      {rec.priority}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {rec.message}
                  </p>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Explainable Demand Predictions (FR9) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Scale className="w-4 h-4 text-emerald-600" /> Upcoming Meal Demand Predictions & Batch Sizing
        </h2>

        <div className="space-y-4">
          {upcomingMenus.map((menu) => {
            const pred = getDemandPredictionForMenu(menu.id);
            const formattedDate = new Date(menu.menu_date + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });

            return (
              <Card key={menu.id} className="p-5 hover:border-slate-300 transition-colors">
                <div className="space-y-4">
                  {/* Meal Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-slate-900 capitalize text-base">
                          {menu.meal_type}
                        </span>
                        <span className="text-xs text-slate-500">• {formattedDate}</span>
                        <span className="text-xs text-slate-500">
                          (Serving: {formatTime(menu.serving_start_time)} - {formatTime(menu.serving_end_time)})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {menu.items?.map((i) => i.name).join(", ") || "No dishes specified"}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-800 border-emerald-200">
                        {pred.historical_sample_size === 4 ? "Full 4-Cycle Ensemble" : "Partial Baseline"}
                      </Badge>
                    </div>
                  </div>

                  {/* Math Formula Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Opt-in Yes</span>
                      <span className="text-base font-bold text-slate-800">{pred.planned_count}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Adjusted Opt-in</span>
                      <span className="text-base font-bold text-slate-800">{pred.adjusted_planned_count}</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">WMA Prediction</span>
                      <span className="text-base font-bold text-slate-800">{pred.model_prediction}</span>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-emerald-700 uppercase font-semibold block">Blended Headcount</span>
                      <span className="text-lg font-black text-emerald-800">{pred.final_predicted_count}</span>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-amber-700 uppercase font-semibold block">Target Quantity</span>
                      <span className="text-lg font-black text-amber-900">{pred.recommended_prep_qty} {pred.unit}</span>
                    </div>
                  </div>

                  {/* Algorithmic Rationale */}
                  <div className="p-3 bg-slate-50/70 rounded-lg text-xs text-slate-600 leading-relaxed border border-slate-100">
                    <strong className="text-slate-800">Rationale: </strong> {pred.rationale}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
