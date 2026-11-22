import { getCurrentUser } from "@/app/actions/auth-actions";
import {
  getAllMenus,
  getStore,
  getRecentActivities,
  getComplaintsFromStore,
} from "@/lib/data/mess-store";
import { QubiteStatCards } from "@/components/student/qubite-stat-card";
import { TodaysMenuCard } from "@/components/student/todays-menu-card";
import { MealAttendanceChart } from "@/components/student/attendance-chart";
import { QuickActionsCard } from "@/components/student/quick-actions-card";
import { RecentActivityCard } from "@/components/student/recent-activity-card";
import { PromotionalBanner } from "@/components/student/promotional-banner";
import { Calendar as CalendarIcon, Sparkles, TrendingUp, Wallet } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const user = await getCurrentUser();
  const store = getStore();
  const todayStr = new Date().toISOString().split("T")[0];

  const todayMenus = getAllMenus(todayStr);
  const activities = getRecentActivities();
  const complaints = user ? getComplaintsFromStore(user.id) : [];
  const pendingComplaints = complaints.filter((c) => c.status !== "Resolved").length;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const studentFirstName = user?.full_name?.split(" ")[0] || "Aarav";

  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayNumber = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const weekNumber = Math.ceil(dayNumber / 7);

  return (
    <div className="space-y-8 pb-6 text-[#241D1B]">
      {/* 1. TOP HERO HEADER ROW: Left Eyebrow+H1+Subtitle, Right compact KPI stat chips */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#71645F] mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#EF6A32]" />
            <span>Student Mess Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#241D1B]">
            {greeting}, {studentFirstName}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here&apos;s what&apos;s happening in your mess today at Central Mess Hall 1.
          </p>
        </div>

        {/* Right-aligned compact KPI stat cards */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-[#EADCD6] rounded-[16px] px-4 py-2.5 shadow-[0_12px_28px_-24px_rgba(36,29,27,0.38)] flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#FFBFA5]/45 border border-[#FFBFA5] text-[#A91D32] flex items-center justify-center shrink-0">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                {formattedDate}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Week {weekNumber} • Day {dayNumber}
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#EADCD6] rounded-[16px] px-4 py-2.5 shadow-[0_12px_28px_-24px_rgba(36,29,27,0.38)] flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#EF6A32]/10 border border-[#EF6A32]/20 text-[#EF6A32] flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                82% Turnout
              </p>
              <p className="text-[10px] text-emerald-700 font-medium">
                +2% vs Last Week
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#EADCD6] rounded-[16px] px-4 py-2.5 shadow-[0_12px_28px_-24px_rgba(36,29,27,0.38)] flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#A91D32] text-white flex items-center justify-center shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                ₹{user?.wallet_balance ?? 450}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Dining Balance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <QubiteStatCards
        walletBalance={user?.wallet_balance ?? 450}
        pendingComplaintsCount={pendingComplaints > 0 ? pendingComplaints : 1}
      />

      {/* 3. TODAY'S MENU SECTION */}
      <TodaysMenuCard menus={todayMenus} />

      {/* 4. ASYMMETRIC GRID: 8 columns (Attendance & Timeline) + 4 columns (Quick Actions & Banner) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <MealAttendanceChart />
          <RecentActivityCard activities={activities} />
        </div>
        <div className="lg:col-span-4 space-y-6">
          <QuickActionsCard />
          <PromotionalBanner />
        </div>
      </div>
    </div>
  );
}
