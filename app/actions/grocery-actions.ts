"use server";

import { revalidatePath } from "next/cache";
import { groceryItemSchema, GroceryItemInput } from "@/lib/validations/grocery";
import {
  getGroceriesFromStore,
  updateGroceryStockInStore,
  addGroceryItemInStore,
  deleteGroceryItemInStore,
  getRecipesWithStockMatching,
} from "@/lib/data/mess-store";
import { getCurrentUser } from "./auth-actions";

export async function updateGroceryStockAction(id: string, newStock: number) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized: Admin access required." };
  }

  if (newStock < 0) {
    return { success: false, error: "Stock cannot be negative." };
  }

  try {
    const item = updateGroceryStockInStore(id, newStock);
    revalidatePath("/admin/groceries");
    revalidatePath("/admin/recipes");
    return { success: true, item };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update stock." };
  }
}

export async function addGroceryItemAction(input: GroceryItemInput) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized: Admin access required." };
  }

  const result = groceryItemSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.errors[0]?.message || "Invalid input" };
  }

  try {
    const newItem = addGroceryItemInStore(result.data);
    revalidatePath("/admin/groceries");
    revalidatePath("/admin/recipes");
    return { success: true, item: newItem };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to add grocery item." };
  }
}

export async function deleteGroceryItemAction(id: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { success: false, error: "Unauthorized: Admin access required." };
  }

  try {
    deleteGroceryItemInStore(id);
    revalidatePath("/admin/groceries");
    revalidatePath("/admin/recipes");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete item." };
  }
}

export async function getRecipeSuggestionsAction() {
  return getRecipesWithStockMatching();
}
