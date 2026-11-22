"use client";

import { useState } from "react";
import { Bell, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/app/actions/notification-actions";
import { Notification } from "@/lib/types/database";
import { formatDistanceToNow } from "date-fns";

interface NotificationBellProps {
  notifications: Notification[];
}

export function NotificationBell({ notifications = [] }: NotificationBellProps) {
  const [items, setItems] = useState<Notification[]>(notifications);
  const [open, setOpen] = useState(false);

  const unreadCount = items.filter((n) => !n.is_read).length;

  const handleMarkAsRead = async (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_read: true } : item))
    );
    await markNotificationReadAction(id);
  };

  const handleMarkAllAsRead = async () => {
    setItems((prev) => prev.map((item) => ({ ...item, is_read: true })));
    await markAllNotificationsReadAction();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="relative p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label={`Notifications, ${unreadCount} unread`}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-sm animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-100">
          <DialogTitle className="text-base font-semibold flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" /> Notifications ({items.length})
          </DialogTitle>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1 h-8 px-2"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </Button>
          )}
        </DialogHeader>

        <div className="max-h-[380px] overflow-y-auto space-y-2 py-2 pr-1">
          {items.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No notifications yet.
            </div>
          ) : (
            items.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-lg border transition-colors flex items-start justify-between gap-3 ${
                  notif.is_read
                    ? "bg-white border-slate-100 text-slate-600"
                    : "bg-emerald-50/50 border-emerald-100 text-slate-900"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{notif.title}</p>
                    {!notif.is_read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {notif.message}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                  </p>
                </div>

                {!notif.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="text-slate-400 hover:text-emerald-600 p-1 rounded transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
