// tests/dish-images-verification.test.ts
// Verifies that every single dish name across the website maps to its authentic image.

import { resolveDishImage, getDishKeyByName, DISH_IMAGE_CATALOG, CATEGORY_FALLBACKS } from "../lib/data/dish-images";
import * as fs from "fs";
import * as path from "path";

const testCases = [
  // 28 Dishes From The Master Mess Food Chart
  // Breakfast Items (Row 0)
  { query: "Idli", expectedSlug: "idli", description: "Steamed fluffy idli with chutney" },
  { query: "Dosa", expectedSlug: "dosa", description: "Crisp golden roast dosa" },
  { query: "Masala Dosa", expectedSlug: "masala_dosa", description: "Spiced potato stuffed masala dosa" },
  { query: "Upma", expectedSlug: "upma", description: "Savory semolina vegetable upma" },
  { query: "Pongal", expectedSlug: "pongal", description: "Ghee ven pongal with cashews" },
  { query: "Poori", expectedSlug: "poori", description: "Puffed golden poori with bhaji" },
  { query: "Aloo Paratha", expectedSlug: "aloo_paratha", description: "Stuffed aloo paratha with melting butter" },

  // Lunch Items (Row 1)
  { query: "Steamed Rice + Sambar", expectedSlug: "rice_sambar", description: "Hot steamed rice with vegetable sambar" },
  { query: "Curd Rice", expectedSlug: "curd_rice", description: "Tempered South Indian curd rice" },
  { query: "Vegetable Pulav", expectedSlug: "veg_pulav", description: "Fragrant basmati vegetable pulav" },
  { query: "Chana Masala", expectedSlug: "chana_masala", description: "Amritsari spiced chana masala" },
  { query: "Dal Rice", expectedSlug: "dal_rice", description: "Wholesome dal rice combo" },
  { query: "Chicken Biryani", expectedSlug: "chicken_biryani", description: "Aromatic chicken dum biryani" },
  { query: "Fish Curry", expectedSlug: "fish_curry", description: "Coastal spiced fish curry" },

  // Snacks Items (Row 2)
  { query: "Samosa", expectedSlug: "samosa", description: "Crispy potato pea samosa" },
  { query: "Aloo Bonda", expectedSlug: "aloo_bonda", description: "Golden batter-fried aloo bonda" },
  { query: "Veg Cutlet", expectedSlug: "veg_cutlet", description: "Crisp golden vegetable cutlet" },
  { query: "Corn Chat", expectedSlug: "corn_chat", description: "Tangy spiced sweet corn chat" },
  { query: "Masala Tea", expectedSlug: "masala_tea", description: "Hot ginger-cardamom masala tea" },
  { query: "Egg Roll", expectedSlug: "egg_roll", description: "Kolkata style crispy egg roll" },
  { query: "Chicken 65", expectedSlug: "chicken_65", description: "Crispy spicy chicken 65 bites" },

  // Dinner Items (Row 3)
  { query: "Chapati with Dal", expectedSlug: "chapati_dal", description: "Soft chapatis served with spiced dal" },
  { query: "Paneer Butter Masala with Naan", expectedSlug: "paneer_naan", description: "Rich paneer butter masala with tandoori naan" },
  { query: "Veg Fried Rice", expectedSlug: "veg_fried_rice", description: "Indo-Chinese vegetable fried rice" },
  { query: "Mixed Vegetable Curry", expectedSlug: "mixed_veg_curry", description: "Homestyle mixed vegetable curry" },
  { query: "Curd", expectedSlug: "curd", description: "Fresh set plain curd" },
  { query: "Chicken Curry", expectedSlug: "chicken_curry", description: "Spiced homestyle chicken curry" },
  { query: "Egg Curry", expectedSlug: "egg_curry", description: "Boiled egg curry with rich gravy" },

  // Legacy Culinary Dishes
  { query: "Crispy Medu Vada", expectedSlug: "vada", description: "Golden crispy medu vada" },
  { query: "Kanda Batata Poha", expectedSlug: "poha", description: "Yellow flattened rice poha" },
  { query: "South Indian Filter Coffee", expectedSlug: "coffee", description: "Frothy filter coffee in tumbler" },
  { query: "Spiced Masala Chai", expectedSlug: "tea", description: "Hot spiced masala tea" },
  { query: "Masala Chai", expectedSlug: "tea", description: "Masala chai in glass" },
  { query: "Paneer Butter Masala", expectedSlug: "paneer", description: "Rich orange cottage cheese curry" },
  { query: "Shahi Paneer", expectedSlug: "paneer", description: "Creamy paneer" },
  { query: "Yellow Dal Tadka", expectedSlug: "dal", description: "Golden yellow dal with cumin tempering" },
  { query: "Dal Makhani with Butter", expectedSlug: "dal_makhani", description: "Rich slow-cooked black dal" },
  { query: "Vegetable Sambar", expectedSlug: "sambar", description: "Piping hot lentil vegetable sambar" },
  { query: "Punjabi Rajma Masala", expectedSlug: "rajma", description: "Kidney beans in spiced onion-tomato gravy" },
  { query: "Amritsari Chole Masala", expectedSlug: "chole", description: "Amritsari spiced chickpeas" },
  { query: "Aloo Gobhi Roast", expectedSlug: "aloo_gobhi", description: "Spiced cauliflower and potato dry sabzi" },
  { query: "Crispy Papad & Pickle", expectedSlug: "papad", description: "Roasted papad and mango pickle" },
  { query: "Soft Phulka Rotis", expectedSlug: "roti", description: "Soft puffed whole wheat rotis" },
  { query: "Steamed White Basmati Rice", expectedSlug: "rice", description: "Long-grain steamed white rice" },
  { query: "Jeera Pulao", expectedSlug: "pulao", description: "Fragrant cumin tempered rice" },
  { query: "Fragrant Veg Dum Biryani", expectedSlug: "biryani", description: "Aromatic layered vegetable dum biryani" },
  { query: "Osmania & Butter Biscuits", expectedSlug: "biscuits", description: "Crispy tea biscuits" },
  { query: "Warm Gulab Jamun in Syrup", expectedSlug: "gulab_jamun", description: "Rose scented sweet milk dumplings" },
  { query: "Traditional Rice Kheer", expectedSlug: "kheer", description: "Cardamom flavored rice pudding" },
];

console.log("\n=======================================================");
console.log("DISH IMAGERY ACCURACY & FILE INTEGRITY VERIFICATION");
console.log("=======================================================\n");

let passed = 0;
let failed = 0;

// 1. Verify all 24 local files exist in public/images/dishes/
console.log("Checking physical files in public/images/dishes/:");
const publicDishesDir = path.join(process.cwd(), "public", "images", "dishes");
const existingFiles = fs.readdirSync(publicDishesDir);
console.log(`Found ${existingFiles.length} files in ${publicDishesDir}\n`);

for (const [key, meta] of Object.entries(DISH_IMAGE_CATALOG)) {
  const filename = `${key}.jpg`;
  const filePath = path.join(publicDishesDir, filename);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`  ✅ [${key}] File exists: public/images/dishes/${filename} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    console.error(`  ❌ [${key}] MISSING FILE: public/images/dishes/${filename}`);
    failed++;
  }
}

// 2. Test keyword mapping for all test cases
console.log("\nTesting keyword resolution for all dishes:");
for (const tc of testCases) {
  const resolved = resolveDishImage(tc.query);
  const expectedUrl = `/images/dishes/${tc.expectedSlug}.jpg`;

  if (resolved === expectedUrl) {
    console.log(`  ✅ "${tc.query}" ➔ ${resolved} (Matches ${tc.description})`);
    passed++;
  } else {
    console.error(`  ❌ "${tc.query}" ➔ ${resolved} (Expected: ${expectedUrl})`);
    failed++;
  }
}

// 3. Test legacy mismatched URL override
console.log("\nTesting legacy mismatched URL override:");
const alooWithSamosaUrl = resolveDishImage("Aloo Gobhi Roast", "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600");
if (alooWithSamosaUrl === "/images/dishes/aloo_gobhi.jpg") {
  console.log("  ✅ Legacy Samosa photo for Aloo Gobhi successfully overridden to /images/dishes/aloo_gobhi.jpg");
  passed++;
} else {
  console.error("  ❌ Legacy URL override failed for Aloo Gobhi:", alooWithSamosaUrl);
  failed++;
}

console.log("\n=======================================================");
console.log(`VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("=======================================================\n");

if (failed > 0) {
  process.exit(1);
}
