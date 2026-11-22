import { getCurrentUser } from "@/app/actions/auth-actions";
import { getNotificationsForUser } from "@/lib/data/mess-store";
import { Bell, CheckCheck, Utensils, CreditCard, AlertCircle, Sparkles, ShieldCheck } from "lucide-react";
import { markAllNotificationsReadAction } from "@/app/actions/notification-actions";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function StudentNotificationsPage() {
  const user = await getCurrentUser();
  const notifications = user ? getNotificationsForUser(user.id) : [];
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const typeIcons: Record<string, any> = {
    menu_update: Utensils,
    payment: CreditCard,
    complaint: AlertCircle,
    announcement: Sparkles,
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* 1. TOP HERO HEADER ROW: Left Eyebrow+H1+Subtitle, Right compact KPI stat chips */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span>Notification Center & Alerts</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Notifications & Alerts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time meal schedule publications, wallet transactions, and complaint status updates.
          </p>
        </div>

        {/* Right-aligned compact KPI stat cards */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                {notifications.length} Total
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                All Time Alerts
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-700 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                {unreadCount} Unread
              </p>
              <p className="text-[10px] text-rose-700 font-medium">
                Action Pending
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                Live Feed
              </p>
              <p className="text-[10px] text-emerald-700 font-medium">
                Instant Updates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          Recent Notifications
        </h2>

        {unreadCount > 0 && (
          <form
            action={async () => {
              "use server";
              await markAllNotificationsReadAction();
            }}
          >
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Mark All Read</span>
            </button>
          </form>
        )}
      </div>

      {/* Notifications List Container */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No notifications at this time.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notif) => {
              const Icon = typeIcons[notif.type] || Bell;

              return (
                <div
                  key={notif.id}
                  className={`py-4 px-3 flex items-start justify-between gap-4 transition-colors rounded-xl ${
                    !notif.is_read ? "bg-amber-50/50" : "hover:bg-slate-50/70"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shrink-0 mt-0.5 shadow-2xs">
                      <Icon className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 ring-2 ring-white" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{notif.message}</p>
                      <p className="text-[10px] text-slate-400">
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
