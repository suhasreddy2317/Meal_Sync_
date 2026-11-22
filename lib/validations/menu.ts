import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string().min(2, "Dish name is required"),
  description: z.string().optional(),
  category: z.enum(["main", "bread", "rice", "dessert", "beverage", "side", "snack"]),
  is_vegetarian: z.boolean().default(true),
  image_url: z.string().optional(),
});

export const menuSchema = z.object({
  menu_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  meal_type: z.enum(["breakfast", "lunch", "snacks", "dinner"]),
  cutoff_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Cutoff time must be HH:MM or HH:MM:SS"),
  serving_start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Start time must be HH:MM"),
  serving_end_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "End time must be HH:MM"),
  is_published: z.boolean().default(true),
  items: z.array(menuItemSchema).min(1, "At least one dish must be added to the menu"),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type MenuInput = z.infer<typeof menuSchema>;
