import { getCurrentUser } from "@/app/actions/auth-actions";
import { getAllMenus, getStore } from "@/lib/data/mess-store";
import { UtensilsCrossed, CheckCircle2, Calendar, TrendingUp, Sparkles, ShieldCheck } from "lucide-react";
import { formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function StudentMyMealsPage() {
  const user = await getCurrentUser();
  const store = getStore();
  const allMenus = getAllMenus();
  const today = new Date().toISOString().split("T")[0];

  const studentPlans = user
    ? store.mealPlans.filter((p) => p.student_id === user.id)
    : [];

  const consumedCount = 18;
  const skippedCount = 4;
  const attendanceRate = "82%";

  const upcomingMeals = allMenus
    .filter((m) => m.menu_date >= today)
    .sort((a, b) => a.menu_date.localeCompare(b.menu_date))
    .slice(0, 8);

  return (
    <div className="space-y-8">
      {/* 1. TOP HERO HEADER ROW: Left Eyebrow+H1+Subtitle, Right compact KPI stat chips */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-500" />
            <span>Dining History & Plans</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            My Meals & Attendance History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track consumed meals, upcoming booked dining slots, and your individual consumption footprint.
          </p>
        </div>

        {/* Right-aligned compact KPI stat cards */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                {consumedCount} Meals
              </p>
              <p className="text-[10px] text-emerald-700 font-medium">
                Attended this month
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                {attendanceRate} Rate
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Consistent Resident
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                ~2.8 kg
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Food Waste Prevented
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ASYMMETRIC GRID (8 cols table, 4 cols summary) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Scheduled Dining Slots Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">
              Upcoming Scheduled Dining Slots
            </h2>
            <span className="text-xs font-medium text-slate-500">
              Next 7 Days
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="pb-3 px-3 font-semibold">Date</th>
                  <th className="pb-3 px-3 font-semibold">Meal Slot</th>
                  <th className="pb-3 px-3 font-semibold">Menu Dishes</th>
                  <th className="pb-3 px-3 font-semibold">Timings</th>
                  <th className="pb-3 px-3 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingMeals.map((m) => {
                  const dateObj = new Date(m.menu_date + "T00:00:00");
                  const formattedDate = dateObj.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-3 font-semibold text-slate-900">{formattedDate}</td>
                      <td className="py-3.5 px-3 font-bold uppercase text-[11px] text-amber-700">
                        {m.meal_type}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        {m.items?.map((i) => i.name).join(" • ") || "Scheduled Dishes"}
                      </td>
                      <td className="py-3.5 px-3 text-slate-400">
                        {formatTime(m.serving_start_time)} – {formatTime(m.serving_end_time)}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <CheckCircle2 className="w-3 h-3" /> Booked
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Allocation & Eco Impact Cards */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-base text-slate-900">
              Dining Allocation
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Hostel Mess</span>
                <span className="font-semibold text-slate-900">{user?.mess_allocation || "Central Mess Hall 1"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Meal Plan</span>
                <span className="font-semibold text-slate-900">All 4 Slots Included</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Dietary Pref</span>
                <span className="font-semibold text-emerald-700">Vegetarian Friendly</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Account Standing</span>
                <span className="font-semibold text-emerald-600">Good Standing</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Smart Conservation</span>
            </div>
            <h4 className="font-bold text-base text-white">
              Every Opt-Out Counts
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              When you skip meals in advance, kitchen cooks adjust portion preparation, directly eliminating commercial food wastage.
            </p>
            <div className="pt-2 border-t border-slate-800 flex justify-between text-xs">
              <span className="text-slate-400">Total Opt-Outs:</span>
              <span className="font-bold text-amber-400">{skippedCount} meals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
