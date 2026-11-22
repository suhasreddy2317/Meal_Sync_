"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";

interface DownloadReceiptButtonProps {
  transactionId: string;
}

export function DownloadReceiptButton({ transactionId }: DownloadReceiptButtonProps) {
  const handleDownload = () => {
    toast.success(`Receipt for transaction ${transactionId} downloaded.`);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
      title="Download Receipt"
    >
      <Download className="w-4 h-4" />
    </button>
  );
}
