"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { TopUpModal } from "@/components/student/topup-modal";

export function TopUpModalButton({ currentBalance }: { currentBalance: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
      >
        <Plus className="w-4 h-4" />
        <span>Top Up Wallet</span>
      </button>

      <TopUpModal open={open} onOpenChange={setOpen} currentBalance={currentBalance} />
    </>
  );
}
