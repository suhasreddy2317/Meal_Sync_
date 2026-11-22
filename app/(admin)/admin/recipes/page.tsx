import { getRecipesWithStockMatching } from "@/lib/data/mess-store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Check, X, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminRecipesPage() {
  const matchedRecipes = getRecipesWithStockMatching();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider mb-1">
            <ChefHat className="w-4 h-4" /> Pantry Intelligence
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Recipe Suggestions Based on Available Stock
          </h1>
          <p className="text-xs text-slate-500">
            Automated ingredient matching against current kitchen inventory. Highlights dishes with at least 70% available ingredients.
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="text-xs">
          <Link href="/admin/groceries">Update Inventory Levels →</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matchedRecipes.length === 0 ? (
          <Card className="col-span-2 p-12 text-center text-slate-400">
            No recipes currently meet the 70% ingredient availability threshold. Please replenish grocery stock.
          </Card>
        ) : (
          matchedRecipes.map((recipe) => (
            <Card key={recipe.recipe_id} className="overflow-hidden border border-slate-200/90 hover:shadow-md transition-shadow">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      {recipe.name}
                    </CardTitle>
                    {recipe.description && (
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {recipe.description}
                      </p>
                    )}
                  </div>

                  <Badge
                    variant={recipe.match_percentage === 100 ? "success" : "warning"}
                    className="shrink-0 text-xs font-bold py-1 px-2.5"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {recipe.match_percentage}% Match
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                {/* Available Ingredients */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    In-Stock Ingredients ({recipe.available_ingredients.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {recipe.available_ingredients.map((ing: string, i: number) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-800 border-emerald-200/70 text-xs font-normal"
                      >
                        {ing}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Missing Ingredients */}
                {recipe.missing_ingredients.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-rose-700 flex items-center gap-1.5">
                      <X className="w-3.5 h-3.5 text-rose-600" />
                      Missing Ingredients ({recipe.missing_ingredients.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {recipe.missing_ingredients.map((ing: string, i: number) => (
                        <Badge
                          key={i}
                          variant="destructive"
                          className="text-xs font-normal"
                        >
                          {ing}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preparation Instructions */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    Kitchen Preparation Steps
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {recipe.instructions}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
