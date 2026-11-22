"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  Scale,
  Star,
  BarChart3,
  Sparkles,
  ShoppingBag,
  ChefHat,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth-actions";
import { QubiteLogo } from "@/components/shared/qubite-logo";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/menus", label: "Menu Management", icon: UtensilsCrossed },
  { href: "/admin/attendance", label: "Attendance Headcount", icon: Users },
  { href: "/admin/food-records", label: "Wastage & Food Records", icon: Scale },
  { href: "/admin/ratings", label: "Ratings & Feedback", icon: Star },
  { href: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 },
  { href: "/admin/ai-insights", label: "AI Insights & Demand", icon: Sparkles },
  { href: "/admin/groceries", label: "Grocery Stock", icon: ShoppingBag },
  { href: "/admin/recipes", label: "Recipe Matching", icon: ChefHat },
  { href: "/admin/settings", label: "Mess Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#241D1B] text-[#FFF5EF] flex flex-col justify-between p-4 border-r border-[#A91D32]/25 shrink-0 sticky top-0 select-none z-40">
      {/* Brand Header */}
      <div>
        <div className="p-2 pb-4">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <QubiteLogo size="md" className="group-hover:scale-105 transition-transform shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-xl text-white tracking-tight">
                  MealSync
                </h1>
                <span className="text-[10px] font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Smarter Meals. Seamless Management.
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="px-1 py-1 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-[#A91D32] text-white font-semibold rounded-xl shadow-[0_10px_24px_-14px_rgba(169,29,50,0.8)]"
                    : "text-[#D9CFCB] hover:text-white hover:bg-white/8 rounded-xl"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors shrink-0",
                    isActive
                      ? "text-white stroke-[2.5]"
                      : "text-[#D9CFCB] group-hover:text-[#FFBFA5]"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Sign out */}
      <div className="p-1 pt-2">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
