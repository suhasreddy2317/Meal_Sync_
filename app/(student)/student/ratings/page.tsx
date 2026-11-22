import { getCurrentUser } from "@/app/actions/auth-actions";
import { getAllMenus, getStore } from "@/lib/data/mess-store";
import { RateMealDialog } from "@/components/student/rate-meal-dialog";
import { StarRating } from "@/components/shared/star-rating";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Star, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentRatingsPage() {
  const user = await getCurrentUser();
  const store = getStore();

  const userRatings = user
    ? store.ratings.filter((r) => r.student_id === user.id)
    : [];

  const today = new Date().toISOString().split("T")[0];
  const allMenus = getAllMenus();

  // Past served meals that the student can rate
  const pastServedMenus = allMenus
    .filter((m) => m.menu_date <= today)
    .sort((a, b) => b.menu_date.localeCompare(a.menu_date))
    .slice(0, 15);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1">
          <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" /> Dining Feedback
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Meal Ratings & Reviews
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Rate served meals to help mess administrators refine recipes and improve daily quality.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Served Meals Ready for Rating */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Recent Meals</h2>

          {pastServedMenus.length === 0 ? (
            <Card className="p-8 text-center text-slate-500">
              No recent meals available for rating.
            </Card>
          ) : (
            <div className="space-y-3">
              {pastServedMenus.map((menu) => {
                const existingRating = userRatings.find((r) => r.menu_id === menu.id);
                const formattedDate = new Date(menu.menu_date + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });

                return (
                  <Card key={menu.id} className="p-4 sm:p-5 hover:border-slate-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 capitalize">
                            {menu.meal_type}
                          </span>
                          <span className="text-xs text-slate-400">• {formattedDate}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          {menu.items?.map((i) => i.name).join(", ") || "Menu dishes"}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                        {existingRating ? (
                          <div className="flex flex-col items-end">
                            <StarRating value={existingRating.rating} readOnly size="sm" />
                            <span className="text-[11px] text-slate-400 mt-0.5">Your rating</span>
                          </div>
                        ) : (
                          <RateMealDialog menu={menu} />
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* User's Rating History Sidebar */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Your Past Feedback</h2>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                <span>Submitted Reviews</span>
                <span className="text-xs font-normal text-slate-400">
                  {userRatings.length} total
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {userRatings.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  You haven&apos;t submitted any ratings yet.
                </p>
              ) : (
                userRatings.slice(0, 5).map((r) => (
                  <div key={r.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <StarRating value={r.rating} readOnly size="sm" />
                      <span className="text-[10px] text-slate-400">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {r.comment && (
                      <p className="text-xs text-slate-600 italic flex items-start gap-1">
                        <MessageSquare className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                        &quot;{r.comment}&quot;
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
