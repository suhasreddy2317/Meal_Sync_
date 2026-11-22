"use client";

import Link from "next/link";
import { ArrowRight, Clock, CheckCircle2, Wallet, Utensils, AlertCircle } from "lucide-react";
import { ActivityItem } from "@/lib/types/database";

interface RecentActivityCardProps {
  activities?: ActivityItem[];
}

export function RecentActivityCard({ activities = [] }: RecentActivityCardProps) {
  const defaultActivities: ActivityItem[] = [
    {
      id: "act-1",
      title: "Meal marked for today",
      timestamp: "2 mins ago",
      type: "meal",
    },
    {
      id: "act-2",
      title: "Wallet recharged with ₹500",
      timestamp: "1 hour ago",
      type: "wallet",
    },
    {
      id: "act-3",
      title: "New menu updated for dinner",
      timestamp: "3 hours ago",
      type: "menu",
    },
    {
      id: "act-4",
      title: "Complaint #C-104 updated to In Progress",
      timestamp: "Yesterday",
      type: "complaint",
    },
  ];

  const list = activities.length > 0 ? activities : defaultActivities;

  const typeConfig: Record<string, { bg: string; dot: string; icon: any }> = {
    meal: { bg: "bg-amber-50", dot: "bg-amber-400", icon: Utensils },
    wallet: { bg: "bg-emerald-50", dot: "bg-emerald-500", icon: Wallet },
    menu: { bg: "bg-blue-50", dot: "bg-blue-500", icon: CheckCircle2 },
    complaint: { bg: "bg-rose-50", dot: "bg-rose-500", icon: AlertCircle },
    feedback: { bg: "bg-indigo-50", dot: "bg-indigo-500", icon: CheckCircle2 },
  };

  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#EADCD6] shadow-[0_18px_45px_-34px_rgba(36,29,27,0.32)] flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-base text-slate-900 tracking-tight">
            Recent Activity
          </h3>
          <p className="text-[11px] text-slate-500">Your latest mess events & logs</p>
        </div>

        <Link
          href="/student/notifications"
          className="text-xs font-semibold text-slate-700 hover:text-amber-600 flex items-center gap-1 group transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 space-y-4 my-2 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200">
        {list.slice(0, 4).map((item) => {
          const cfg = typeConfig[item.type] || typeConfig.meal;

          return (
            <div key={item.id} className="relative flex items-start gap-3 group">
              {/* Timeline Indicator Dot */}
              <span
                className={`absolute -left-[23px] top-1.5 h-3 w-3 rounded-full ${cfg.dot} ring-4 ring-white shadow-2xs`}
              />

              <div className="flex-1 space-y-0.5">
                <p className="text-xs font-semibold text-slate-800 leading-tight group-hover:text-amber-700 transition-colors">
                  {item.title}
                </p>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" /> {item.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-slate-100 text-center">
        <span className="text-[10px] text-slate-400">
          Showing real-time student dining activities
        </span>
      </div>
    </div>
  );
}
