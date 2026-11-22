"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AnalyticsChartsProps {
  dailyTrends: {
    date: string;
    formattedDate: string;
    prepared: number;
    leftover: number;
    wastage: number;
    attendance: number;
  }[];
}

export function AnalyticsCharts({ dailyTrends }: AnalyticsChartsProps) {
  if (!dailyTrends || dailyTrends.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm">
        Insufficient historical data to render analytics charts.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Prepared vs Leftover Quantities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800">
            Prepared vs. Leftover Quantity (kg)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EADCD6" />
                <XAxis dataKey="formattedDate" tick={{ fontSize: 11, fill: "#71645F" }} />
                <YAxis tick={{ fontSize: 11, fill: "#71645F" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "0.5rem",
                    border: "1px solid #EADCD6",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
                <Bar dataKey="prepared" name="Prepared (kg)" fill="#A91D32" radius={[4, 4, 0, 0]} />
                <Bar dataKey="leftover" name="Leftover (kg)" fill="#EF6A32" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Wastage % and Attendance in Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Wastage Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800">
              Wastage Percentage Trend (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EADCD6" />
                  <XAxis dataKey="formattedDate" tick={{ fontSize: 11, fill: "#71645F" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#71645F" }} domain={[0, "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "0.5rem",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="wastage"
                    name="Wastage %"
                    stroke="#A91D32"
                    fill="#FFBFA5"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Actual Attendance Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800">
              Actual Dining Turnout Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EADCD6" />
                  <XAxis dataKey="formattedDate" tick={{ fontSize: 11, fill: "#71645F" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#71645F" }} domain={[0, "auto"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "0.5rem",
                      border: "1px solid #e2e8f0",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    name="Actual Turnout"
                    stroke="#EF6A32"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
