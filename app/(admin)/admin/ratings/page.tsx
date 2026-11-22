import { getStore } from "@/lib/data/mess-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/shared/star-rating";
import { Star, MessageSquare, TrendingUp, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminRatingsPage() {
  const store = getStore();
  const ratings = store.ratings;

  // Calculate statistics
  const totalRatings = ratings.length;
  const avgScore = totalRatings > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)
    : "0.0";

  // Score distribution counts (1-star to 5-star)
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = ratings.filter((r) => r.rating === stars).length;
    const percentage = totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;
    return { stars, count, percentage };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Student Ratings & Dining Reviews
        </h1>
        <p className="text-xs text-slate-500">
          Monitor student meal satisfaction, inspect dish-level commentary, and assess preparation standards.
        </p>
      </div>

      {/* Aggregate Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rating Score Card */}
        <Card className="flex flex-col justify-center items-center p-6 text-center">
          <span className="text-5xl font-black text-slate-900 tracking-tight">
            {avgScore}
          </span>
          <StarRating value={parseFloat(avgScore)} readOnly size="lg" className="my-2" />
          <p className="text-xs text-slate-400">
            Based on {totalRatings} verified student submissions
          </p>
        </Card>

        {/* Rating Distribution Progress */}
        <Card className="md:col-span-2 p-6">
          <h2 className="text-sm font-bold text-slate-800 mb-4">
            Rating Distribution
          </h2>
          <div className="space-y-2.5">
            {distribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-medium text-slate-600 flex items-center gap-1">
                  {stars} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-16 text-right text-slate-400">
                  {count} ({percentage}%)
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Feedback Stream */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" /> Recent Student Comments & Dish Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ratings.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No ratings submitted yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {ratings.slice(-15).reverse().map((r) => {
                const student = store.profiles.find((p) => p.id === r.student_id);
                const menu = store.menus.find((m) => m.id === r.menu_id);

                return (
                  <div key={r.id} className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <StarRating value={r.rating} readOnly size="sm" />
                        <span className="font-semibold text-xs text-slate-800">
                          {student?.full_name || "Student"}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({student?.roll_number || "Hostel Student"})
                        </span>
                      </div>

                      <span className="text-[11px] text-slate-400">
                        {menu?.menu_date} • <span className="capitalize">{menu?.meal_type}</span>
                      </span>
                    </div>

                    {r.comment && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 italic leading-relaxed">
                        &quot;{r.comment}&quot;
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
