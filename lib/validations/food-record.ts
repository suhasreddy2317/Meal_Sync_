import { z } from "zod";

export const foodRecordSchema = z
  .object({
    menu_id: z.string().min(1, "Menu ID is required"),
    prepared_qty: z.coerce.number().min(0, "Prepared quantity cannot be negative"),
    leftover_qty: z.coerce.number().min(0, "Leftover quantity cannot be negative"),
    unit: z.enum(["kg", "portions"]),
    actual_attendance: z.coerce.number().int().min(0, "Actual attendance cannot be negative").optional(),
  })
  .refine((data) => data.leftover_qty <= data.prepared_qty, {
    message: "Leftover quantity cannot exceed prepared quantity",
    path: ["leftover_qty"],
  });

export type FoodRecordInput = z.infer<typeof foodRecordSchema>;
