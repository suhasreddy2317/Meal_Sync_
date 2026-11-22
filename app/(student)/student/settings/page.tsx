"use client";

import { useState } from "react";
import { Settings, Bell, Lock, LogOut, ShieldCheck, UserCheck } from "lucide-react";
import { logoutAction } from "@/app/actions/auth-actions";
import { toast } from "sonner";

export default function StudentSettingsPage() {
  const [mealAlerts, setMealAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [cutoffReminders, setCutoffReminders] = useState(true);

  const handleSavePreferences = () => {
    toast.success("Preferences saved successfully!");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* 1. TOP HERO HEADER ROW: Left Eyebrow+H1+Subtitle, Right compact KPI stat chips */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Settings className="w-3.5 h-3.5 text-amber-500" />
            <span>Preferences & Account Settings</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Account Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure notification preferences, security settings, and dining notifications.
          </p>
        </div>

        {/* Right-aligned compact KPI stat cards */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                Protected
              </p>
              <p className="text-[10px] text-emerald-700 font-medium">
                Standard Security
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                Alerts Active
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Push & Cutoffs On
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                Role: Student
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Central Mess 1
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-semibold text-slate-900">Notification Preferences</h2>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-900 block">Daily Menu Publication Alerts</span>
                <span className="text-[11px] text-slate-500">Receive in-app alerts whenever new menus are released</span>
              </div>
              <input
                type="checkbox"
                checked={mealAlerts}
                onChange={(e) => setMealAlerts(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-900 block">Cutoff Deadline Reminders</span>
                <span className="text-[11px] text-slate-500">Alert me 30 minutes before meal opt-in locks</span>
              </div>
              <input
                type="checkbox"
                checked={cutoffReminders}
                onChange={(e) => setCutoffReminders(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-900 block">Payment & Wallet Notifications</span>
                <span className="text-[11px] text-slate-500">Notify upon recharge, receipt generation & deductions</span>
              </div>
              <input
                type="checkbox"
                checked={paymentAlerts}
                onChange={(e) => setPaymentAlerts(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-semibold transition-colors shadow-xs"
          >
            Save Notification Settings
          </button>
        </div>

        {/* Security & Password */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-semibold text-slate-900">Security & Password</h2>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">New Password</label>
              <input
                type="password"
                placeholder="Minimum 6 characters"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
              />
            </div>

            <button
              onClick={() => toast.success("Password updated successfully!")}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold transition-colors shadow-xs"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* Sign Out Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Sign Out of MealSync</h3>
            <p className="text-xs text-slate-500">End your active dining portal session</p>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
