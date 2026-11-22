"use server";

import { revalidatePath } from "next/cache";
import { topUpWalletInStore } from "@/lib/data/mess-store";
import { getCurrentUser } from "./auth-actions";

export async function topUpWalletAction(amount: number) {
  const user = await getCurrentUser();
  if (!user || user.role !== "student") {
    return { success: false, error: "Only students can top up their wallet." };
  }

  if (!amount || amount <= 0) {
    return { success: false, error: "Please enter a valid recharge amount." };
  }

  try {
    const newBalance = topUpWalletInStore(user.id, amount);
    revalidatePath("/student/dashboard");
    revalidatePath("/student/payments");
    return { success: true, newBalance };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to recharge wallet." };
  }
}
