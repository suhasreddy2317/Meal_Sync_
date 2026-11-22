import { z } from "zod";

export const groceryItemSchema = z.object({
  name: z.string().min(2, "Grocery item name is required"),
  category: z.enum(["grains", "pulses", "vegetables", "spices", "dairy", "oils", "other"]),
  current_stock: z.coerce.number().min(0, "Stock cannot be negative"),
  min_threshold: z.coerce.number().min(0, "Minimum threshold cannot be negative"),
  unit: z.enum(["kg", "liters", "packets", "units"]),
});

export const recipeSchema = z.object({
  name: z.string().min(2, "Recipe name is required"),
  description: z.string().optional(),
  instructions: z.string().min(10, "Instructions must be at least 10 characters"),
  default_servings: z.coerce.number().int().min(1, "Servings must be at least 1"),
});

export type GroceryItemInput = z.infer<typeof groceryItemSchema>;
export type RecipeInput = z.infer<typeof recipeSchema>;
