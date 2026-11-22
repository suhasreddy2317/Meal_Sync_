// lib/data/dish-images.ts - Authentic Culinary Food Imagery & Intelligent Resolver

export interface DishImageMeta {
  url: string;        // Local verified asset: /images/dishes/<slug>.jpg
  cdnUrl: string;     // Verified culinary fallback
  name: string;
  category: "main" | "bread" | "rice" | "dessert" | "beverage" | "side" | "snack";
  calories: number;
  isVegetarian?: boolean;
}

/**
 * Curated high-resolution food photography extracted directly from the official mess food menu chart.
 * Contains all 28 dishes organized by meal categories:
 * - Breakfast: Idli, Dosa, Masala Dosa, Upma, Pongal, Poori, Aloo Paratha
 * - Lunch: Steamed Rice + Sambar, Curd Rice, Vegetable Pulav, Chana Masala, Dal Rice, Chicken Biryani, Fish Curry
 * - Snacks: Samosa, Aloo Bonda, Veg Cutlet, Corn Chat, Masala Tea, Egg Roll, Chicken 65
 * - Dinner: Chapati with Dal, Paneer Butter Masala with Naan, Veg Fried Rice, Mixed Vegetable Curry, Curd, Chicken Curry, Egg Curry
 */
export const DISH_IMAGE_CATALOG: Record<string, DishImageMeta> = {
  // ==========================================
  // 1. BREAKFAST ITEMS (Row 0)
  // ==========================================
  idli: {
    url: "/images/dishes/idli.jpg",
    cdnUrl: "/images/dishes/idli.jpg",
    name: "Steamed Idli with Chutney & Sambar",
    category: "main",
    calories: 120,
    isVegetarian: true,
  },
  dosa: {
    url: "/images/dishes/dosa.jpg",
    cdnUrl: "/images/dishes/dosa.jpg",
    name: "Crispy Roast Dosa",
    category: "main",
    calories: 190,
    isVegetarian: true,
  },
  masala_dosa: {
    url: "/images/dishes/masala_dosa.jpg",
    cdnUrl: "/images/dishes/masala_dosa.jpg",
    name: "Golden Masala Dosa",
    category: "main",
    calories: 240,
    isVegetarian: true,
  },
  upma: {
    url: "/images/dishes/upma.jpg",
    cdnUrl: "/images/dishes/upma.jpg",
    name: "Rava Vegetable Upma",
    category: "main",
    calories: 175,
    isVegetarian: true,
  },
  pongal: {
    url: "/images/dishes/pongal.jpg",
    cdnUrl: "/images/dishes/pongal.jpg",
    name: "Ghee Ven Pongal with Cashews",
    category: "main",
    calories: 230,
    isVegetarian: true,
  },
  poori: {
    url: "/images/dishes/poori.jpg",
    cdnUrl: "/images/dishes/poori.jpg",
    name: "Puffed Poori with Potato Sagu",
    category: "bread",
    calories: 260,
    isVegetarian: true,
  },
  aloo_paratha: {
    url: "/images/dishes/aloo_paratha.jpg",
    cdnUrl: "/images/dishes/aloo_paratha.jpg",
    name: "Aloo Paratha with Melting Butter",
    category: "bread",
    calories: 290,
    isVegetarian: true,
  },

  // ==========================================
  // 2. LUNCH ITEMS (Row 1)
  // ==========================================
  rice_sambar: {
    url: "/images/dishes/rice_sambar.jpg",
    cdnUrl: "/images/dishes/rice_sambar.jpg",
    name: "Steamed Rice with Sambar",
    category: "rice",
    calories: 240,
    isVegetarian: true,
  },
  curd_rice: {
    url: "/images/dishes/curd_rice.jpg",
    cdnUrl: "/images/dishes/curd_rice.jpg",
    name: "Traditional South Indian Curd Rice",
    category: "rice",
    calories: 180,
    isVegetarian: true,
  },
  veg_pulav: {
    url: "/images/dishes/veg_pulav.jpg",
    cdnUrl: "/images/dishes/veg_pulav.jpg",
    name: "Vegetable Pulav",
    category: "rice",
    calories: 220,
    isVegetarian: true,
  },
  chana_masala: {
    url: "/images/dishes/chana_masala.jpg",
    cdnUrl: "/images/dishes/chana_masala.jpg",
    name: "Amritsari Chana Masala",
    category: "main",
    calories: 230,
    isVegetarian: true,
  },
  dal_rice: {
    url: "/images/dishes/dal_rice.jpg",
    cdnUrl: "/images/dishes/dal_rice.jpg",
    name: "Comforting Dal Rice",
    category: "rice",
    calories: 250,
    isVegetarian: true,
  },
  chicken_biryani: {
    url: "/images/dishes/chicken_biryani.jpg",
    cdnUrl: "/images/dishes/chicken_biryani.jpg",
    name: "Fragrant Chicken Biryani",
    category: "rice",
    calories: 420,
    isVegetarian: false,
  },
  fish_curry: {
    url: "/images/dishes/fish_curry.jpg",
    cdnUrl: "/images/dishes/fish_curry.jpg",
    name: "Coastal Spiced Fish Curry",
    category: "main",
    calories: 310,
    isVegetarian: false,
  },

  // ==========================================
  // 3. SNACKS ITEMS (Row 2)
  // ==========================================
  samosa: {
    url: "/images/dishes/samosa.jpg",
    cdnUrl: "/images/dishes/samosa.jpg",
    name: "Crispy Potato Samosa",
    category: "snack",
    calories: 210,
    isVegetarian: true,
  },
  aloo_bonda: {
    url: "/images/dishes/aloo_bonda.jpg",
    cdnUrl: "/images/dishes/aloo_bonda.jpg",
    name: "Golden Spiced Aloo Bonda",
    category: "snack",
    calories: 190,
    isVegetarian: true,
  },
  veg_cutlet: {
    url: "/images/dishes/veg_cutlet.jpg",
    cdnUrl: "/images/dishes/veg_cutlet.jpg",
    name: "Crispy Vegetable Cutlet",
    category: "snack",
    calories: 175,
    isVegetarian: true,
  },
  corn_chat: {
    url: "/images/dishes/corn_chat.jpg",
    cdnUrl: "/images/dishes/corn_chat.jpg",
    name: "Tangy Masala Corn Chat",
    category: "snack",
    calories: 140,
    isVegetarian: true,
  },
  masala_tea: {
    url: "/images/dishes/masala_tea.jpg",
    cdnUrl: "/images/dishes/masala_tea.jpg",
    name: "Hot Spiced Masala Tea",
    category: "beverage",
    calories: 70,
    isVegetarian: true,
  },
  egg_roll: {
    url: "/images/dishes/egg_roll.jpg",
    cdnUrl: "/images/dishes/egg_roll.jpg",
    name: "Kolkata Egg Roll",
    category: "snack",
    calories: 280,
    isVegetarian: false,
  },
  chicken_65: {
    url: "/images/dishes/chicken_65.jpg",
    cdnUrl: "/images/dishes/chicken_65.jpg",
    name: "Crispy Spicy Chicken 65",
    category: "snack",
    calories: 320,
    isVegetarian: false,
  },

  // ==========================================
  // 4. DINNER ITEMS (Row 3)
  // ==========================================
  chapati_dal: {
    url: "/images/dishes/chapati_dal.jpg",
    cdnUrl: "/images/dishes/chapati_dal.jpg",
    name: "Chapati with Dal",
    category: "bread",
    calories: 220,
    isVegetarian: true,
  },
  paneer_naan: {
    url: "/images/dishes/paneer_naan.jpg",
    cdnUrl: "/images/dishes/paneer_naan.jpg",
    name: "Paneer Butter Masala with Naan",
    category: "main",
    calories: 360,
    isVegetarian: true,
  },
  veg_fried_rice: {
    url: "/images/dishes/veg_fried_rice.jpg",
    cdnUrl: "/images/dishes/veg_fried_rice.jpg",
    name: "Indo-Chinese Veg Fried Rice",
    category: "rice",
    calories: 260,
    isVegetarian: true,
  },
  mixed_veg_curry: {
    url: "/images/dishes/mixed_veg_curry.jpg",
    cdnUrl: "/images/dishes/mixed_veg_curry.jpg",
    name: "Mixed Vegetable Curry",
    category: "main",
    calories: 180,
    isVegetarian: true,
  },
  curd: {
    url: "/images/dishes/curd.jpg",
    cdnUrl: "/images/dishes/curd.jpg",
    name: "Fresh Plain Curd",
    category: "side",
    calories: 90,
    isVegetarian: true,
  },
  chicken_curry: {
    url: "/images/dishes/chicken_curry.jpg",
    cdnUrl: "/images/dishes/chicken_curry.jpg",
    name: "Spiced Chicken Curry",
    category: "main",
    calories: 340,
    isVegetarian: false,
  },
  egg_curry: {
    url: "/images/dishes/egg_curry.jpg",
    cdnUrl: "/images/dishes/egg_curry.jpg",
    name: "Boiled Egg Curry with Gravy",
    category: "main",
    calories: 240,
    isVegetarian: false,
  },

  // ==========================================
  // 5. LEGACY ALIASES & DESSERTS
  // ==========================================
  tea: {
    url: "/images/dishes/tea.jpg",
    cdnUrl: "/images/dishes/tea.jpg",
    name: "Spiced Masala Chai",
    category: "beverage",
    calories: 65,
    isVegetarian: true,
  },
  coffee: {
    url: "/images/dishes/coffee.jpg",
    cdnUrl: "/images/dishes/coffee.jpg",
    name: "South Indian Filter Coffee",
    category: "beverage",
    calories: 75,
    isVegetarian: true,
  },
  roti: {
    url: "/images/dishes/roti.jpg",
    cdnUrl: "/images/dishes/roti.jpg",
    name: "Soft Phulka Rotis",
    category: "bread",
    calories: 85,
    isVegetarian: true,
  },
  rice: {
    url: "/images/dishes/rice.jpg",
    cdnUrl: "/images/dishes/rice.jpg",
    name: "Steamed White Basmati Rice",
    category: "rice",
    calories: 160,
    isVegetarian: true,
  },
  pulao: {
    url: "/images/dishes/pulao.jpg",
    cdnUrl: "/images/dishes/pulao.jpg",
    name: "Vegetable Pulav",
    category: "rice",
    calories: 210,
    isVegetarian: true,
  },
  biryani: {
    url: "/images/dishes/biryani.jpg",
    cdnUrl: "/images/dishes/biryani.jpg",
    name: "Fragrant Veg Dum Biryani",
    category: "rice",
    calories: 380,
    isVegetarian: true,
  },
  paneer: {
    url: "/images/dishes/paneer.jpg",
    cdnUrl: "/images/dishes/paneer.jpg",
    name: "Paneer Butter Masala",
    category: "main",
    calories: 260,
    isVegetarian: true,
  },
  dal: {
    url: "/images/dishes/dal.jpg",
    cdnUrl: "/images/dishes/dal.jpg",
    name: "Yellow Dal Tadka",
    category: "side",
    calories: 150,
    isVegetarian: true,
  },
  dal_makhani: {
    url: "/images/dishes/dal_makhani.jpg",
    cdnUrl: "/images/dishes/dal_makhani.jpg",
    name: "Dal Makhani with Butter",
    category: "main",
    calories: 230,
    isVegetarian: true,
  },
  sambar: {
    url: "/images/dishes/sambar.jpg",
    cdnUrl: "/images/dishes/sambar.jpg",
    name: "Vegetable Sambar",
    category: "side",
    calories: 130,
    isVegetarian: true,
  },
  rajma: {
    url: "/images/dishes/rajma.jpg",
    cdnUrl: "/images/dishes/rajma.jpg",
    name: "Punjabi Rajma Masala",
    category: "main",
    calories: 210,
    isVegetarian: true,
  },
  chole: {
    url: "/images/dishes/chole.jpg",
    cdnUrl: "/images/dishes/chole.jpg",
    name: "Amritsari Chole Masala",
    category: "main",
    calories: 240,
    isVegetarian: true,
  },
  aloo_gobhi: {
    url: "/images/dishes/aloo_gobhi.jpg",
    cdnUrl: "/images/dishes/aloo_gobhi.jpg",
    name: "Aloo Gobhi Roast",
    category: "side",
    calories: 140,
    isVegetarian: true,
  },
  vada: {
    url: "/images/dishes/vada.jpg",
    cdnUrl: "/images/dishes/vada.jpg",
    name: "Crispy Medu Vada",
    category: "side",
    calories: 180,
    isVegetarian: true,
  },
  poha: {
    url: "/images/dishes/poha.jpg",
    cdnUrl: "/images/dishes/poha.jpg",
    name: "Kanda Batata Poha",
    category: "main",
    calories: 190,
    isVegetarian: true,
  },
  papad: {
    url: "/images/dishes/papad.jpg",
    cdnUrl: "/images/dishes/papad.jpg",
    name: "Crispy Roasted Papad",
    category: "side",
    calories: 50,
    isVegetarian: true,
  },
  biscuits: {
    url: "/images/dishes/biscuits.jpg",
    cdnUrl: "/images/dishes/biscuits.jpg",
    name: "Osmania & Butter Biscuits",
    category: "snack",
    calories: 140,
    isVegetarian: true,
  },
  gulab_jamun: {
    url: "/images/dishes/gulab_jamun.jpg",
    cdnUrl: "/images/dishes/gulab_jamun.jpg",
    name: "Warm Gulab Jamun in Syrup",
    category: "dessert",
    calories: 195,
    isVegetarian: true,
  },
  kheer: {
    url: "/images/dishes/kheer.jpg",
    cdnUrl: "/images/dishes/kheer.jpg",
    name: "Traditional Rice Kheer",
    category: "dessert",
    calories: 180,
    isVegetarian: true,
  },
};

/**
 * Category-aware fallback map using local assets.
 */
export const CATEGORY_FALLBACKS: Record<string, string> = {
  bread: DISH_IMAGE_CATALOG.chapati_dal.url,
  rice: DISH_IMAGE_CATALOG.rice_sambar.url,
  beverage: DISH_IMAGE_CATALOG.masala_tea.url,
  dessert: DISH_IMAGE_CATALOG.gulab_jamun.url,
  snack: DISH_IMAGE_CATALOG.samosa.url,
  side: DISH_IMAGE_CATALOG.curd.url,
  main: DISH_IMAGE_CATALOG.paneer_naan.url,
  default: DISH_IMAGE_CATALOG.rice_sambar.url,
};

/**
 * Determines the matching dish catalog key based on dish name keywords.
 */
export function getDishKeyByName(dishName?: string | null): string | null {
  if (!dishName || !dishName.trim()) return null;
  const q = dishName.toLowerCase().trim();

  // 1. Specific multi-word dishes (high precedence)
  if (q.includes("masala dosa")) return "masala_dosa";
  if (q.includes("aloo paratha") || (q.includes("paratha") && !q.includes("poori"))) return "aloo_paratha";
  if (q.includes("pongal")) return "pongal";
  if (q.includes("poori") || q.includes("puri")) return "poori";
  if (q.includes("curd rice")) return "curd_rice";
  if (q.includes("dal rice") || q.includes("dal chawal")) return "dal_rice";
  if (q.includes("fried rice")) return "veg_fried_rice";
  if (q.includes("vegetable pulav") || q.includes("veg pulav")) return "veg_pulav";
  if (q.includes("jeera pulao") || q.includes("pulao") || q.includes("pulav")) return "pulao";
  if (q.includes("chicken biryani")) return "chicken_biryani";
  if (q.includes("biryani")) return "biryani";
  if (q.includes("fish curry") || q.includes("fish")) return "fish_curry";
  if (q.includes("aloo bonda") || q.includes("bonda")) return "aloo_bonda";
  if (q.includes("veg cutlet") || q.includes("cutlet")) return "veg_cutlet";
  if (q.includes("corn chat") || q.includes("corn chaat") || (q.includes("corn") && q.includes("chat"))) return "corn_chat";
  if (q.includes("egg roll") || q.includes("kathi roll")) return "egg_roll";
  if (q.includes("chicken 65")) return "chicken_65";
  if (q.includes("chicken curry") || (q.includes("chicken") && !q.includes("biryani") && !q.includes("65"))) return "chicken_curry";
  if (q.includes("egg curry") || (q.includes("egg") && !q.includes("roll"))) return "egg_curry";
  if (q.includes("paneer butter masala with naan") || q.includes("paneer naan")) return "paneer_naan";
  if (q.includes("paneer butter masala") || q.includes("paneer")) return "paneer";
  if (q.includes("chapati with dal")) return "chapati_dal";
  if (q.includes("roti") || q.includes("phulka") || q.includes("chapati")) return "roti";
  if (q.includes("chana masala")) return "chana_masala";
  if (q.includes("chole") || q.includes("chana") || q.includes("channa")) return "chole";
  if (q.includes("dal makhani")) return "dal_makhani";
  if (q.includes("yellow dal") || q.includes("dal tadka") || (q.includes("dal") && !q.includes("rice"))) return "dal";
  if (q.includes("rajma")) return "rajma";
  if (q.includes("aloo gobhi") || q.includes("aloo gobi") || q.includes("gobhi") || q.includes("gobi")) return "aloo_gobhi";
  if (q.includes("mixed veg") || q.includes("mixed vegetable")) return "mixed_veg_curry";
  if (q.includes("steamed rice + sambar") || q.includes("rice + sambar") || q.includes("steamed rice with sambar") || q.includes("rice with sambar")) return "rice_sambar";
  if (q.includes("sambar") || q.includes("sambhar")) return "sambar";
  if (q.includes("steamed white") || (q.includes("steamed rice") && !q.includes("sambar"))) return "rice";

  // 2. Breakfast Specialties
  if (q.includes("idli") || q.includes("idly")) return "idli";
  if (q.includes("dosa") || q.includes("dosai")) return "dosa";
  if (q.includes("upma") || q.includes("rava upma")) return "upma";
  if (q.includes("poha")) return "poha";
  if (q.includes("vada") || q.includes("wada")) return "vada";

  // 3. Beverages & Tea
  if (q.includes("masala tea")) return "masala_tea";
  if (q.includes("chai") || /\btea\b/i.test(q)) return "tea";
  if (q.includes("coffee") || q.includes("kaapi")) return "coffee";

  // 4. Snacks
  if (q.includes("samosa")) return "samosa";
  if (q.includes("biscuit") || q.includes("cookie")) return "biscuits";
  if (q.includes("papad")) return "papad";

  // 5. Curd & Dairy
  if (q.includes("curd") || q.includes("dahi") || q.includes("yogurt") || q.includes("raita")) return "curd";

  // 6. Dal & Sambar
  if (q.includes("sambar") || q.includes("sambhar")) return "sambar";
  if (q.includes("dal") || q.includes("tadka") || q.includes("lentil")) return "dal";

  // 7. Desserts
  if (q.includes("jamun") || q.includes("gulab")) return "gulab_jamun";
  if (q.includes("kheer") || q.includes("payasam") || q.includes("halwa") || q.includes("sweet") || q.includes("dessert")) return "kheer";

  // 8. Rice (general)
  if (q.includes("rice") || q.includes("chawal")) return "rice";

  return null;
}

/**
 * Intelligent keyword-based dish image resolver.
 * Ensures strict, unambiguous matching for every dish without cross-contamination.
 */
export function resolveDishImage(
  dishName?: string | null,
  customUrl?: string | null,
  category?: string | null
): string {
  const matchedKey = getDishKeyByName(dishName);

  // If a customUrl is provided and is an existing local asset or data URL, keep it
  if (customUrl && customUrl.trim().length > 0) {
    const trimmed = customUrl.trim();
    if (trimmed.startsWith("/images/dishes/") || trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
      return trimmed;
    }
  }

  // If we found an exact catalog match, return its verified local asset
  if (matchedKey && DISH_IMAGE_CATALOG[matchedKey]) {
    return DISH_IMAGE_CATALOG[matchedKey].url;
  }

  // Category fallback if available
  if (category && CATEGORY_FALLBACKS[category]) {
    return CATEGORY_FALLBACKS[category];
  }

  return CATEGORY_FALLBACKS.default;
}

/**
 * Get direct CDN/asset fallback URL for a dish.
 */
export function getDishCdnFallback(dishName?: string | null, category?: string | null): string {
  const matchedKey = getDishKeyByName(dishName);
  if (matchedKey && DISH_IMAGE_CATALOG[matchedKey]?.cdnUrl) {
    return DISH_IMAGE_CATALOG[matchedKey].cdnUrl;
  }
  if (category && CATEGORY_FALLBACKS[category]) {
    return CATEGORY_FALLBACKS[category];
  }
  return DISH_IMAGE_CATALOG.rice_sambar.url;
}

/**
 * Official mess menu presets covering all 28 dishes from the master food chart.
 */
export const DISH_PRESETS = [
  // Breakfast
  { name: "Idli with Chutney & Sambar", category: "main" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.idli.url },
  { name: "Crispy Roast Dosa", category: "main" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.dosa.url },
  { name: "Golden Masala Dosa", category: "main" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.masala_dosa.url },
  { name: "Rava Vegetable Upma", category: "main" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.upma.url },
  { name: "Ghee Ven Pongal with Cashews", category: "main" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.pongal.url },
  { name: "Puffed Poori with Potato Sagu", category: "bread" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.poori.url },
  { name: "Aloo Paratha with Melting Butter", category: "bread" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.aloo_paratha.url },

  // Lunch
  { name: "Steamed Rice with Sambar", category: "rice" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.rice_sambar.url },
  { name: "South Indian Curd Rice", category: "rice" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.curd_rice.url },
  { name: "Vegetable Pulav", category: "rice" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.veg_pulav.url },
  { name: "Amritsari Chana Masala", category: "main" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.chana_masala.url },
  { name: "Comforting Dal Rice", category: "rice" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.dal_rice.url },
  { name: "Fragrant Chicken Biryani", category: "rice" as const, is_vegetarian: false, image_url: DISH_IMAGE_CATALOG.chicken_biryani.url },
  { name: "Coastal Spiced Fish Curry", category: "main" as const, is_vegetarian: false, image_url: DISH_IMAGE_CATALOG.fish_curry.url },

  // Snacks
  { name: "Crispy Potato Samosa", category: "snack" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.samosa.url },
  { name: "Golden Spiced Aloo Bonda", category: "snack" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.aloo_bonda.url },
  { name: "Crispy Vegetable Cutlet", category: "snack" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.veg_cutlet.url },
  { name: "Tangy Masala Corn Chat", category: "snack" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.corn_chat.url },
  { name: "Hot Spiced Masala Tea", category: "beverage" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.masala_tea.url },
  { name: "Kolkata Egg Roll", category: "snack" as const, is_vegetarian: false, image_url: DISH_IMAGE_CATALOG.egg_roll.url },
  { name: "Crispy Spicy Chicken 65", category: "snack" as const, is_vegetarian: false, image_url: DISH_IMAGE_CATALOG.chicken_65.url },

  // Dinner
  { name: "Chapati with Dal", category: "bread" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.chapati_dal.url },
  { name: "Paneer Butter Masala with Naan", category: "main" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.paneer_naan.url },
  { name: "Indo-Chinese Veg Fried Rice", category: "rice" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.veg_fried_rice.url },
  { name: "Mixed Vegetable Curry", category: "main" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.mixed_veg_curry.url },
  { name: "Fresh Plain Curd", category: "side" as const, is_vegetarian: true, image_url: DISH_IMAGE_CATALOG.curd.url },
  { name: "Spiced Chicken Curry", category: "main" as const, is_vegetarian: false, image_url: DISH_IMAGE_CATALOG.chicken_curry.url },
  { name: "Boiled Egg Curry with Gravy", category: "main" as const, is_vegetarian: false, image_url: DISH_IMAGE_CATALOG.egg_curry.url },
];
