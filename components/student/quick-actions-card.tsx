"use client";

import { useState } from "react";
import Link from "next/link";
import { UtensilsCrossed, AlertCircle, Wallet, Star } from "lucide-react";
import { TopUpModal } from "@/components/student/topup-modal";
import { ComplaintModal } from "@/components/student/complaint-modal";
import { toast } from "sonner";

export function QuickActionsCard() {
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [complaintOpen, setComplaintOpen] = useState(false);

  const handleMarkMealToday = () => {
    toast.success("Today's dinner meal is marked as Attending! Kitchen informed.");
  };

  return (
    <>
      <div className="bg-white rounded-[20px] p-6 border border-[#EADCD6] shadow-[0_18px_45px_-34px_rgba(36,29,27,0.32)] space-y-4">
        <div>
          <h3 className="font-semibold text-base text-slate-900 tracking-tight">
            Quick Actions
          </h3>
          <p className="text-[11px] text-slate-500">Frequently used hostel mess shortcuts</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Action 1: Mark Meal */}
          <button
            onClick={handleMarkMealToday}
            className="p-4 rounded-xl bg-[#FFBFA5]/30 hover:bg-[#FFBFA5]/50 border border-[#FFBFA5]/70 flex flex-col items-center justify-center text-center gap-2 transition-all hover:-translate-y-0.5 active:scale-[0.99] group"
          >
            <div className="h-9 w-9 rounded-lg bg-white text-amber-700 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-900">
              Mark Meal (Today)
            </span>
          </button>

          {/* Action 2: Raise Complaint */}
          <button
            onClick={() => setComplaintOpen(true)}
            className="p-4 rounded-xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200/60 flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] group"
          >
            <div className="h-9 w-9 rounded-lg bg-white text-rose-700 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-900">
              Raise Complaint
            </span>
          </button>

          {/* Action 3: Top Up Wallet */}
          <button
            onClick={() => setTopUpOpen(true)}
            className="p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/60 flex flex-col items-center justify-center text-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] group"
          >
            <div className="h-9 w-9 rounded-lg bg-white text-emerald-700 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-900">
              Top Up Wallet
            </span>
          </button>

          {/* Action 4: Give Feedback */}
          <Link
            href="/student/feedback"
            className="p-4 rounded-xl bg-[#A91D32]/5 hover:bg-[#A91D32]/10 border border-[#A91D32]/15 flex flex-col items-center justify-center text-center gap-2 transition-all hover:-translate-y-0.5 active:scale-[0.99] group"
          >
            <div className="h-9 w-9 rounded-lg bg-white text-indigo-700 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <Star className="w-4 h-4 fill-indigo-600" />
            </div>
            <span className="text-xs font-semibold text-slate-900">
              Give Feedback
            </span>
          </Link>
        </div>
      </div>

      <TopUpModal open={topUpOpen} onOpenChange={setTopUpOpen} currentBalance={450} />
      <ComplaintModal open={complaintOpen} onOpenChange={setComplaintOpen} />
    </>
  );
}
