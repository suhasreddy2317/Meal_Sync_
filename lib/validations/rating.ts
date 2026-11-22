import { z } from "zod";

export const ratingSchema = z.object({
  menu_id: z.string().min(1, "Menu ID is required"),
  rating: z.number().int().min(1, "Rating must be at least 1 star").max(5, "Rating cannot exceed 5 stars"),
  comment: z.string().max(500, "Feedback must not exceed 500 characters").optional().nullable(),
});

export type RatingInput = z.infer<typeof ratingSchema>;
