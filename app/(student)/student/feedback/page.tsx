import { getCurrentUser } from "@/app/actions/auth-actions";
import { getAllMenus, getStore } from "@/lib/data/mess-store";
import { StarRating } from "@/components/shared/star-rating";
import { RateMealDialog } from "@/components/student/rate-meal-dialog";
import { Star, MessageSquare, CheckCircle2, Award } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function StudentFeedbackPage() {
  const user = await getCurrentUser();
  const store = getStore();
  const today = new Date().toISOString().split("T")[0];

  const studentRatings = user
    ? store.ratings.filter((r) => r.student_id === user.id)
    : [];

  const pastMenus = getAllMenus()
    .filter((m) => m.menu_date <= today)
    .sort((a, b) => b.menu_date.localeCompare(a.menu_date))
    .slice(0, 10);

  return (
    <div className="space-y-8">
      {/* 1. TOP HERO HEADER ROW: Left Eyebrow+H1+Subtitle, Right compact KPI stat chips */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Dining Feedback & Reviews</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Meal Ratings & Culinary Feedback
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Share your ratings for breakfast, lunch, snacks, and dinner to refine kitchen recipes.
          </p>
        </div>

        {/* Right-aligned compact KPI stat cards */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                4.6 / 5.0
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Average Score
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-200/60 text-indigo-700 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                {studentRatings.length} Reviews
              </p>
              <p className="text-[10px] text-indigo-700 font-medium">
                Logged by You
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                100% Reviewed
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                Chef Feedback Loop
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ASYMMETRIC GRID: 8 cols (Recent meals served) + 4 cols (Previous reviews) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Served Meals Ready for Rating */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">
              Recent Meals Served
            </h2>
            <span className="text-xs font-medium text-slate-500">
              Click &apos;Rate Meal&apos; to submit feedback
            </span>
          </div>

          <div className="space-y-3">
            {pastMenus.map((menu) => {
              const existingRating = studentRatings.find((r) => r.menu_id === menu.id);
              const dateObj = new Date(menu.menu_date + "T00:00:00");
              const formattedDate = dateObj.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });

              return (
                <div
                  key={menu.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 capitalize text-sm">
                        {menu.meal_type}
                      </span>
                      <span className="text-xs text-slate-400">• {formattedDate}</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {menu.items?.map((i) => i.name).join(" • ") || "Assorted dishes"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    {existingRating ? (
                      <div className="flex flex-col items-end">
                        <StarRating value={existingRating.rating} readOnly size="sm" />
                        <span className="text-[10px] text-slate-400 mt-0.5">Your Rating</span>
                      </div>
                    ) : (
                      <RateMealDialog menu={menu} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rating History Column */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-base font-semibold text-slate-900">
            Your Previous Reviews
          </h2>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            {studentRatings.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                You haven&apos;t reviewed any meals yet.
              </p>
            ) : (
              studentRatings.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <StarRating value={r.rating} readOnly size="sm" />
                    <span className="text-[10px] text-slate-400">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {r.comment && (
                    <p className="text-xs text-slate-700 italic flex items-start gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      &quot;{r.comment}&quot;
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
