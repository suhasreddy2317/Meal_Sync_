"use client";

import { useState } from "react";
import Link from "next/link";
import { UtensilsCrossed, Wallet, Star, AlertCircle, ArrowUpRight, Plus } from "lucide-react";
import { TopUpModal } from "@/components/student/topup-modal";

interface QubiteStatCardsProps {
  walletBalance?: number;
  pendingComplaintsCount?: number;
}

export function QubiteStatCards({
  walletBalance = 450,
  pendingComplaintsCount = 1,
}: QubiteStatCardsProps) {
  const [topUpOpen, setTopUpOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* CARD 1 – MEALS THIS MONTH */}
        <div className="bg-white rounded-[20px] p-5 border border-[#EADCD6] shadow-[0_18px_45px_-34px_rgba(36,29,27,0.32)] hover:-translate-y-0.5 hover:shadow-[0_22px_55px_-32px_rgba(169,29,50,0.22)] transition-all duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Meals This Month
            </span>
            <div className="h-9 w-9 rounded-xl bg-[#FFBFA5]/45 text-[#A91D32] border border-[#FFBFA5] flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              18 <span className="text-sm text-slate-400 font-semibold">/ 22</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Scheduled mess meals consumed</p>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-slate-500">Attendance Rate</span>
              <span className="text-slate-900 font-bold">82%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#EF6A32] rounded-full transition-all duration-500"
                style={{ width: "82%" }}
              />
            </div>
          </div>
        </div>

        {/* CARD 2 – CURRENT BALANCE */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Current Balance
            </span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              ₹{walletBalance}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active Dining Credit
            </p>
          </div>

          <button
            onClick={() => setTopUpOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-[#A91D32] hover:bg-[#8E1729] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Top Up</span>
          </button>
        </div>

        {/* CARD 3 – AVERAGE RATING */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Average Rating
            </span>
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex items-center justify-center">
              <Star className="w-4 h-4 fill-indigo-600" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-2xl font-bold text-slate-900 tracking-tight flex items-baseline gap-1">
              4.6 <span className="text-sm text-slate-400 font-semibold">/ 5</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+0.2 vs last week</span>
            </div>
          </div>

          <Link
            href="/student/feedback"
            className="w-full py-2 px-3 rounded-xl bg-slate-100/80 hover:bg-amber-100 text-slate-800 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
          >
            Rate Served Food
          </Link>
        </div>

        {/* CARD 4 – PENDING COMPLAINTS */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Complaints
            </span>
            <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-700 border border-rose-200/60 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {pendingComplaintsCount}
            </div>
            <p className="text-[11px] text-amber-700 font-medium mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Ticket #C-104 In Progress
            </p>
          </div>

          <Link
            href="/student/complaints"
            className="w-full py-2 px-3 rounded-xl bg-slate-100/80 hover:bg-rose-50 hover:text-rose-700 text-slate-800 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
          >
            View Ticket Status
          </Link>
        </div>
      </div>

      <TopUpModal open={topUpOpen} onOpenChange={setTopUpOpen} currentBalance={walletBalance} />
    </>
  );
}
