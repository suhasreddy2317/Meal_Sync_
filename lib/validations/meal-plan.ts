import { z } from "zod";

export const mealPlanSchema = z.object({
  menu_id: z.string().min(1, "Menu ID is required"),
  status: z.enum(["yes", "no"], {
    required_error: "Please select whether you will eat or not",
  }),
});

export type MealPlanInput = z.infer<typeof mealPlanSchema>;
