// lib/services/recipe-matcher.ts: Recipe Matching & Ingredient Availability Engine (FR10)

export interface GroceryStockItem {
  id: string;
  name: string;
  current_stock: number;
  unit: string;
}

export interface RecipeWithIngredients {
  id: string;
  name: string;
  description?: string | null;
  instructions: string;
  default_servings: number;
  ingredients: {
    grocery_item_id: string;
    ingredient_name: string;
    quantity_per_serving: number;
    unit: string;
  }[];
}

export interface RecipeMatchResult {
  recipe_id: string;
  name: string;
  description?: string | null;
  instructions: string;
  default_servings: number;
  match_score: number; // 0.0 to 1.0
  match_percentage: number; // 0 to 100
  total_ingredients: number;
  available_count: number;
  available_ingredients: string[];
  missing_ingredients: string[];
}

/**
 * Match recipes against current pantry stock.
 * Threshold: match_score >= 0.70 (70% match)
 * Ranked descending by match score.
 */
export function matchRecipesAgainstStock(
  recipes: RecipeWithIngredients[],
  groceryStock: GroceryStockItem[]
): RecipeMatchResult[] {
  // Create a fast lookup map for current inventory: id -> stock
  const stockMap = new Map<string, number>();
  groceryStock.forEach((item) => {
    stockMap.set(item.id, item.current_stock);
    stockMap.set(item.name.toLowerCase(), item.current_stock);
  });

  const results: RecipeMatchResult[] = [];

  recipes.forEach((recipe) => {
    const totalIngredients = recipe.ingredients.length;
    if (totalIngredients === 0) return;

    const available: string[] = [];
    const missing: string[] = [];

    recipe.ingredients.forEach((ing) => {
      const stock =
        stockMap.get(ing.grocery_item_id) ??
        stockMap.get(ing.ingredient_name.toLowerCase()) ??
        0;

      if (stock > 0) {
        available.push(ing.ingredient_name);
      } else {
        missing.push(ing.ingredient_name);
      }
    });

    const matchScore = parseFloat((available.length / totalIngredients).toFixed(2));
    const matchPercentage = Math.round(matchScore * 100);

    // Filter by threshold >= 70%
    if (matchScore >= 0.7) {
      results.push({
        recipe_id: recipe.id,
        name: recipe.name,
        description: recipe.description,
        instructions: recipe.instructions,
        default_servings: recipe.default_servings,
        match_score: matchScore,
        match_percentage: matchPercentage,
        total_ingredients: totalIngredients,
        available_count: available.length,
        available_ingredients: available,
        missing_ingredients: missing,
      });
    }
  });

  // Sort highest match score first, then alphabetically
  return results.sort((a, b) => {
    if (b.match_score !== a.match_score) {
      return b.match_score - a.match_score;
    }
    return a.name.localeCompare(b.name);
  });
}
