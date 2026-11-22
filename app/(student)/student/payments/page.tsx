import { getCurrentUser } from "@/app/actions/auth-actions";
import { getWalletDataForStudent } from "@/lib/data/mess-store";
import { ArrowDownRight, ArrowUpRight, CreditCard, Sparkles, TrendingUp } from "lucide-react";
import { TopUpModalButton } from "@/components/student/topup-modal-button";
import { DownloadReceiptButton } from "@/components/student/download-receipt-button";

export const dynamic = "force-dynamic";

export default async function StudentPaymentsPage() {
  const user = await getCurrentUser();
  const walletData = getWalletDataForStudent(user?.id || "u-student-001");

  return (
    <div className="space-y-8">
      {/* 1. TOP HERO HEADER ROW: Left Eyebrow+H1+Subtitle, Right compact KPI stat chips */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dining Wallet & Transactions</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Payments & Wallet Balance
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your prepaid dining credit, review meal deductions, and top up via UPI or Card.
          </p>
        </div>

        {/* Right-aligned compact KPI stat cards */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                ₹{walletData.balance}
              </p>
              <p className="text-[10px] text-emerald-700 font-medium">
                Current Balance
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                ₹1,450
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Spent this Month
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                ₹65.90
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Avg Cost / Meal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Wallet Summary Card & Topup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 p-7 rounded-2xl bg-slate-900 text-white relative overflow-hidden shadow-md flex flex-col justify-between min-h-[190px] border border-slate-800">
          <div className="absolute right-0 top-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Hostel Dining Balance
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              ID: {user?.roll_number || "2024CS001"}
            </span>
          </div>

          <div className="my-4 relative z-10">
            <div className="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-baseline gap-1.5">
              ₹{walletData.balance}
              <span className="text-sm font-semibold text-slate-400">INR</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Available for meal bookings & add-on delicacies</p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400 relative z-10">
            <span>Mess: Central Mess Hall 1</span>
            <span className="text-emerald-400 font-semibold">● Active Account</span>
          </div>
        </div>

        {/* Quick Topup CTA Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Quick Recharge
            </span>
            <div className="my-2">
              <span className="text-2xl font-bold text-slate-900">Recharge Balance</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Instant UPI, NetBanking & Card topup</p>
            </div>
          </div>

          <TopUpModalButton currentBalance={walletData.balance} />
        </div>
      </div>

      {/* 3. Transactions History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Transaction History
          </h2>
          <span className="text-xs font-medium text-slate-500">Currency: INR (₹)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="pb-3 px-3 font-semibold">Transaction</th>
                <th className="pb-3 px-3 font-semibold">Type</th>
                <th className="pb-3 px-3 font-semibold">Amount</th>
                <th className="pb-3 px-3 font-semibold">Status</th>
                <th className="pb-3 px-3 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {walletData.transactions.map((tx) => {
                const isCredit = tx.amount > 0;

                return (
                  <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isCredit ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {isCredit ? (
                            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{tx.description}</p>
                          <span className="text-[10px] text-slate-400">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 capitalize font-medium text-slate-600">
                      {tx.type.replace("_", " ")}
                    </td>

                    <td className="py-3.5 px-3 font-bold text-sm">
                      <span className={isCredit ? "text-emerald-600" : "text-slate-900"}>
                        {isCredit ? "+" : ""}₹{Math.abs(tx.amount)}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        {tx.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <DownloadReceiptButton transactionId={tx.id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
