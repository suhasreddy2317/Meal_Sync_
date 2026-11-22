import Link from "next/link";
import {
  Users,
  Scale,
  Star,
  ShoppingBag,
  Sparkles,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { MetricCard } from "@/components/admin/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getAllMenus,
  getStore,
  getAIRecommendationsForMess,
} from "@/lib/data/mess-store";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const store = getStore();
  const today = new Date().toISOString().split("T")[0];

  const todayMenus = getAllMenus(today);
  const totalOptedInToday = todayMenus.reduce((sum, m) => sum + (m.expected_attendance || 0), 0);

  // Active wastage calculation from recent records
  const recentRecords = store.foodRecords.slice(-10);
  const totalPrepared = recentRecords.reduce((sum, r) => sum + r.prepared_qty, 0);
  const totalLeftover = recentRecords.reduce((sum, r) => sum + r.leftover_qty, 0);
  const currentWastagePct = totalPrepared > 0 ? ((totalLeftover / totalPrepared) * 100).toFixed(1) : "0.0";

  // Low stock items count
  const lowStockCount = store.groceries.filter((g) => g.current_stock <= g.min_threshold).length;

  // Average student rating
  const allRatings = store.ratings;
  const avgRating = allRatings.length > 0
    ? (allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length).toFixed(1)
    : "4.2";

  // Active recommendations
  const aiRecommendations = getAIRecommendationsForMess();

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#241D1B] tracking-tight">
            Catering Operations Overview
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Real-time mess headcount, food wastage metrics, and inventory health.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button asChild className="bg-[#A91D32] hover:bg-[#8E1729] text-white text-xs h-9">
            <Link href="/admin/menus/create">
              <PlusCircle className="w-4 h-4 mr-1.5" /> Publish New Menu
            </Link>
          </Button>
          <Button asChild variant="outline" className="text-xs h-9">
            <Link href="/admin/food-records">
              <Scale className="w-4 h-4 mr-1.5 text-slate-500" /> Record Wastage
            </Link>
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Today's Opt-in Headcount"
          value={totalOptedInToday}
          subtitle="Total declared dining students"
          icon={Users}
          color="emerald"
        />

        <MetricCard
          title="Recent Food Wastage"
          value={`${currentWastagePct}%`}
          subtitle={parseFloat(currentWastagePct) > 15 ? "Above 15% threshold" : "Optimal range"}
          icon={Scale}
          color={parseFloat(currentWastagePct) > 15 ? "rose" : "emerald"}
        />

        <MetricCard
          title="Average Meal Rating"
          value={`${avgRating} ★`}
          subtitle={`Across ${allRatings.length} student reviews`}
          icon={Star}
          color="amber"
        />

        <MetricCard
          title="Low Stock Alerts"
          value={lowStockCount}
          subtitle="Items below min reorder point"
          icon={ShoppingBag}
          color={lowStockCount > 0 ? "rose" : "slate"}
        />
      </div>

      {/* Active AI Recommendations */}
      {aiRecommendations.length > 0 && (
        <Card className="border-[#FFBFA5] bg-[#FFF5EF] rounded-[20px] shadow-[0_18px_45px_-34px_rgba(36,29,27,0.28)]">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-emerald-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" /> AI Wastage & Quality Insights
            </CardTitle>
            <Button asChild variant="link" size="sm" className="text-xs text-emerald-800">
              <Link href="/admin/ai-insights">Open full engine →</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {aiRecommendations.slice(0, 2).map((rec, idx) => (
              <div
                key={idx}
                className="p-3 bg-white rounded-xl border border-emerald-100 flex items-start gap-3 shadow-xs"
              >
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-800">{rec.title}</p>
                    <Badge variant={rec.priority === "critical" ? "destructive" : "warning"} className="text-[10px] py-0 px-1.5">
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rec.message}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Two Column Layout: Today's Menus & Quick Operational Shortlinks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Menus Status */}
        <Card className="lg:col-span-2 rounded-[20px] border-[#EADCD6] shadow-[0_18px_45px_-34px_rgba(36,29,27,0.32)]">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-800">
              Today&apos;s Service Menus
            </CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-xs text-slate-500">
              <Link href="/admin/menus">View All Menus →</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {todayMenus.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No menus created for today yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {todayMenus.map((m) => (
                  <div key={m.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 capitalize text-sm">
                          {m.meal_type}
                        </span>
                        <span className="text-xs text-slate-400">
                          {m.serving_start_time} - {m.serving_end_time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate max-w-md">
                        {m.items?.map((i) => i.name).join(", ") || "No dishes specified"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-700 block">
                          {m.expected_attendance || 0} students
                        </span>
                        <span className="text-[10px] text-slate-400">Opted in</span>
                      </div>
                      <Button asChild variant="outline" size="sm" className="text-xs h-8">
                        <Link href={`/admin/menus`}>Edit</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Operations Checklist */}
        <Card className="rounded-[20px] border-[#EADCD6] shadow-[0_18px_45px_-34px_rgba(36,29,27,0.32)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-slate-800">
              Operational Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            <Link
              href="/admin/attendance"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-xs font-semibold text-slate-700"
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-emerald-600" /> Review Attendance Demand
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              href="/admin/food-records"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-xs font-semibold text-slate-700"
            >
              <span className="flex items-center gap-2.5">
                <Scale className="w-4 h-4 text-emerald-600" /> Enter Leftover Weights
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              href="/admin/reports"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-xs font-semibold text-slate-700"
            >
              <span className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Weekly Wastage Charts
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <Link
              href="/admin/recipes"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all text-xs font-semibold text-slate-700"
            >
              <span className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600" /> Match Recipes to Inventory
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
