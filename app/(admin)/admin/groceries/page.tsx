"use client";

import { useState } from "react";
import { getGroceriesFromStore } from "@/lib/data/mess-store";
import {
  updateGroceryStockAction,
  addGroceryItemAction,
  deleteGroceryItemAction,
} from "@/app/actions/grocery-actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ShoppingBag, Plus, AlertTriangle, Trash2, Edit2, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminGroceriesPage() {
  const router = useRouter();
  const groceries = getGroceriesFromStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStockValue, setEditStockValue] = useState<number>(0);

  // New item modal state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<any>("grains");
  const [newStock, setNewStock] = useState<number>(50);
  const [newMinThreshold, setNewMinThreshold] = useState<number>(20);
  const [newUnit, setNewUnit] = useState<any>("kg");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleStartEdit = (item: any) => {
    setEditingId(item.id);
    setEditStockValue(item.current_stock);
  };

  const handleSaveStock = async (id: string) => {
    await updateGroceryStockAction(id, Number(editStockValue));
    setEditingId(null);
    router.refresh();
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = await addGroceryItemAction({
      name: newName.trim(),
      category: newCategory,
      current_stock: Number(newStock),
      min_threshold: Number(newMinThreshold),
      unit: newUnit,
    });

    if (res.success) {
      setOpenAddModal(false);
      setNewName("");
      router.refresh();
    } else {
      setErrorMsg(res.error || "Failed to add item.");
    }
  };

  const handleDeleteItem = async (id: string) => {
    await deleteGroceryItemAction(id);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Pantry & Grocery Inventory
          </h1>
          <p className="text-xs text-slate-500">
            Maintain raw material levels, track low-stock thresholds, and trigger automated recipe compatibility.
          </p>
        </div>

        <Dialog open={openAddModal} onOpenChange={setOpenAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9">
              <Plus className="w-4 h-4 mr-1.5" /> Add Grocery Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddItem}>
              <DialogHeader>
                <DialogTitle>Add New Grocery Inventory Item</DialogTitle>
              </DialogHeader>

              <div className="space-y-3.5 py-4">
                <div className="space-y-1">
                  <Label htmlFor="item-name">Item Name</Label>
                  <Input
                    id="item-name"
                    placeholder="e.g. Kasuri Methi, Cloves, Moong Dal..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="item-cat">Category</Label>
                    <select
                      id="item-cat"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full h-10 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
                    >
                      <option value="grains">Grains</option>
                      <option value="pulses">Pulses</option>
                      <option value="vegetables">Vegetables</option>
                      <option value="spices">Spices</option>
                      <option value="dairy">Dairy</option>
                      <option value="oils">Oils</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="item-unit">Unit</Label>
                    <select
                      id="item-unit"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      className="w-full h-10 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs"
                    >
                      <option value="kg">Kilograms (kg)</option>
                      <option value="liters">Liters</option>
                      <option value="packets">Packets</option>
                      <option value="units">Units</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="item-stock">Initial Stock</Label>
                    <Input
                      id="item-stock"
                      type="number"
                      min="0"
                      step="0.5"
                      value={newStock}
                      onChange={(e) => setNewStock(parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="item-threshold">Min Threshold Alert</Label>
                    <Input
                      id="item-threshold"
                      type="number"
                      min="0"
                      step="0.5"
                      value={newMinThreshold}
                      onChange={(e) => setNewMinThreshold(parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                    {errorMsg}
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Add to Inventory
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Groceries Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">Ingredient</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Current Stock</th>
                <th className="py-3 px-4 font-semibold">Min Reorder Level</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groceries.map((item) => {
                const isLow = item.current_stock <= item.min_threshold;
                const isEditing = editingId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4 capitalize text-slate-500">
                      {item.category}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5 w-28">
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            value={editStockValue}
                            onChange={(e) => setEditStockValue(parseFloat(e.target.value) || 0)}
                            className="h-8 text-xs py-1"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSaveStock(item.id)}
                            className="h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <span>{item.current_stock} {item.unit}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {item.min_threshold} {item.unit}
                    </td>
                    <td className="py-3.5 px-4">
                      {isLow ? (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit text-[10px]">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </Badge>
                      ) : (
                        <Badge variant="success" className="text-[10px]">
                          Adequate
                        </Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      {!isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEdit(item)}
                          className="h-8 w-8 p-0 text-slate-500 hover:text-emerald-700"
                          title="Quick Edit Stock"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
