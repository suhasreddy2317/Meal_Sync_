import { getCurrentUser } from "@/app/actions/auth-actions";
import { getComplaintsFromStore } from "@/lib/data/mess-store";
import { AlertCircle, Clock, CheckCircle2, MessageSquare, ShieldCheck, HelpCircle } from "lucide-react";
import { ComplaintStatusButton } from "@/components/student/complaint-status-button";

export const dynamic = "force-dynamic";

export default async function StudentComplaintsPage() {
  const user = await getCurrentUser();
  const complaints = user ? getComplaintsFromStore(user.id) : [];

  const pendingCount = complaints.filter((c) => c.status !== "Resolved").length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length;

  const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
    Pending: { bg: "bg-amber-50 border-amber-200", text: "text-amber-800", dot: "bg-amber-500" },
    "In Progress": { bg: "bg-blue-50 border-blue-200", text: "text-blue-800", dot: "bg-blue-500" },
    Resolved: { bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800", dot: "bg-emerald-500" },
  };

  return (
    <div className="space-y-8">
      {/* 1. TOP HERO HEADER ROW: Left Eyebrow+H1+Subtitle, Right compact KPI stat chips */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Issue Tracker & Grievances</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Hostel Mess Complaints
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Submit issues concerning food quality, hygiene, or timings directly to the mess committee.
          </p>
        </div>

        {/* Right-aligned compact KPI stat cards */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                {pendingCount > 0 ? `${pendingCount} Active` : "0 Pending"}
              </p>
              <p className="text-[10px] text-amber-700 font-medium">
                Under Review
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                {resolvedCount} Resolved
              </p>
              <p className="text-[10px] text-emerald-700 font-medium">
                Action Completed
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                24h SLA
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Resolution Target
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          Complaint History & Ticket Status
        </h2>
        <ComplaintStatusButton />
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm shadow-sm">
            No complaints logged. Everything looks clean and satisfactory!
          </div>
        ) : (
          complaints.map((c) => {
            const st = statusStyles[c.status] || statusStyles.Pending;

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl text-slate-800">
                      #{c.id}
                    </span>
                    <h3 className="font-semibold text-sm md:text-base text-slate-900">
                      {c.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {c.category}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${st.bg} ${st.text}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                      {c.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {c.description}
                </p>

                {c.admin_remarks && (
                  <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-start gap-2 text-xs text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Mess Committee Remarks:</span>
                      <p className="mt-0.5 text-slate-700">{c.admin_remarks}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                  <span>Logged by {c.student_name}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
