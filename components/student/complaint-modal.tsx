"use client";

import { useState } from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { submitComplaintAction } from "@/app/actions/complaint-actions";
import { toast } from "sonner";

interface ComplaintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComplaintModal({ open, onOpenChange }: ComplaintModalProps) {
  const [category, setCategory] = useState<any>("Food Quality");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<any>("Normal");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in both title and description");
      return;
    }

    setLoading(true);
    const res = await submitComplaintAction({
      category,
      title,
      description,
      urgency,
    });
    setLoading(false);

    if (res.success) {
      toast.success(`Complaint #${res.complaint?.id} submitted successfully!`);
      setTitle("");
      setDescription("");
      onOpenChange(false);
    } else {
      toast.error(res.error || "Failed to submit complaint");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white rounded-2xl border border-slate-200 p-6 shadow-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2 text-slate-900">
              <div className="h-9 w-9 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-700">
                <AlertCircle className="w-5 h-5" />
              </div>
              <DialogTitle className="text-lg font-bold">Raise a Hostel Mess Complaint</DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500">
              Submit an issue directly to the hostel catering committee and mess contractor.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Complaint Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="Food Quality">Food Quality</option>
                  <option value="Hygiene">Hygiene & Cleanliness</option>
                  <option value="Food Quantity">Food Quantity / Shortage</option>
                  <option value="Late Serving">Late Serving Timings</option>
                  <option value="Menu Issues">Menu Non-Adherence</option>
                  <option value="Other">Other Issues</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Urgency Level</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Subject / Title</label>
              <input
                type="text"
                placeholder="Brief summary of the issue..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Description</label>
              <textarea
                rows={3}
                placeholder="Provide specific details (meal time, table, dish name, or observation)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white"
              />
            </div>
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
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              {loading ? "Submitting..." : "Submit Complaint"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
