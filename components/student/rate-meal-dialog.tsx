"use client";

import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/shared/star-rating";
import { submitRatingAction } from "@/app/actions/rating-actions";
import { Menu } from "@/lib/types/database";

interface RateMealDialogProps {
  menu: Menu;
  onRatingSuccess?: () => void;
}

export function RateMealDialog({ menu, onRatingSuccess }: RateMealDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<number>(menu.user_rating?.rating || 5);
  const [comment, setComment] = useState<string>(menu.user_rating?.comment || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAlreadyRated = !!menu.user_rating;

  // Check if meal served: now >= serving_start_time
  const mealStart = new Date(`${menu.menu_date}T${menu.serving_start_time}`);
  const isServed = new Date().getTime() >= mealStart.getTime();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError("Please select a rating between 1 and 5 stars");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await submitRatingAction({
      menu_id: menu.id,
      rating,
      comment: comment.trim() || undefined,
    });

    setLoading(false);

    if (res.success) {
      setOpen(false);
      onRatingSuccess?.();
    } else {
      setError(res.error || "Failed to submit rating.");
    }
  };

  if (!isServed) {
    return (
      <Button variant="outline" size="sm" disabled className="text-xs text-slate-400">
        Rate after serving starts
      </Button>
    );
  }

  if (isAlreadyRated) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
        <span>Rated {menu.user_rating?.rating}/5</span>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50">
          <Star className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Rate Meal
        </Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="capitalize">
              Rate {menu.meal_type} — {new Date(menu.menu_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </DialogTitle>
            <DialogDescription>
              How was the food quality, taste, and freshness today? Your feedback helps the kitchen optimize preparation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium mb-2">Overall Meal Satisfaction</span>
              <StarRating value={rating} onChange={setRating} size="lg" />
              <span className="text-sm font-semibold text-slate-700 mt-2">
                {rating === 5 && "Excellent"}
                {rating === 4 && "Good"}
                {rating === 3 && "Average"}
                {rating === 2 && "Poor"}
                {rating === 1 && "Very Poor"}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Optional Comments or Dish Feedback
              </label>
              <Textarea
                placeholder="Mention specific dishes, seasoning, warmth, or quantity..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                rows={3}
              />
              <span className="text-[11px] text-slate-400 text-right block">
                {comment.length}/500
              </span>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {loading ? "Submitting..." : "Submit Rating"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
