"use server";

import { revalidatePath } from "next/cache";
import {
  getNotificationsForUser,
  markNotificationReadInStore,
  markAllNotificationsReadInStore,
} from "@/lib/data/mess-store";
import { getCurrentUser } from "./auth-actions";

export async function getUserNotificationsAction() {
  const user = await getCurrentUser();
  if (!user) return [];
  return getNotificationsForUser(user.id);
}

export async function markNotificationReadAction(notificationId: string) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  markNotificationReadInStore(notificationId);
  revalidatePath("/student/notifications");
  revalidatePath("/student/dashboard");
  return { success: true };
}

export async function markAllNotificationsReadAction() {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  markAllNotificationsReadInStore(user.id);
  revalidatePath("/student/notifications");
  revalidatePath("/student/dashboard");
  return { success: true };
}
