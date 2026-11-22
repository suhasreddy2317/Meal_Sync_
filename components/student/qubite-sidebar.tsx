"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  UtensilsCrossed,
  Star,
  AlertCircle,
  CreditCard,
  Bell,
  User,
  Settings,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QubiteLogo } from "@/components/shared/qubite-logo";

interface QubiteSidebarProps {
  unreadNotifsCount?: number;
}

const navItems = [
  { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student/menu", label: "Weekly Menu", icon: Calendar },
  { href: "/student/my-meals", label: "My Meals", icon: UtensilsCrossed },
  { href: "/student/feedback", label: "Feedback", icon: Star },
  { href: "/student/complaints", label: "Complaints", icon: AlertCircle },
  { href: "/student/payments", label: "Payments", icon: CreditCard },
  { href: "/student/notifications", label: "Notifications", icon: Bell, badge: true },
  { href: "/student/profile", label: "Profile", icon: User },
  { href: "/student/settings", label: "Settings", icon: Settings },
];

export function QubiteSidebar({ unreadNotifsCount = 0 }: QubiteSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-[#241D1B] text-[#FFF5EF] flex flex-col justify-between p-4 border-r border-[#A91D32]/25 shrink-0 sticky top-0 select-none z-40">
      {/* Top Brand Header */}
      <div>
        <div className="p-2 pb-4">
          <Link href="/student/dashboard" className="flex items-center gap-3 group">
            <QubiteLogo size="md" className="group-hover:scale-105 transition-transform shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-xl text-white tracking-tight">
                  MealSync
                </h1>
                <span className="text-[10px] font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded">
                  MEALSYNC
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Smarter Meals. Seamless Management.
              </p>
            </div>
          </Link>
        </div>

        {/* Dynamic Navigation Menu */}
        <nav className="px-1 py-1 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/student/my-meals" && pathname === "/student/meal-plans") ||
              (item.href === "/student/feedback" && pathname === "/student/ratings");

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-[#A91D32] text-white font-semibold rounded-xl shadow-[0_10px_24px_-14px_rgba(169,29,50,0.8)]"
                    : "text-[#D9CFCB] hover:text-white hover:bg-white/8 rounded-xl"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors shrink-0",
                      isActive
                        ? "text-white stroke-[2.5]"
                        : "text-[#D9CFCB] group-hover:text-[#FFBFA5]"
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && unreadNotifsCount > 0 && (
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.2 rounded-full",
                      isActive ? "bg-white/15 text-white" : "bg-[#FFBFA5] text-[#A91D32]"
                    )}
                  >
                    {unreadNotifsCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Need Assistance Support Card */}
      <div className="p-1 pt-2">
        <div className="bg-white/7 border border-[#FFBFA5]/15 rounded-xl p-3.5 space-y-2 text-[#FFF5EF]">
          <div className="flex items-center gap-2 text-[#FFBFA5]">
            <Headphones className="w-4 h-4" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Need Assistance?
            </span>
          </div>
          <p className="text-[11px] text-[#D9CFCB] leading-snug">
            Contact your warden or hostel catering representative anytime.
          </p>
          <div className="pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
            <span className="font-semibold text-white">Central Mess Hall 1</span>
            <span className="text-amber-400 font-mono font-bold">Ext. 204</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
