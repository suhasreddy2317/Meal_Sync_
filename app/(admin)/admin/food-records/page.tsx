"use client";

import { useState } from "react";
import { getAllMenus, getStore } from "@/lib/data/mess-store";
import { saveFoodRecordAction } from "@/app/actions/food-record-actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Scale, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminFoodRecordsPage() {
  const router = useRouter();
  const store = getStore();
  const menus = getAllMenus();

  // Sort past menus first
  const sortedMenus = [...menus].sort((a, b) => b.menu_date.localeCompare(a.menu_date));

  const [selectedMenuId, setSelectedMenuId] = useState<string>(sortedMenus[0]?.id || "");
  const [preparedQty, setPreparedQty] = useState<number>(45);
  const [leftoverQty, setLeftoverQty] = useState<number>(4.5);
  const [actualAttendance, setActualAttendance] = useState<number>(18);
  const [unit, setUnit] = useState<"kg" | "portions">("kg");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Live wastage percentage calculation
  const calculatedWastage =
    preparedQty > 0
      ? ((leftoverQty / preparedQty) * 100).toFixed(1)
      : "0.0";

  const handleMenuSelect = (menuId: string) => {
    setSelectedMenuId(menuId);
    const existingRecord = store.foodRecords.find((r) => r.menu_id === menuId);
    if (existingRecord) {
      setPreparedQty(existingRecord.prepared_qty);
      setLeftoverQty(existingRecord.leftover_qty);
      setActualAttendance(existingRecord.actual_attendance || 0);
      setUnit(existingRecord.unit);
    } else {
      setPreparedQty(50);
      setLeftoverQty(5);
      setActualAttendance(20);
    }
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (leftoverQty > preparedQty) {
      setErrorMsg("Leftover quantity cannot exceed prepared quantity.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await saveFoodRecordAction({
      menu_id: selectedMenuId,
      prepared_qty: Number(preparedQty),
      leftover_qty: Number(leftoverQty),
      unit,
      actual_attendance: Number(actualAttendance),
    });

    setLoading(false);

    if (res.success) {
      setSuccessMsg("Food record and wastage percentage saved successfully!");
      router.refresh();
    } else {
      setErrorMsg(res.error || "Failed to save record.");
    }
  };

  const selectedMenu = sortedMenus.find((m) => m.id === selectedMenuId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Food Wastage & Post-Meal Logs
        </h1>
        <p className="text-xs text-slate-500">
          Enter post-service prepared and leftover quantities to automatically track wastage percentages and turnout compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entry Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" /> Log Meal Quantities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="meal-select">Select Target Meal</Label>
                <select
                  id="meal-select"
                  value={selectedMenuId}
                  onChange={(e) => handleMenuSelect(e.target.value)}
                  className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800"
                >
                  {sortedMenus.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.menu_date} — {m.meal_type.toUpperCase()} ({m.items?.slice(0, 2).map((i) => i.name).join(", ")})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="prep">Prepared Qty</Label>
                  <Input
                    id="prep"
                    type="number"
                    step="0.1"
                    min="0"
                    value={preparedQty}
                    onChange={(e) => setPreparedQty(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="leftover">Leftover Qty</Label>
                  <Input
                    id="leftover"
                    type="number"
                    step="0.1"
                    min="0"
                    value={leftoverQty}
                    onChange={(e) => setLeftoverQty(parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="att">Actual Headcount</Label>
                  <Input
                    id="att"
                    type="number"
                    min="0"
                    value={actualAttendance}
                    onChange={(e) => setActualAttendance(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="unit">Unit</Label>
                  <select
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="portions">Portions</option>
                  </select>
                </div>
              </div>

              {/* Instant Wastage Computation Banner */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Calculated Wastage Percentage
                </span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-extrabold ${parseFloat(calculatedWastage) > 15 ? "text-rose-600" : "text-emerald-700"}`}>
                    {calculatedWastage}%
                  </span>
                  <span className="text-xs text-slate-400">
                    ({leftoverQty} / {preparedQty} {unit})
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {loading ? "Saving Record..." : "Save Food Record"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Food Records Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-800">
              Historical Food Waste Records
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="pb-3 font-semibold">Date & Meal</th>
                  <th className="pb-3 font-semibold">Prepared</th>
                  <th className="pb-3 font-semibold">Leftover</th>
                  <th className="pb-3 font-semibold">Turnout</th>
                  <th className="pb-3 font-semibold">Wastage %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {store.foodRecords.slice(-12).reverse().map((rec) => {
                  const m = store.menus.find((menu) => menu.id === rec.menu_id);
                  const isHighWaste = rec.wastage_percentage > 15;

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-medium text-slate-800">
                        {m?.menu_date} <span className="capitalize text-slate-500 font-normal">({m?.meal_type})</span>
                      </td>
                      <td className="py-3">{rec.prepared_qty} {rec.unit}</td>
                      <td className="py-3">{rec.leftover_qty} {rec.unit}</td>
                      <td className="py-3">{rec.actual_attendance || "—"}</td>
                      <td className="py-3">
                        <Badge
                          variant={isHighWaste ? "destructive" : "success"}
                          className="text-[11px] font-bold"
                        >
                          {rec.wastage_percentage}%
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
