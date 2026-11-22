"use client";

import Link from "next/link";
import { LogOut, User, Calendar, Star, LayoutDashboard } from "lucide-react";
import { NotificationBell } from "@/components/shared/notification-bell";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions/auth-actions";
import { Profile, Notification } from "@/lib/types/database";
import { QubiteLogo } from "@/components/shared/qubite-logo";

interface NavbarProps {
  user: Profile | null;
  notifications?: Notification[];
}

export function Navbar({ user, notifications = [] }: NavbarProps) {
  const isStudent = user?.role === "student";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link
            href={isStudent ? "/student/dashboard" : "/admin/dashboard"}
            className="flex items-center gap-2.5 font-extrabold text-slate-900 text-lg tracking-tight hover:opacity-95 transition-opacity"
          >
            <QubiteLogo size="sm" />
            <span>Meal<span className="text-[#EF6A32]">Sync</span></span>
          </Link>

          {/* Student Desktop Nav Links */}
          {isStudent && (
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
              <Link
                href="/student/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" /> Today&apos;s Meals
              </Link>
              <Link
                href="/student/menu"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Calendar className="w-4 h-4" /> 7-Day Menu
              </Link>
              <Link
                href="/student/ratings"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Star className="w-4 h-4" /> Rate Meals
              </Link>
            </nav>
          )}
        </div>

        {/* Right Action Icons & Profile */}
        <div className="flex items-center gap-3">
          {user && <NotificationBell notifications={notifications} />}

          {user && (
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-semibold text-slate-800">
                {user.full_name}
              </span>
              <span className="text-[11px] text-slate-500 capitalize">
                {user.role} {user.roll_number ? `(${user.roll_number})` : ""}
              </span>
            </div>
          )}

          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-red-600 hover:bg-red-50 h-9 px-2.5"
              title="Sign out"
            >
              <LogOut className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline text-xs">Logout</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
