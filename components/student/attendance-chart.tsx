"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { getWeeklyAttendanceChartData } from "@/lib/data/mess-store";
import { ChevronDown, BarChart2 } from "lucide-react";

export function MealAttendanceChart() {
  const [range, setRange] = useState<"This Week" | "Last Week" | "This Month">("This Week");
  const data = getWeeklyAttendanceChartData(range);

  return (
    <div className="bg-white rounded-[20px] p-6 border border-[#EADCD6] shadow-[0_18px_45px_-34px_rgba(36,29,27,0.32)] flex flex-col justify-between">
      {/* Header with Title and Range Dropdown */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[#FFBFA5]/45 border border-[#FFBFA5] text-[#A91D32] flex items-center justify-center">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-slate-900 tracking-tight">
              Meal Attendance
            </h3>
            <p className="text-[11px] text-slate-500">Weekly student turnout rate</p>
          </div>
        </div>

        {/* Range Dropdown */}
        <div className="relative">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as any)}
            className="appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 pr-7 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
          >
            <option value="This Week">This Week</option>
            <option value="Last Week">Last Week</option>
            <option value="This Month">This Month</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-56 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EADCD6" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#64748B", fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              unit="%"
              tick={{ fontSize: 10, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-lg border border-slate-800">
                      <p className="font-bold text-amber-400">{item.day}</p>
                      <p className="text-[11px] text-slate-300">
                        Attendance: <span className="font-bold text-white">{item.attendance}%</span>
                      </p>
                      {item.isToday && (
                        <span className="text-[9px] uppercase tracking-wider font-bold text-amber-400 mt-0.5 block">
                          ● Today
                        </span>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="attendance" radius={[6, 6, 0, 0]} maxBarSize={36}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isToday ? "#A91D32" : "#FFBFA5"}
                  stroke={entry.isToday ? "#EF6A32" : "none"}
                  strokeWidth={entry.isToday ? 1.5 : 0}
                  className="hover:opacity-90 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Summary Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500" />
          <span>Highlighted: Today</span>
        </div>
        <span className="font-semibold text-slate-900">Avg: 84% turn-out</span>
      </div>
    </div>
  );
}
