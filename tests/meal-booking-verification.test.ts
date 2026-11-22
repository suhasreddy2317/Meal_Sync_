// tests/meal-booking-verification.test.ts
// Verifies Book ("yes") and Skip ("no") actions across all four meal categories (breakfast, lunch, snacks, dinner)
// and ensures zero "Invalid menu ID" errors.

import { submitMealPlanAction } from "../app/actions/meal-plan-actions";
import { getStore, getMenuById } from "../lib/data/mess-store";
import { mealPlanSchema } from "../lib/validations/meal-plan";

async function runBookingVerification() {
  console.log("\n=======================================================");
  console.log("MEAL BOOKING ('BOOK' & 'SKIP') VERIFICATION TEST SUITE");
  console.log("=======================================================\n");

  const store = getStore();
  const student = store.profiles.find((p) => p.role === "student");
  if (!student) {
    console.error("❌ No student profile found in store.");
    process.exit(1);
  }

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName} - ${detail}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} - ${detail}`);
      failed++;
    }
  }

  // 1. Test Schema Validation
  console.log("--- 1. Testing Zod Validation Schema ---");
  const validUuids = [
    "efb60000-e2be-421d-beec-f53e0eb8d205",
    "402f5efe-52e0-4270-bb60-942e6fe5fe9e",
  ];
  const validFormattedIds = [
    "menu-2026-11-25-breakfast",
    "menu-2026-11-25-lunch",
    "menu-2026-11-25-snacks",
    "menu-2026-11-25-dinner",
    "menu-Wednesday-lunch",
    "menu-today-breakfast",
  ];

  for (const id of [...validUuids, ...validFormattedIds]) {
    const parseRes = mealPlanSchema.safeParse({ menu_id: id, status: "yes" });
    assert(parseRes.success, `Schema validation for ID: "${id}"`, "Accepted without 'Invalid menu ID' error");
  }

  // 2. Test Book ("yes") across all 4 meal types for future dates
  console.log("\n--- 2. Testing Book ('yes') across all 4 meal types ---");
  const targetDate = "2026-11-25"; // Wednesday next week (within active window)
  const mealTypes = ["breakfast", "lunch", "snacks", "dinner"] as const;

  for (const mealType of mealTypes) {
    const menuId = `menu-${targetDate}-${mealType}`;
    // Ensure menu exists in store
    getMenuById(menuId);

    const res = await submitMealPlanAction({ menu_id: menuId, status: "yes" });
    assert(
      res.success === true,
      `Book ("yes") for ${mealType.toUpperCase()}`,
      `menu_id: "${menuId}" -> success: ${res.success}, error: ${res.error || "none"}`
    );

    // Verify stored plan
    const currentMenu = getMenuById(menuId);
    const plan = store.mealPlans.find((p) => p.menu_id === currentMenu?.id);
    assert(
      plan?.status === "yes",
      `Persisted status for ${mealType.toUpperCase()}`,
      `Saved status is '${plan?.status}' in store`
    );
  }

  // 3. Test Skip ("no") across all 4 meal types
  console.log("\n--- 3. Testing Skip ('no') across all 4 meal types ---");
  for (const mealType of mealTypes) {
    const menuId = `menu-${targetDate}-${mealType}`;
    const res = await submitMealPlanAction({ menu_id: menuId, status: "no" });
    assert(
      res.success === true,
      `Skip ("no") for ${mealType.toUpperCase()}`,
      `menu_id: "${menuId}" -> success: ${res.success}, error: ${res.error || "none"}`
    );

    const currentMenu = getMenuById(menuId);
    const plan = store.mealPlans.find((p) => p.menu_id === currentMenu?.id);
    assert(
      plan?.status === "no",
      `Persisted status for ${mealType.toUpperCase()}`,
      `Saved status is '${plan?.status}' in store`
    );
  }

  // 4. Test Weekday synthesized ID booking
  console.log("\n--- 4. Testing Weekday Synthesized ID Booking ---");
  const weekdayMenuId = "menu-Wednesday-dinner";
  const weekdayRes = await submitMealPlanAction({ menu_id: weekdayMenuId, status: "yes" });
  assert(
    weekdayRes.success === true,
    `Book for synthesized weekday ID "${weekdayMenuId}"`,
    `success: ${weekdayRes.success}, error: ${weekdayRes.error || "none"}`
  );

  // 5. Test Cutoff Enforcement on past menu
  console.log("\n--- 5. Testing Cutoff Enforcement ---");
  const pastMenuId = "menu-2026-11-01-breakfast";
  const pastRes = await submitMealPlanAction({ menu_id: pastMenuId, status: "yes" });
  assert(
    pastRes.success === false && (pastRes.error?.includes("Cutoff passed") ?? false),
    "Cutoff locking for past menu",
    `Correctly locked: "${pastRes.error}"`
  );

  console.log("\n=======================================================");
  console.log(`BOOKING VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runBookingVerification().catch(console.error);
