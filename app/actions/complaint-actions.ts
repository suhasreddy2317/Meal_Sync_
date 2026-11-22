"use server";

import { revalidatePath } from "next/cache";
import { saveComplaintInStore } from "@/lib/data/mess-store";
import { getCurrentUser } from "./auth-actions";

export async function submitComplaintAction(data: {
  category: "Food Quality" | "Hygiene" | "Food Quantity" | "Late Serving" | "Menu Issues" | "Other";
  title: string;
  description: string;
  urgency?: "Normal" | "High" | "Urgent";
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "student") {
    return { success: false, error: "Only students can submit complaints." };
  }

  if (!data.title.trim() || !data.description.trim()) {
    return { success: false, error: "Please provide a title and detailed description." };
  }

  try {
    const complaint = saveComplaintInStore({
      student_id: user.id,
      category: data.category,
      title: data.title.trim(),
      description: data.description.trim(),
      urgency: data.urgency,
    });

    revalidatePath("/student/dashboard");
    revalidatePath("/student/complaints");
    return { success: true, complaint };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit complaint." };
  }
}
