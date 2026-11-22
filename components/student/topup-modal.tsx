"use client";

import { useState } from "react";
import { Wallet, CheckCircle2, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { topUpWalletAction } from "@/app/actions/wallet-actions";
import { toast } from "sonner";

interface TopUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
}

export function TopUpModal({ open, onOpenChange, currentBalance }: TopUpModalProps) {
  const [amount, setAmount] = useState<number>(500);
  const [loading, setLoading] = useState(false);
  const quickAmounts = [100, 250, 500, 1000];

  const handleTopUp = async () => {
    if (amount <= 0) return;
    setLoading(true);

    const res = await topUpWalletAction(amount);
    setLoading(false);

    if (res.success) {
      toast.success(`Successfully recharged ₹${amount}! New balance: ₹${res.newBalance}`);
      onOpenChange(false);
    } else {
      toast.error(res.error || "Failed to recharge wallet");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700">
              <Wallet className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold">Top Up MealSync Wallet</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500">
            Instant wallet recharge for hostel meal bookings and special dishes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Current Balance Banner */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Current Balance</span>
            <span className="text-lg font-bold text-slate-900">₹{currentBalance}</span>
          </div>

          {/* Quick Amounts */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Select Amount</label>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                    amount === q
                      ? "bg-amber-400 text-slate-950 border-amber-400 font-bold"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  +₹{q}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Or Enter Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">₹</span>
              <input
                type="number"
                min="10"
                step="50"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full h-10 pl-8 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            Zero transaction fees on UPI, Debit Card, and NetBanking.
          </p>
        </div>

        <DialogFooter className="gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading || amount <= 0}
            onClick={handleTopUp}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            {loading ? "Recharging..." : `Add ₹${amount} to Wallet`}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
