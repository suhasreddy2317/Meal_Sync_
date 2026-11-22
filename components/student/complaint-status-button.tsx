"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ComplaintModal } from "@/components/student/complaint-modal";

export function ComplaintStatusButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
      >
        <Plus className="w-4 h-4" />
        <span>New Complaint</span>
      </button>

      <ComplaintModal open={open} onOpenChange={setOpen} />
    </>
  );
}
