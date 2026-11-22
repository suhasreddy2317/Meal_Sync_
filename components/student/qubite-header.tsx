"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, LogOut, User, Settings, Plus } from "lucide-react";
import { NotificationBell } from "@/components/shared/notification-bell";
import { logoutAction } from "@/app/actions/auth-actions";
import { Notification, Profile } from "@/lib/types/database";
import { QubiteLogo } from "@/components/shared/qubite-logo";

interface QubiteHeaderProps {
  user: Profile | null;
  notifications?: Notification[];
}

export function QubiteHeader({ user, notifications = [] }: QubiteHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const searchResults = [
    { title: "Weekly Menu", href: "/student/menu", desc: "View all 7 days of meals" },
    { title: "Meal Opt-in & Attendance", href: "/student/my-meals", desc: "Declare Yes/No for upcoming meals" },
    { title: "Raise a Complaint", href: "/student/complaints", desc: "Submit food quality or hygiene issues" },
    { title: "Wallet Recharge", href: "/student/payments", desc: "Top up your dining balance" },
    { title: "Submit Meal Feedback", href: "/student/feedback", desc: "Rate today's served food 1-5 stars" },
  ].filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="h-16 bg-white/90 border-b border-[#EADCD6] px-6 flex items-center justify-between sticky top-0 z-30 gap-4 backdrop-blur-xl">
      {/* Mobile Brand Logo */}
      <div className="lg:hidden flex items-center shrink-0">
        <Link href="/student/dashboard" className="flex items-center gap-2 group">
          <QubiteLogo size="xs" />
          <span className="font-extrabold text-sm text-slate-900 group-hover:text-[#A91D32] transition-colors">MealSync</span>
        </Link>
      </div>

      {/* Left: Global Search Input with ⌘ K Shortcut */}
      <div className="w-full max-w-md hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search anything (meals, complaints, wallet)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            className="w-full h-10 pl-10 pr-12 bg-[#FFF5EF] border border-[#EADCD6] rounded-xl text-xs text-[#241D1B] placeholder:text-[#71645F] focus:outline-none focus:ring-2 focus:ring-[#EF6A32]/20 focus:border-[#EF6A32] transition-all"
          />
          <kbd className="absolute right-3 top-2.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-white border border-slate-200 rounded-md shadow-2xs pointer-events-none">
            ⌘ K
          </kbd>

          {/* Quick Search Autocomplete Dropdown */}
          {searchOpen && searchQuery.trim().length > 0 && (
            <div
              className="absolute left-0 right-0 top-12 bg-white border border-slate-200 rounded-2xl shadow-lg p-2 z-50 space-y-1 animate-in fade-in-0 duration-150"
              onMouseLeave={() => setSearchOpen(false)}
            >
              {searchResults.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400">
                  No matching pages or dishes found.
                </div>
              ) : (
                searchResults.map((res, i) => (
                  <Link
                    key={i}
                    href={res.href}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex flex-col p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-900">{res.title}</span>
                    <span className="text-[11px] text-slate-500">{res.desc}</span>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Quick Action CTA + Notification Bell + Student Profile Pill */}
      <div className="flex items-center gap-3">
        {/* Contextual Quick-Action CTA */}
        <Link
          href="/student/feedback"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#A91D32] hover:bg-[#8E1729] text-white text-xs font-semibold shadow-[0_10px_20px_-14px_rgba(169,29,50,0.8)] transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>+ Rate Quick Meal</span>
        </Link>

        {/* Notification Bell Component */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-1">
          <NotificationBell notifications={notifications} />
        </div>

        {/* Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 p-1.5 pr-3 rounded-xl transition-colors focus:outline-none"
          >
            <div className="h-8 w-8 rounded-lg overflow-hidden bg-amber-100 border border-amber-300 flex items-center justify-center font-bold text-xs text-slate-900 shrink-0">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{user?.full_name?.charAt(0) || "A"}</span>
              )}
            </div>

            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {user?.full_name || "Aarav Sharma"}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  ROLE:
                </span>
                <span className="text-[10px] font-bold text-slate-950 bg-amber-400 px-1.5 py-0.2 rounded-md">
                  Student
                </span>
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div
              className="absolute right-0 top-12 w-52 bg-white border border-slate-200 rounded-2xl shadow-lg p-2 z-50 space-y-1 animate-in fade-in-0 duration-150"
              onMouseLeave={() => setProfileDropdownOpen(false)}
            >
              <div className="p-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.full_name || "Aarav Sharma"}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email || "student1@mess.college.edu"}</p>
                <p className="text-[10px] font-mono text-amber-700 font-bold mt-1">
                  Roll: {user?.roll_number || "2024CS001"}
                </p>
              </div>

              <Link
                href="/student/profile"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>My Profile</span>
              </Link>

              <Link
                href="/student/settings"
                onClick={() => setProfileDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Account Settings</span>
              </Link>

              <div className="pt-1 border-t border-slate-100">
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
