"use client";

import { useEffect, useState } from "react";
import { getCutoffStatus, CutoffStatus } from "@/lib/services/cutoff-manager";
import { Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CutoffCountdownProps {
  menuDate: string;
  cutoffTime: string;
  className?: string;
  onCutoffReached?: () => void;
}

export function CutoffCountdown({
  menuDate,
  cutoffTime,
  className,
  onCutoffReached,
}: CutoffCountdownProps) {
  const [status, setStatus] = useState<CutoffStatus | null>(null);

  useEffect(() => {
    // Initial calculation
    const initial = getCutoffStatus(menuDate, cutoffTime);
    setStatus(initial);

    if (initial.isPassed) return;

    // Tick every second
    const interval = setInterval(() => {
      const current = getCutoffStatus(menuDate, cutoffTime);
      setStatus(current);

      if (current.isPassed) {
        clearInterval(interval);
        onCutoffReached?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [menuDate, cutoffTime, onCutoffReached]);

  if (!status) {
    return (
      <span className="inline-flex items-center text-xs text-slate-400">
        <Clock className="w-3.5 h-3.5 mr-1 animate-spin" /> Checking cutoff...
      </span>
    );
  }

  if (status.isPassed) {
    return (
      <span
        className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200",
          className
        )}
      >
        <Lock className="w-3.5 h-3.5 mr-1" /> Plan Locked (Cutoff Passed)
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200",
        className
      )}
    >
      <Clock className="w-3.5 h-3.5 mr-1" /> Cutoff: {status.formattedTimeRemaining}
    </span>
  );
}
