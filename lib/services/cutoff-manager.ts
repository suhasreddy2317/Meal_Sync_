// lib/services/cutoff-manager.ts: Meal Plan Cutoff Enforcement Service (FR3)

export interface CutoffStatus {
  isPassed: boolean;
  cutoffDate: Date;
  timeRemainingMs: number;
  formattedTimeRemaining: string;
}

/**
 * Parses menu_date (YYYY-MM-DD) and cutoff_time (HH:MM or HH:MM:SS) into a Date object.
 */
export function getCutoffDateTime(menuDate: string, cutoffTime: string): Date {
  // Normalize time string to HH:MM:SS
  const parts = cutoffTime.split(":");
  const hours = parts[0].padStart(2, "0");
  const minutes = (parts[1] || "00").padStart(2, "0");
  const seconds = (parts[2] || "00").padStart(2, "0");

  return new Date(`${menuDate}T${hours}:${minutes}:${seconds}`);
}

/**
 * Determines whether the cutoff time for a specific meal has passed.
 */
export function isCutoffPassed(menuDate: string, cutoffTime: string, now: Date = new Date()): boolean {
  const cutoffDateTime = getCutoffDateTime(menuDate, cutoffTime);
  return now.getTime() >= cutoffDateTime.getTime();
}

/**
 * Calculates countdown details for student dashboard timers.
 */
export function getCutoffStatus(menuDate: string, cutoffTime: string, now: Date = new Date()): CutoffStatus {
  const cutoffDateTime = getCutoffDateTime(menuDate, cutoffTime);
  const diffMs = cutoffDateTime.getTime() - now.getTime();

  if (diffMs <= 0) {
    return {
      isPassed: true,
      cutoffDate: cutoffDateTime,
      timeRemainingMs: 0,
      formattedTimeRemaining: "Cutoff passed (Locked)",
    };
  }

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  let formatted = "";
  if (hours > 0) {
    formatted = `${hours}h ${minutes}m left`;
  } else if (minutes > 0) {
    formatted = `${minutes}m ${seconds}s left`;
  } else {
    formatted = `${seconds}s left`;
  }

  return {
    isPassed: false,
    cutoffDate: cutoffDateTime,
    timeRemainingMs: diffMs,
    formattedTimeRemaining: formatted,
  };
}
