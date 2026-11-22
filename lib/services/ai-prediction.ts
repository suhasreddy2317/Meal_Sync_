// lib/services/ai-prediction.ts: Explainable AI Demand Prediction Engine (FR9)

export interface HistoricalRecord {
  planned_count: number;
  actual_attendance: number;
  prepared_qty: number;
  wastage_percentage: number;
  rating?: number;
  date: string;
}

export interface PredictionResult {
  planned_count: number;
  adjusted_planned_count: number;
  model_prediction: number;
  final_predicted_count: number;
  average_portion: number;
  recommended_prep_qty: number;
  unit: "kg" | "portions";
  rationale: string;
  historical_sample_size: number;
}

/**
 * Predict meal demand and recommend prep quantity using FR9 blended algorithm.
 * 
 * Formula:
 * 1. WMA of last 4 records for same weekday & meal type (weights: 0.4, 0.3, 0.2, 0.1)
 * 2. Attendance ratio R = sum(actual) / sum(planned)
 * 3. Adjusted planned = current_planned * R
 * 4. Blended prediction = round(0.6 * adjusted_planned + 0.4 * WMA)
 * 5. Avg portion = sum(prepared) / sum(actual)
 * 6. Recommended qty = final_predicted_count * avg_portion * 1.05 (5% safety margin)
 */
export function calculateDemandPrediction(
  currentPlannedCount: number,
  history: HistoricalRecord[],
  unit: "kg" | "portions" = "kg"
): PredictionResult {
  const defaultPortion = unit === "kg" ? 0.35 : 1.0; // 350g per student default
  const sampleSize = history.length;

  // Case 1: Cold start / No historical records
  if (sampleSize === 0) {
    const finalPredicted = Math.max(1, currentPlannedCount > 0 ? currentPlannedCount : 80);
    const recommendedQty = parseFloat((finalPredicted * defaultPortion * 1.05).toFixed(1));

    return {
      planned_count: currentPlannedCount,
      adjusted_planned_count: currentPlannedCount,
      model_prediction: currentPlannedCount,
      final_predicted_count: finalPredicted,
      average_portion: defaultPortion,
      recommended_prep_qty: recommendedQty,
      unit,
      rationale: "Cold-start fallback: Insufficient historical records for this weekday/meal. Forecast matches current opt-in count with standard institutional portions.",
      historical_sample_size: 0,
    };
  }

  // Case 2: Limited history (1 to 3 records)
  if (sampleSize < 4) {
    const avgActual = history.reduce((acc, r) => acc + r.actual_attendance, 0) / sampleSize;
    const avgPlanned = history.reduce((acc, r) => acc + r.planned_count, 0) / sampleSize || 1;
    const ratio = Math.min(1.2, Math.max(0.6, avgActual / avgPlanned));
    const adjustedPlanned = currentPlannedCount > 0 ? currentPlannedCount * ratio : avgActual;

    const totalPrep = history.reduce((acc, r) => acc + r.prepared_qty, 0);
    const totalAtt = history.reduce((acc, r) => acc + r.actual_attendance, 0);
    const calculatedPortion = totalAtt > 0 ? totalPrep / totalAtt : defaultPortion;
    const avgPortion = parseFloat(Math.min(0.6, Math.max(0.2, calculatedPortion)).toFixed(2));

    const finalPredicted = Math.round(
      currentPlannedCount > 0
        ? 0.7 * adjustedPlanned + 0.3 * avgActual
        : avgActual
    );
    const recommendedQty = parseFloat((finalPredicted * avgPortion * 1.05).toFixed(1));

    return {
      planned_count: currentPlannedCount,
      adjusted_planned_count: parseFloat(adjustedPlanned.toFixed(1)),
      model_prediction: parseFloat(avgActual.toFixed(1)),
      final_predicted_count: Math.max(1, finalPredicted),
      average_portion: avgPortion,
      recommended_prep_qty: recommendedQty,
      unit,
      rationale: `Partial history baseline: Computed from ${sampleSize} recorded sessions with an attendance-to-opt-in conversion ratio of ${(ratio * 100).toFixed(0)}%.`,
      historical_sample_size: sampleSize,
    };
  }

  // Case 3: Full 4-record weighted model
  const recentFour = history.slice(0, 4);
  const weights = [0.4, 0.3, 0.2, 0.1]; // Most recent to oldest

  let weightedActualSum = 0;
  let totalActual = 0;
  let totalPlanned = 0;
  let totalPrepared = 0;

  recentFour.forEach((record, idx) => {
    weightedActualSum += record.actual_attendance * weights[idx];
    totalActual += record.actual_attendance;
    totalPlanned += record.planned_count;
    totalPrepared += record.prepared_qty;
  });

  // Historical conversion factor (actual / planned)
  const conversionFactor = totalPlanned > 0
    ? Math.min(1.15, Math.max(0.65, totalActual / totalPlanned))
    : 1.0;

  const adjustedPlanned = currentPlannedCount > 0
    ? currentPlannedCount * conversionFactor
    : weightedActualSum;

  const modelPrediction = weightedActualSum;

  // FR9 Blend: 60% adjusted planned + 40% weighted moving average
  const blendedCount = currentPlannedCount > 0
    ? Math.round(0.6 * adjustedPlanned + 0.4 * modelPrediction)
    : Math.round(modelPrediction);

  const finalPredicted = Math.max(1, blendedCount);

  // Portion estimation
  const avgPortion = totalActual > 0
    ? parseFloat((totalPrepared / totalActual).toFixed(2))
    : defaultPortion;

  // Recommended quantity with 5% buffer
  const recommendedQty = parseFloat((finalPredicted * avgPortion * 1.05).toFixed(1));

  return {
    planned_count: currentPlannedCount,
    adjusted_planned_count: parseFloat(adjustedPlanned.toFixed(1)),
    model_prediction: parseFloat(modelPrediction.toFixed(1)),
    final_predicted_count: finalPredicted,
    average_portion: avgPortion,
    recommended_prep_qty: recommendedQty,
    unit,
    rationale: `Ensemble Model: Blended 4-week WMA (${modelPrediction.toFixed(1)}) and opt-in adjusted demand (${adjustedPlanned.toFixed(1)}) at ${(conversionFactor * 100).toFixed(0)}% historical turnout with a 5% kitchen buffer.`,
    historical_sample_size: 4,
  };
}
