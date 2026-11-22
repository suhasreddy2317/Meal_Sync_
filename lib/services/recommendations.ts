// lib/services/recommendations.ts: Explainable AI Wastage & Quality Rule Engine (FR8)

export interface MealAnalysisData {
  menu_id: string;
  dish_names: string[];
  weekday: string; // "Monday", "Tuesday", etc.
  meal_type: string;
  prepared_qty: number;
  leftover_qty: number;
  wastage_percentage: number;
  avg_rating?: number;
  opt_in_yes_count: number;
  opt_in_no_count: number;
}

export interface GeneratedRecommendation {
  recommendation_type: "reduce_prep" | "replace_dish" | "day_anomaly" | "high_performer" | "small_batch";
  title: string;
  message: string;
  priority: "low" | "medium" | "high" | "critical";
  related_menu_id?: string;
  related_dish_name?: string;
}

/**
 * Generate actionable, deterministic insights from recent historical meal data.
 */
export function evaluateMessRecommendations(
  records: MealAnalysisData[]
): GeneratedRecommendation[] {
  const recommendations: GeneratedRecommendation[] = [];

  if (!records || records.length === 0) {
    return [
      {
        recommendation_type: "reduce_prep",
        title: "Baseline Operational Setup",
        message: "Maintain standard batch preparation guidelines until sufficient historical attendance data accumulates.",
        priority: "low",
      },
    ];
  }

  // 1. Overall Wastage Analysis
  const totalPrepared = records.reduce((sum, r) => sum + r.prepared_qty, 0);
  const totalLeftover = records.reduce((sum, r) => sum + r.leftover_qty, 0);
  const overallWastage = totalPrepared > 0 ? (totalLeftover / totalPrepared) * 100 : 0;

  if (overallWastage > 15) {
    const reductionAmount = Math.max(5, Math.round(overallWastage - 5));
    recommendations.push({
      recommendation_type: "reduce_prep",
      title: "Excess Average Wastage Detected",
      message: `Average meal wastage over recent cycles is ${overallWastage.toFixed(1)}% (exceeding the 15% benchmark). Recommended action: Reduce base preparation volume by ~${reductionAmount}% across upcoming cycles.`,
      priority: overallWastage > 25 ? "critical" : "high",
    });
  }

  // 2. Day of Week Recurring Wastage Anomaly
  const dayStats: Record<string, { prepared: number; leftover: number }> = {};
  records.forEach((r) => {
    if (!dayStats[r.weekday]) {
      dayStats[r.weekday] = { prepared: 0, leftover: 0 };
    }
    dayStats[r.weekday].prepared += r.prepared_qty;
    dayStats[r.weekday].leftover += r.leftover_qty;
  });

  Object.entries(dayStats).forEach(([day, stats]) => {
    if (stats.prepared > 0) {
      const dayWastage = (stats.leftover / stats.prepared) * 100;
      if (dayWastage > 18) {
        recommendations.push({
          recommendation_type: "day_anomaly",
          title: `Recurring High Wastage on ${day}s`,
          message: `${day}s consistently generate ${dayWastage.toFixed(1)}% food waste due to weekend departures or class schedules. Recommend dialing down ${day} preparation targets.`,
          priority: "medium",
        });
      }
    }
  });

  // 3. Dish Quality & Wastage Correlation
  records.forEach((r) => {
    const dishLabel = r.dish_names.join(", ") || "Menu item";

    // Rule: Low rating (< 3.0) and high wastage (> 15%) -> Critical replacement
    if (r.avg_rating && r.avg_rating < 3.0 && r.wastage_percentage > 15) {
      recommendations.push({
        recommendation_type: "replace_dish",
        title: `Underperforming Menu: ${dishLabel}`,
        message: `This meal received a low average score of ${r.avg_rating.toFixed(1)}/5.0 accompanied by ${r.wastage_percentage.toFixed(1)}% unconsumed food. Strongly recommend reviewing the recipe or substituting the dish.`,
        priority: "critical",
        related_menu_id: r.menu_id,
        related_dish_name: dishLabel,
      });
    }
    // Rule: Low rating alone
    else if (r.avg_rating && r.avg_rating < 3.0) {
      recommendations.push({
        recommendation_type: "replace_dish",
        title: `Low Student Satisfaction: ${dishLabel}`,
        message: `Student ratings averaged ${r.avg_rating.toFixed(1)}/5.0. Consider seasoning adjustments, recipe refinement, or gathering targeted feedback.`,
        priority: "medium",
        related_menu_id: r.menu_id,
        related_dish_name: dishLabel,
      });
    }
    // Rule: Stellar performer (Rating > 4.2 & Wastage < 5%)
    else if (r.avg_rating && r.avg_rating >= 4.2 && r.wastage_percentage < 5) {
      recommendations.push({
        recommendation_type: "high_performer",
        title: `High Student Favorite: ${dishLabel}`,
        message: `Outstanding satisfaction rating of ${r.avg_rating.toFixed(1)}/5.0 with negligible wastage (${r.wastage_percentage.toFixed(1)}%). Maintain preparation consistency and standard portioning.`,
        priority: "low",
        related_menu_id: r.menu_id,
        related_dish_name: dishLabel,
      });
    }

    // Rule: Opt-out spike (> 35% students select No)
    const totalResponses = r.opt_in_yes_count + r.opt_in_no_count;
    if (totalResponses >= 5) {
      const optOutRatio = (r.opt_in_no_count / totalResponses) * 100;
      if (optOutRatio >= 35) {
        recommendations.push({
          recommendation_type: "small_batch",
          title: `Significant Opt-out Surge for ${r.meal_type}`,
          message: `${optOutRatio.toFixed(0)}% of responding students selected "Will Not Eat". Implement small-batch staggered cooking to avert surplus.`,
          priority: "high",
          related_menu_id: r.menu_id,
        });
      }
    }
  });

  return recommendations;
}
