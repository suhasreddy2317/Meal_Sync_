import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive?: boolean;
  };
  color?: "emerald" | "amber" | "rose" | "blue" | "slate";
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "emerald",
}: MetricCardProps) {
  const colorStyles = {
    emerald: "bg-[#24866B]/10 text-[#24866B] border-[#24866B]/15",
    amber: "bg-[#FFBFA5]/45 text-[#A91D32] border-[#FFBFA5]",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <Card className="rounded-[20px] border-[#EADCD6] bg-white shadow-[0_18px_45px_-34px_rgba(36,29,27,0.32)] hover:-translate-y-0.5 hover:shadow-[0_22px_55px_-32px_rgba(169,29,50,0.25)] transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-[#71645F] uppercase tracking-wider">
              {title}
            </p>
            <div className="text-2xl font-bold text-[#241D1B] tracking-tight">
              {value}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            )}
            {trend && (
              <p
                className={cn(
                  "text-xs font-semibold mt-1",
                  trend.positive ? "text-emerald-600" : "text-rose-600"
                )}
              >
                {trend.value}
              </p>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl border p-2.5",
              colorStyles[color]
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
