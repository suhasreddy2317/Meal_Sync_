// lib/data/mess-store.ts: Unified Data Layer & MealSync Demo Repository

import {
  Profile,
  Menu,
  MenuItem,
  MealPlan,
  FoodRecord,
  Rating,
  Notification,
  DemandPrediction,
  Recommendation,
  GroceryItem,
  Recipe,
  Complaint,
  WalletTransaction,
  ActivityItem,
  MealType,
} from "@/lib/types/database";
import { calculateDemandPrediction } from "@/lib/services/ai-prediction";
import { evaluateMessRecommendations } from "@/lib/services/recommendations";
import { matchRecipesAgainstStock } from "@/lib/services/recipe-matcher";
import { resolveDishImage, DISH_IMAGE_CATALOG } from "@/lib/data/dish-images";

declare global {
  var __messStore: MessStoreState | undefined;
}

interface MessStoreState {
  profiles: Profile[];
  menus: Menu[];
  menuItems: MenuItem[];
  mealPlans: MealPlan[];
  foodRecords: FoodRecord[];
  ratings: Rating[];
  notifications: Notification[];
  groceries: GroceryItem[];
  recipes: Recipe[];
  complaints: Complaint[];
  transactions: WalletTransaction[];
  activities: ActivityItem[];
}

export const FOOD_IMAGES: Record<MealType, { url: string; label: string; desc: string; calories: number }> = {
  breakfast: {
    url: DISH_IMAGE_CATALOG.idli.url,
    label: "Breakfast",
    desc: "Idli, Dosa & Parathas",
    calories: 340,
  },
  lunch: {
    url: DISH_IMAGE_CATALOG.rice_sambar.url,
    label: "Lunch",
    desc: "Steamed Rice + Sambar & Meals",
    calories: 580,
  },
  snacks: {
    url: DISH_IMAGE_CATALOG.samosa.url,
    label: "Evening Snacks",
    desc: "Samosa, Rolls & Masala Tea",
    calories: 210,
  },
  dinner: {
    url: DISH_IMAGE_CATALOG.paneer_naan.url,
    label: "Dinner",
    desc: "Paneer Butter Masala with Naan",
    calories: 620,
  },
};

function generateInitialSeed(): MessStoreState {
  // 1. Admin Profile
  const profiles: Profile[] = [
    {
      id: "u-admin-001",
      email: "admin@msruas.ac.in",
      full_name: "Mess Head Administrator",
      roll_number: null,
      department: "Catering Management",
      hostel_block: "Admin Block",
      room_number: "Office 101",
      mess_allocation: "Central Kitchen 1",
      phone: "+91 98765 43210",
      role: "admin",
      wallet_balance: 0,
      avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // 2. 25 Realistic Student Profiles
  const studentNames = [
    "Aarav Sharma", "Aditi Patel", "Ananya Verma", "Arjun Reddy", "Deepak Gupta",
    "Divya Nair", "Ishaan Malhotra", "Kavya Iyer", "Karan Singhania", "Manish Mehra",
    "Meera Joshi", "Neha Kulkarni", "Nikhil Rao", "Pooja Deshmukh", "Pranav Joshi",
    "Priyanka Sen", "Rahul Saxena", "Riya Mukherjee", "Rohan Bhattacharya", "Sanya Kapoor",
    "Siddharth Menon", "Sneha Pillai", "Tanvi Agarwal", "Varun Chopra", "Vikram Bansal",
  ];

  studentNames.forEach((name, idx) => {
    const num = (idx + 1).toString().padStart(3, "0");
    const block = ["A", "B", "C", "D"][idx % 4];
    profiles.push({
      id: `u-student-${num}`,
      email: `student${idx + 1}@msruas.ac.in`,
      full_name: name,
      roll_number: `2024CS${num}`,
      department: "Computer Science & Engineering",
      hostel_block: `Block ${block}`,
      room_number: `${100 + (idx % 20) + 1}`,
      mess_allocation: "Central Mess Hall 1",
      phone: `+91 98110 ${10000 + idx * 77}`,
      role: "student",
      wallet_balance: 450, // MealSync design wallet default: ₹450
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  });

  // 3. Groceries (15 standard pantry items)
  const groceries: GroceryItem[] = [
    { id: "g-01", name: "Basmati Rice", category: "grains", current_stock: 180, min_threshold: 50, unit: "kg", updated_at: new Date().toISOString() },
    { id: "g-02", name: "Whole Wheat Atta", category: "grains", current_stock: 220, min_threshold: 60, unit: "kg", updated_at: new Date().toISOString() },
    { id: "g-03", name: "Toor Dal", category: "pulses", current_stock: 65, min_threshold: 25, unit: "kg", updated_at: new Date().toISOString() },
    { id: "g-04", name: "Rajma (Kidney Beans)", category: "pulses", current_stock: 42, min_threshold: 15, unit: "kg", updated_at: new Date().toISOString() },
    { id: "g-05", name: "Urad Dal Black", category: "pulses", current_stock: 35, min_threshold: 10, unit: "kg", updated_at: new Date().toISOString() },
    { id: "g-06", name: "Fresh Paneer", category: "dairy", current_stock: 28, min_threshold: 10, unit: "kg", updated_at: new Date().toISOString() },
    { id: "g-07", name: "Full Cream Milk", category: "dairy", current_stock: 48, min_threshold: 20, unit: "liters", updated_at: new Date().toISOString() },
    { id: "g-08", name: "Desi Ghee", category: "dairy", current_stock: 18, min_threshold: 5, unit: "liters", updated_at: new Date().toISOString() },
    { id: "g-09", name: "Refined Sunflower Oil", category: "oils", current_stock: 55, min_threshold: 20, unit: "liters", updated_at: new Date().toISOString() },
    { id: "g-10", name: "Red Onions", category: "vegetables", current_stock: 85, min_threshold: 30, unit: "kg", updated_at: new Date().toISOString() },
    { id: "g-11", name: "Potatoes (Aloo)", category: "vegetables", current_stock: 110, min_threshold: 40, unit: "kg", updated_at: new Date().toISOString() },
    { id: "g-12", name: "Fresh Tomatoes", category: "vegetables", current_stock: 45, min_threshold: 20, unit: "kg", updated_at: new Date().toISOString() },
    { id: "g-13", name: "Garam Masala & Spices", category: "spices", current_stock: 14, min_threshold: 3, unit: "kg", updated_at: new Date().toISOString() },
    { id: "g-14", name: "Refined Sugar", category: "other", current_stock: 35, min_threshold: 15, unit: "kg", updated_at: new Date().toISOString() },
    { id: "g-15", name: "Flattened Rice (Poha)", category: "grains", current_stock: 30, min_threshold: 10, unit: "kg", updated_at: new Date().toISOString() },
  ];

  // 4. Recipes
  const recipes: Recipe[] = [
    {
      id: "r-01",
      name: "Paneer Butter Masala",
      description: "Rich cottage cheese cubes simmered in velvety spiced tomato-onion gravy",
      instructions: "1. Sauté onions and tomatoes. 2. Blend into gravy with spices. 3. Simmer with paneer cubes and butter.",
      default_servings: 100,
      created_at: new Date().toISOString(),
      ingredients: [
        { id: "ri-01", recipe_id: "r-01", grocery_item_id: "g-06", quantity_per_serving: 0.12, unit: "kg" },
        { id: "ri-02", recipe_id: "r-01", grocery_item_id: "g-12", quantity_per_serving: 0.08, unit: "kg" },
        { id: "ri-03", recipe_id: "r-01", grocery_item_id: "g-10", quantity_per_serving: 0.05, unit: "kg" },
        { id: "ri-04", recipe_id: "r-01", grocery_item_id: "g-08", quantity_per_serving: 0.015, unit: "liters" },
      ],
    },
    {
      id: "r-02",
      name: "Punjabi Rajma Chawal",
      description: "Slow-cooked red kidney beans in authentic spiced gravy served over steamed rice",
      instructions: "1. Soak rajma overnight. 2. Pressure cook until tender. 3. Sauté with onions, tomatoes and garam masala. 4. Serve over steamed basmati.",
      default_servings: 100,
      created_at: new Date().toISOString(),
      ingredients: [
        { id: "ri-05", recipe_id: "r-02", grocery_item_id: "g-04", quantity_per_serving: 0.08, unit: "kg" },
        { id: "ri-06", recipe_id: "r-02", grocery_item_id: "g-01", quantity_per_serving: 0.1, unit: "kg" },
        { id: "ri-07", recipe_id: "r-02", grocery_item_id: "g-10", quantity_per_serving: 0.05, unit: "kg" },
        { id: "ri-08", recipe_id: "r-02", grocery_item_id: "g-12", quantity_per_serving: 0.06, unit: "kg" },
      ],
    },
    {
      id: "r-03",
      name: "Dal Makhani with Roti",
      description: "Slow-simmered black lentils with butter and cream paired with fresh whole wheat rotis",
      instructions: "1. Cook urad dal until creamy. 2. Temper with ginger, garlic, tomatoes and butter. 3. Prepare fresh tawa rotis from atta.",
      default_servings: 100,
      created_at: new Date().toISOString(),
      ingredients: [
        { id: "ri-09", recipe_id: "r-03", grocery_item_id: "g-05", quantity_per_serving: 0.07, unit: "kg" },
        { id: "ri-10", recipe_id: "r-03", grocery_item_id: "g-02", quantity_per_serving: 0.1, unit: "kg" },
        { id: "ri-11", recipe_id: "r-03", grocery_item_id: "g-08", quantity_per_serving: 0.02, unit: "liters" },
      ],
    },
    {
      id: "r-04",
      name: "Kanda Batata Poha",
      description: "Light breakfast flattened rice tempered with mustard, onions, potatoes and turmeric",
      instructions: "1. Rinse poha. 2. Sauté mustard, onions and diced potatoes. 3. Mix poha and steam for 3 mins.",
      default_servings: 100,
      created_at: new Date().toISOString(),
      ingredients: [
        { id: "ri-12", recipe_id: "r-04", grocery_item_id: "g-15", quantity_per_serving: 0.08, unit: "kg" },
        { id: "ri-13", recipe_id: "r-04", grocery_item_id: "g-10", quantity_per_serving: 0.03, unit: "kg" },
        { id: "ri-14", recipe_id: "r-04", grocery_item_id: "g-11", quantity_per_serving: 0.04, unit: "kg" },
      ],
    },
  ];

  // 5. Four Daily Meals (Breakfast, Lunch, Snacks, Dinner)
  const mealSchedules: { type: MealType; cutoff: string; start: string; end: string }[] = [
    { type: "breakfast", cutoff: "06:00:00", start: "07:30:00", end: "09:30:00" },
    { type: "lunch", cutoff: "10:00:00", start: "12:30:00", end: "14:30:00" },
    { type: "snacks", cutoff: "15:30:00", start: "17:00:00", end: "18:00:00" },
    { type: "dinner", cutoff: "17:00:00", start: "19:30:00", end: "21:30:00" },
  ];

  // 28 Dishes From The Master Mess Food Chart Organized by Meal Category
  const weeklyDishSchedule: Record<MealType, { name: string; desc: string; cat: any; is_veg: boolean; image_url: string }[]> = {
    breakfast: [
      { name: "Idli with Coconut & Tomato Chutney", desc: "Steamed fluffy rice-lentil cakes served with sambar and fresh chutney", cat: "main", is_veg: true, image_url: "/images/dishes/idli.jpg" },
      { name: "Crispy Plain Dosa", desc: "Golden thin crepe made from fermented batter served with sambar", cat: "main", is_veg: true, image_url: "/images/dishes/dosa.jpg" },
      { name: "Golden Masala Dosa", desc: "Crispy crepe stuffed with fragrant spiced potato filling", cat: "main", is_veg: true, image_url: "/images/dishes/masala_dosa.jpg" },
      { name: "Rava Vegetable Upma", desc: "Tempered semolina porridge cooked with seasonal vegetables and mustard seeds", cat: "main", is_veg: true, image_url: "/images/dishes/upma.jpg" },
      { name: "Ghee Ven Pongal with Cashews", desc: "Creamy rice and moong dal tempered with roasted cashews, pepper and cumin in ghee", cat: "main", is_veg: true, image_url: "/images/dishes/pongal.jpg" },
      { name: "Puffed Poori with Potato Sagu", desc: "Golden deep-fried puffed breads served with spiced potato sagu", cat: "bread", is_veg: true, image_url: "/images/dishes/poori.jpg" },
      { name: "Aloo Paratha with Melting Butter", desc: "Whole-wheat flatbread stuffed with spiced potatoes topped with butter", cat: "bread", is_veg: true, image_url: "/images/dishes/aloo_paratha.jpg" },
    ],
    lunch: [
      { name: "Steamed Rice + Sambar", desc: "Hot steamed rice served with aromatic spiced lentil and vegetable sambar", cat: "rice", is_veg: true, image_url: "/images/dishes/rice_sambar.jpg" },
      { name: "Curd Rice", desc: "Cool seasoned rice blended with fresh yogurt and tempered with mustard seeds", cat: "rice", is_veg: true, image_url: "/images/dishes/curd_rice.jpg" },
      { name: "Vegetable Pulav", desc: "Fragrant basmati rice gently spiced and cooked with garden fresh vegetables", cat: "rice", is_veg: true, image_url: "/images/dishes/veg_pulav.jpg" },
      { name: "Amritsari Chana Masala", desc: "Tender chickpeas simmered in a robust, tangy onion-tomato-spice gravy", cat: "main", is_veg: true, image_url: "/images/dishes/chana_masala.jpg" },
      { name: "Dal Rice", desc: "Comforting steamed rice paired with wholesome yellow dal tadka", cat: "rice", is_veg: true, image_url: "/images/dishes/dal_rice.jpg" },
      { name: "Fragrant Chicken Biryani", desc: "Rich and flavorful basmati rice layered with tender marinated chicken and aromatics", cat: "rice", is_veg: false, image_url: "/images/dishes/chicken_biryani.jpg" },
      { name: "Coastal Spiced Fish Curry", desc: "Fresh fish fillets simmered in a tangy spiced coconut-tamarind gravy", cat: "main", is_veg: false, image_url: "/images/dishes/fish_curry.jpg" },
    ],
    snacks: [
      { name: "Crispy Potato Samosa", desc: "Flaky pastry cones filled with spicy potato and green peas masala", cat: "snack", is_veg: true, image_url: "/images/dishes/samosa.jpg" },
      { name: "Golden Spiced Aloo Bonda", desc: "Crispy chickpea flour batter-fried spiced potato balls", cat: "snack", is_veg: true, image_url: "/images/dishes/aloo_bonda.jpg" },
      { name: "Crispy Vegetable Cutlet", desc: "Golden-crumbed savoury patties made with mixed vegetables and spices", cat: "snack", is_veg: true, image_url: "/images/dishes/veg_cutlet.jpg" },
      { name: "Tangy Masala Corn Chat", desc: "Sweet golden corn tossed with chaat masala, lime, onions, and coriander", cat: "snack", is_veg: true, image_url: "/images/dishes/corn_chat.jpg" },
      { name: "Hot Spiced Masala Tea", desc: "Freshly brewed hot milk tea infused with crushed ginger and cardamom", cat: "beverage", is_veg: true, image_url: "/images/dishes/masala_tea.jpg" },
      { name: "Kolkata Egg Roll", desc: "Crisp flaky paratha wrapped with fried egg, crisp onions, and tangy sauce", cat: "snack", is_veg: false, image_url: "/images/dishes/egg_roll.jpg" },
      { name: "Crispy Spicy Chicken 65", desc: "Deep-fried spicy chicken bites seasoned with red chilies, garlic, and curry leaves", cat: "snack", is_veg: false, image_url: "/images/dishes/chicken_65.jpg" },
    ],
    dinner: [
      { name: "Chapati with Dal", desc: "Soft whole wheat chapatis served with homestyle spiced yellow dal", cat: "bread", is_veg: true, image_url: "/images/dishes/chapati_dal.jpg" },
      { name: "Paneer Butter Masala with Naan", desc: "Soft cottage cheese cubes in rich butter gravy served with crisp tandoori naan", cat: "main", is_veg: true, image_url: "/images/dishes/paneer_naan.jpg" },
      { name: "Indo-Chinese Veg Fried Rice", desc: "Wok-tossed long-grain rice with finely diced vegetables and soy seasoning", cat: "rice", is_veg: true, image_url: "/images/dishes/veg_fried_rice.jpg" },
      { name: "Mixed Vegetable Curry", desc: "Medley of seasonal vegetables simmered in a spiced onion-tomato curry", cat: "main", is_veg: true, image_url: "/images/dishes/mixed_veg_curry.jpg" },
      { name: "Fresh Plain Curd", desc: "Cool set whole milk yogurt, soothing and probiotic", cat: "side", is_veg: true, image_url: "/images/dishes/curd.jpg" },
      { name: "Homestyle Chicken Curry", desc: "Tender chicken pieces simmered in an aromatic spiced gravy with onions and tomatoes", cat: "main", is_veg: false, image_url: "/images/dishes/chicken_curry.jpg" },
      { name: "Boiled Egg Curry with Gravy", desc: "Boiled eggs simmered in a luscious onion-tomato masala gravy", cat: "main", is_veg: false, image_url: "/images/dishes/egg_curry.jpg" },
    ],
  };

  const menus: Menu[] = [];
  const menuItems: MenuItem[] = [];
  const mealPlans: MealPlan[] = [];
  const foodRecords: FoodRecord[] = [];
  const ratings: Rating[] = [];
  const notifications: Notification[] = [];

  const today = new Date();

  for (let offset = -14; offset <= 7; offset++) {
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + offset);
    const dateStr = targetDate.toISOString().split("T")[0];
    const isPast = offset < 0;
    const dayOfWeek = (targetDate.getDay() + 6) % 7; // Monday=0, Sunday=6

    mealSchedules.forEach((sched) => {
      const menuId = `menu-${dateStr}-${sched.type}`;
      const foodMeta = FOOD_IMAGES[sched.type];
      const primaryDish = weeklyDishSchedule[sched.type][dayOfWeek];
      const dishes = [primaryDish];

      const menu: Menu = {
        id: menuId,
        menu_date: dateStr,
        meal_type: sched.type,
        cutoff_time: sched.cutoff,
        serving_start_time: sched.start,
        serving_end_time: sched.end,
        is_published: true,
        image_url: primaryDish.image_url,
        special_badge: sched.type === "dinner" ? "Chef's Special" : undefined,
        calories: foodMeta.calories,
        created_at: new Date(targetDate.getTime() - 86400000 * 2).toISOString(),
        updated_at: new Date(targetDate.getTime() - 86400000 * 2).toISOString(),
      };
      menus.push(menu);

      dishes.forEach((dish, dIdx) => {
        menuItems.push({
          id: `item-${menuId}-${dIdx}`,
          menu_id: menuId,
          name: dish.name,
          description: dish.desc,
          category: dish.cat,
          is_vegetarian: dish.is_veg,
          image_url: dish.image_url,
          created_at: menu.created_at,
        });
      });

      // Student Meal Plans (opt-ins)
      let yesCount = 0;
      profiles.slice(1).forEach((student, sIdx) => {
        const willEat = (sIdx + offset + (sched.type === "dinner" ? 2 : 1)) % 5 !== 0;
        if (willEat) yesCount++;
        mealPlans.push({
          id: `mp-${menuId}-${student.id}`,
          student_id: student.id,
          menu_id: menuId,
          status: willEat ? "yes" : "no",
          submitted_at: new Date(targetDate.getTime() - 86400000).toISOString(),
          updated_at: new Date(targetDate.getTime() - 86400000).toISOString(),
        });
      });

      // Historical records
      if (isPast) {
        const actualAttendance = Math.max(8, Math.round(yesCount * 0.9));
        const prepQty = parseFloat((actualAttendance * 0.38 + 2.5).toFixed(1));
        const leftoverQty = parseFloat((Math.random() * 2.2 + 0.8).toFixed(1));
        const wastagePct = parseFloat(((leftoverQty / prepQty) * 100).toFixed(2));

        foodRecords.push({
          id: `fr-${menuId}`,
          menu_id: menuId,
          prepared_qty: prepQty,
          leftover_qty: leftoverQty,
          unit: "kg",
          actual_attendance: actualAttendance,
          wastage_percentage: wastagePct,
          recorded_at: new Date(`${dateStr}T${sched.end}`).toISOString(),
          updated_at: new Date(`${dateStr}T${sched.end}`).toISOString(),
        });

        // MealSync average rating seed: 4.6 / 5
        profiles.slice(1, 10).forEach((student, sIdx) => {
          ratings.push({
            id: `rat-${menuId}-${student.id}`,
            student_id: student.id,
            menu_id: menuId,
            rating: sIdx === 0 ? 4 : 5,
            comment: sIdx % 2 === 0 ? "Excellent seasoning and warm serving!" : "Really enjoyed the taste today.",
            meal_type: sched.type,
            created_at: new Date(`${dateStr}T${sched.end}`).toISOString(),
            updated_at: new Date(`${dateStr}T${sched.end}`).toISOString(),
          });
        });
      }
    });
  }

  // 6. Complaints Store
  const complaints: Complaint[] = [
    {
      id: "C-104",
      student_id: "u-student-001",
      student_name: "Aarav Sharma",
      category: "Food Quality",
      title: "Chapati slightly dry during yesterday's dinner",
      description: "The rotis served during dinner were somewhat hard and lacked butter brushing. Would appreciate keeping them in insulated warmers.",
      status: "In Progress",
      urgency: "Normal",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      admin_remarks: "Noted with chef. New insulated roti containers deployed.",
    },
    {
      id: "C-103",
      student_id: "u-student-001",
      student_name: "Aarav Sharma",
      category: "Hygiene",
      title: "Hand sanitizing station refill needed",
      description: "Sanitizer dispenser at Dining Hall entrance 2 is empty.",
      status: "Resolved",
      urgency: "High",
      created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      resolved_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      admin_remarks: "Refilled and daily sanitization check confirmed.",
    },
  ];

  // 7. Wallet Transactions (Balance: ₹450)
  const transactions: WalletTransaction[] = [
    {
      id: "tx-001",
      student_id: "u-student-001",
      amount: 500,
      type: "topup",
      description: "Wallet Recharge via UPI",
      status: "Success",
      created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    },
    {
      id: "tx-002",
      student_id: "u-student-001",
      amount: -50,
      type: "meal_deduction",
      description: "Dinner Meal Booking (Paneer Curry)",
      status: "Success",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "tx-003",
      student_id: "u-student-001",
      amount: 1000,
      type: "topup",
      description: "Monthly Mess Allowance",
      status: "Success",
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
  ];

  // 8. Recent activities for the MealSync dashboard
  const activities: ActivityItem[] = [
    {
      id: "act-1",
      title: "Meal marked for today",
      timestamp: "2 mins ago",
      type: "meal",
    },
    {
      id: "act-2",
      title: "Wallet recharged with ₹500",
      timestamp: "1 hour ago",
      type: "wallet",
    },
    {
      id: "act-3",
      title: "New menu updated for dinner",
      timestamp: "3 hours ago",
      type: "menu",
    },
    {
      id: "act-4",
      title: "Complaint #C-104 updated to In Progress",
      timestamp: "Yesterday",
      type: "complaint",
    },
  ];

  // 9. Initial Notifications
  const notificationsList: Notification[] = [
    {
      id: "n-1",
      user_id: "u-student-001",
      title: "Today's Lunch Menu Published",
      message: "Lunch features Steamed Rice + Sambar & Aloo Gobhi. Cutoff is 10:00 AM.",
      type: "menu_update",
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "n-2",
      user_id: "u-student-001",
      title: "Wallet Recharge Successful",
      message: "₹500 added to your MealSync wallet via UPI. New balance: ₹450.",
      type: "payment",
      is_read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "n-3",
      user_id: "u-student-001",
      title: "Evening Snacks Ready",
      message: "Hot Masala Chai and Samosa serving has commenced at 05:00 PM.",
      type: "announcement",
      is_read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
  ];

  return {
    profiles,
    menus,
    menuItems,
    mealPlans,
    foodRecords,
    ratings,
    notifications: notificationsList,
    groceries,
    recipes,
    complaints,
    transactions,
    activities,
  };
}

export function getStore(): MessStoreState {
  if (!global.__messStore) {
    global.__messStore = generateInitialSeed();
  }
  return global.__messStore;
}

// -------------------------------------------------------------
// Unified Data Access API Methods
// -------------------------------------------------------------

export function getAllMenus(filterDate?: string): Menu[] {
  const store = getStore();
  let list = store.menus;

  if (filterDate) {
    list = list.filter((m) => m.menu_date === filterDate);
  }

  return list.map((m) => {
    const rawItems = store.menuItems.filter((item) => item.menu_id === m.id);
    const items = rawItems.map((item) => ({
      ...item,
      image_url: item.image_url || resolveDishImage(item.name, null, item.category),
    }));
    const plans = store.mealPlans.filter((p) => p.menu_id === m.id);
    const yesPlans = plans.filter((p) => p.status === "yes").length;
    const foodRecord = store.foodRecords.find((fr) => fr.menu_id === m.id) || null;
    const menuRatings = store.ratings.filter((r) => r.menu_id === m.id);
    const avgRating =
      menuRatings.length > 0
        ? parseFloat((menuRatings.reduce((sum, r) => sum + r.rating, 0) / menuRatings.length).toFixed(1))
        : 4.6;

    const foodMeta = FOOD_IMAGES[m.meal_type] || FOOD_IMAGES.lunch;
    const primaryImg = items.length > 0 && items[0].image_url ? items[0].image_url : (m.image_url || foodMeta.url);

    return {
      ...m,
      image_url: primaryImg,
      calories: m.calories || foodMeta.calories,
      items,
      expected_attendance: yesPlans,
      food_record: foodRecord,
      avg_rating: avgRating,
      total_ratings: menuRatings.length,
    };
  });
}

export function getMenuById(id: string, currentUserId?: string): Menu | null {
  const store = getStore();
  let m = store.menus.find((menu) => menu.id === id);

  // Fallback 1: Resolve menu-YYYY-MM-DD-type format
  if (!m) {
    const dateMatch = id.match(/^menu-(\d{4}-\d{2}-\d{2})-(breakfast|lunch|snacks|dinner)$/);
    if (dateMatch) {
      const [, dStr, mType] = dateMatch;
      m = store.menus.find((menu) => menu.menu_date === dStr && menu.meal_type === mType);
      if (!m) {
        const foodMeta = FOOD_IMAGES[mType as MealType] || FOOD_IMAGES.lunch;
        m = {
          id,
          menu_date: dStr,
          meal_type: mType as MealType,
          cutoff_time: mType === "breakfast" ? "06:00:00" : mType === "lunch" ? "10:00:00" : mType === "snacks" ? "15:30:00" : "17:00:00",
          serving_start_time: mType === "breakfast" ? "07:30:00" : mType === "lunch" ? "12:30:00" : mType === "snacks" ? "17:00:00" : "19:30:00",
          serving_end_time: mType === "breakfast" ? "09:30:00" : mType === "lunch" ? "14:30:00" : mType === "snacks" ? "18:00:00" : "21:30:00",
          is_published: true,
          image_url: foodMeta.url,
          calories: foodMeta.calories,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        store.menus.push(m);
      }
    }
  }

  // Fallback 2: Resolve menu-DayName-type format
  if (!m) {
    const dayMatch = id.match(/^menu-([A-Za-z]+)-(breakfast|lunch|snacks|dinner)$/);
    if (dayMatch) {
      const [, dayName, mType] = dayMatch;
      const today = new Date();
      // Look for the upcoming menu with this weekday name and meal_type
      m = store.menus.find((menu) => {
        if (menu.meal_type !== mType) return false;
        const d = new Date(menu.menu_date + "T00:00:00");
        return d.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() === dayName.toLowerCase() && menu.menu_date >= today.toISOString().split("T")[0];
      }) || store.menus.find((menu) => {
        if (menu.meal_type !== mType) return false;
        const d = new Date(menu.menu_date + "T00:00:00");
        return d.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase() === dayName.toLowerCase();
      });
    }
  }

  if (!m) return null;

  const rawItems = store.menuItems.filter((item) => item.menu_id === m.id);
  const items = rawItems.map((item) => ({
    ...item,
    image_url: item.image_url || resolveDishImage(item.name, null, item.category),
  }));
  const plans = store.mealPlans.filter((p) => p.menu_id === m.id);
  const yesPlans = plans.filter((p) => p.status === "yes").length;
  const foodRecord = store.foodRecords.find((fr) => fr.menu_id === m.id) || null;
  const menuRatings = store.ratings.filter((r) => r.menu_id === m.id);
  const avgRating =
    menuRatings.length > 0
      ? parseFloat((menuRatings.reduce((sum, r) => sum + r.rating, 0) / menuRatings.length).toFixed(1))
      : 4.6;

  const userPlan = currentUserId
    ? store.mealPlans.find((p) => p.menu_id === m.id && p.student_id === currentUserId) || null
    : null;

  const userRating = currentUserId
    ? store.ratings.find((r) => r.menu_id === m.id && r.student_id === currentUserId) || null
    : null;

  const foodMeta = FOOD_IMAGES[m.meal_type] || FOOD_IMAGES.lunch;
  const primaryImg = items.length > 0 && items[0].image_url ? items[0].image_url : (m.image_url || foodMeta.url);

  return {
    ...m,
    image_url: primaryImg,
    calories: m.calories || foodMeta.calories,
    items,
    expected_attendance: yesPlans,
    food_record: foodRecord,
    avg_rating: avgRating,
    total_ratings: menuRatings.length,
    user_meal_plan: userPlan,
    user_rating: userRating,
  };
}

export function createMenuInStore(data: {
  menu_date: string;
  meal_type: MealType;
  cutoff_time: string;
  serving_start_time: string;
  serving_end_time: string;
  is_published: boolean;
  items: { name: string; description?: string; category: any; is_vegetarian: boolean }[];
}): Menu {
  const store = getStore();

  const existing = store.menus.find(
    (m) => m.menu_date === data.menu_date && m.meal_type === data.meal_type
  );
  if (existing) {
    throw new Error(`A menu for ${data.menu_date} (${data.meal_type}) already exists.`);
  }

  const menuId = `menu-${data.menu_date}-${data.meal_type}-${Date.now()}`;
  const foodMeta = FOOD_IMAGES[data.meal_type] || FOOD_IMAGES.lunch;
  const primaryImg = data.items.length > 0 ? resolveDishImage(data.items[0].name, (data.items[0] as any).image_url, data.items[0].category) : foodMeta.url;

  const newMenu: Menu = {
    id: menuId,
    menu_date: data.menu_date,
    meal_type: data.meal_type,
    cutoff_time: data.cutoff_time,
    serving_start_time: data.serving_start_time,
    serving_end_time: data.serving_end_time,
    is_published: data.is_published,
    image_url: primaryImg,
    calories: foodMeta.calories,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  store.menus.push(newMenu);

  data.items.forEach((item, idx) => {
    store.menuItems.push({
      id: `item-${menuId}-${idx}`,
      menu_id: menuId,
      name: item.name,
      description: item.description,
      category: item.category,
      is_vegetarian: item.is_vegetarian,
      image_url: resolveDishImage(item.name, (item as any).image_url, item.category),
      created_at: new Date().toISOString(),
    });
  });

  // Fan-out notifications
  const students = store.profiles.filter((p) => p.role === "student");
  students.forEach((s) => {
    store.notifications.unshift({
      id: `notif-${menuId}-${s.id}`,
      user_id: s.id,
      title: "New Menu Published",
      message: `Menu for ${data.menu_date} (${data.meal_type.toUpperCase()}) is now active. Cutoff at ${data.cutoff_time}.`,
      type: "menu_update",
      is_read: false,
      reference_id: menuId,
      created_at: new Date().toISOString(),
    });
  });

  return newMenu;
}

export function updateMenuInStore(
  menuId: string,
  data: {
    cutoff_time: string;
    serving_start_time: string;
    serving_end_time: string;
    is_published: boolean;
    items: { name: string; description?: string; category: any; is_vegetarian: boolean }[];
  }
): Menu {
  const store = getStore();
  const idx = store.menus.findIndex((m) => m.id === menuId);
  if (idx === -1) throw new Error("Menu not found");

  store.menus[idx] = {
    ...store.menus[idx],
    cutoff_time: data.cutoff_time,
    serving_start_time: data.serving_start_time,
    serving_end_time: data.serving_end_time,
    is_published: data.is_published,
    updated_at: new Date().toISOString(),
  };

  store.menuItems = store.menuItems.filter((item) => item.menu_id !== menuId);
  data.items.forEach((item, i) => {
    store.menuItems.push({
      id: `item-${menuId}-${i}-${Date.now()}`,
      menu_id: menuId,
      name: item.name,
      description: item.description,
      category: item.category,
      is_vegetarian: item.is_vegetarian,
      image_url: resolveDishImage(item.name, (item as any).image_url, item.category),
      created_at: new Date().toISOString(),
    });
  });

  return store.menus[idx];
}

export function deleteMenuFromStore(menuId: string): void {
  const store = getStore();
  store.menus = store.menus.filter((m) => m.id !== menuId);
  store.menuItems = store.menuItems.filter((i) => i.menu_id !== menuId);
  store.mealPlans = store.mealPlans.filter((p) => p.menu_id !== menuId);
  store.foodRecords = store.foodRecords.filter((r) => r.menu_id !== menuId);
  store.ratings = store.ratings.filter((r) => r.menu_id !== menuId);
}

export function saveMealPlanInStore(studentId: string, menuId: string, status: "yes" | "no"): MealPlan {
  const store = getStore();
  const existingIndex = store.mealPlans.findIndex(
    (p) => p.student_id === studentId && p.menu_id === menuId
  );

  const now = new Date().toISOString();

  // Log activity
  store.activities.unshift({
    id: `act-${Date.now()}`,
    student_id: studentId,
    title: status === "yes" ? "Meal marked as Attending for today" : "Meal marked as Skipped",
    timestamp: "Just now",
    type: "meal",
  });

  if (existingIndex >= 0) {
    store.mealPlans[existingIndex] = {
      ...store.mealPlans[existingIndex],
      status,
      updated_at: now,
    };
    return store.mealPlans[existingIndex];
  } else {
    const newPlan: MealPlan = {
      id: `mp-${menuId}-${studentId}`,
      student_id: studentId,
      menu_id: menuId,
      status,
      submitted_at: now,
      updated_at: now,
    };
    store.mealPlans.push(newPlan);
    return newPlan;
  }
}

export function saveFoodRecordInStore(data: {
  menu_id: string;
  prepared_qty: number;
  leftover_qty: number;
  unit: "kg" | "portions";
  actual_attendance?: number;
}): FoodRecord {
  const store = getStore();

  if (data.leftover_qty > data.prepared_qty) {
    throw new Error("Leftover quantity cannot exceed prepared quantity");
  }

  const wastagePercentage =
    data.prepared_qty > 0
      ? parseFloat(((data.leftover_qty / data.prepared_qty) * 100).toFixed(2))
      : 0;

  const existingIndex = store.foodRecords.findIndex((r) => r.menu_id === data.menu_id);
  const now = new Date().toISOString();

  const record: FoodRecord = {
    id: existingIndex >= 0 ? store.foodRecords[existingIndex].id : `fr-${data.menu_id}`,
    menu_id: data.menu_id,
    prepared_qty: data.prepared_qty,
    leftover_qty: data.leftover_qty,
    unit: data.unit,
    actual_attendance: data.actual_attendance ?? null,
    wastage_percentage: wastagePercentage,
    recorded_at: now,
    updated_at: now,
  };

  if (existingIndex >= 0) {
    store.foodRecords[existingIndex] = record;
  } else {
    store.foodRecords.push(record);
  }

  return record;
}

export function saveRatingInStore(data: {
  student_id: string;
  menu_id: string;
  rating: number;
  comment?: string | null;
  meal_type?: MealType;
}): Rating {
  const store = getStore();

  const existing = store.ratings.find(
    (r) => r.student_id === data.student_id && r.menu_id === data.menu_id
  );

  if (existing) {
    throw new Error("You have already submitted a rating for this meal.");
  }

  const newRating: Rating = {
    id: `rat-${data.menu_id}-${data.student_id}`,
    student_id: data.student_id,
    menu_id: data.menu_id,
    rating: data.rating,
    comment: data.comment || null,
    meal_type: data.meal_type || "lunch",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  store.ratings.push(newRating);

  // Add activity
  store.activities.unshift({
    id: `act-${Date.now()}`,
    student_id: data.student_id,
    title: `Submitted ${data.rating}★ meal rating`,
    timestamp: "Just now",
    type: "feedback",
  });

  return newRating;
}

// ----------------- Complaints API -----------------
export function getComplaintsFromStore(studentId?: string): Complaint[] {
  const store = getStore();
  if (studentId) {
    return store.complaints.filter((c) => c.student_id === studentId);
  }
  return store.complaints;
}

export function saveComplaintInStore(data: {
  student_id: string;
  category: any;
  title: string;
  description: string;
  urgency?: "Normal" | "High" | "Urgent";
}): Complaint {
  const store = getStore();
  const student = store.profiles.find((p) => p.id === data.student_id);

  const newComplaint: Complaint = {
    id: `C-${100 + store.complaints.length + 1}`,
    student_id: data.student_id,
    student_name: student?.full_name || "Student",
    category: data.category,
    title: data.title,
    description: data.description,
    status: "Pending",
    urgency: data.urgency || "Normal",
    created_at: new Date().toISOString(),
  };

  store.complaints.unshift(newComplaint);

  store.activities.unshift({
    id: `act-${Date.now()}`,
    student_id: data.student_id,
    title: `Raised Complaint #${newComplaint.id} (${newComplaint.category})`,
    timestamp: "Just now",
    type: "complaint",
  });

  return newComplaint;
}

// ----------------- Wallet & Payments API -----------------
export function getWalletDataForStudent(studentId: string) {
  const store = getStore();
  const student = store.profiles.find((p) => p.id === studentId);
  const studentTx = store.transactions.filter((tx) => tx.student_id === studentId);

  return {
    balance: student?.wallet_balance ?? 450,
    transactions: studentTx,
  };
}

export function topUpWalletInStore(studentId: string, amount: number): number {
  const store = getStore();
  const student = store.profiles.find((p) => p.id === studentId);
  if (!student) throw new Error("Student not found");

  student.wallet_balance += amount;

  const newTx: WalletTransaction = {
    id: `tx-${Date.now()}`,
    student_id: studentId,
    amount,
    type: "topup",
    description: "Instant Wallet Recharge (UPI/Card)",
    status: "Success",
    created_at: new Date().toISOString(),
  };

  store.transactions.unshift(newTx);

  store.activities.unshift({
    id: `act-${Date.now()}`,
    student_id: studentId,
    title: `Wallet recharged with ₹${amount}`,
    timestamp: "Just now",
    type: "wallet",
  });

  return student.wallet_balance;
}

// ----------------- Activity API -----------------
export function getRecentActivities(): ActivityItem[] {
  return getStore().activities.slice(0, 5);
}

// ----------------- Weekly Attendance Chart API (Mon-Sun) -----------------
export function getWeeklyAttendanceChartData(range: "This Week" | "Last Week" | "This Month" = "This Week") {
  // Return standard Mon-Sun data with yellow bar chart
  const days = [
    { day: "Mon", attendance: 85, isToday: false },
    { day: "Tue", attendance: 92, isToday: false },
    { day: "Wed", attendance: 88, isToday: true }, // Current day highlighted
    { day: "Thu", attendance: 78, isToday: false },
    { day: "Fri", attendance: 90, isToday: false },
    { day: "Sat", attendance: 65, isToday: false },
    { day: "Sun", attendance: 70, isToday: false },
  ];

  if (range === "Last Week") {
    return days.map((d) => ({ ...d, attendance: Math.round(d.attendance * 0.95), isToday: false }));
  }

  return days;
}

// Notifications API
export function getNotificationsForUser(userId: string): Notification[] {
  const store = getStore();
  return store.notifications.filter((n) => n.user_id === userId);
}

export function markNotificationReadInStore(notificationId: string): void {
  const store = getStore();
  const notif = store.notifications.find((n) => n.id === notificationId);
  if (notif) notif.is_read = true;
}

export function markAllNotificationsReadInStore(userId: string): void {
  const store = getStore();
  store.notifications.forEach((n) => {
    if (n.user_id === userId) n.is_read = true;
  });
}

// Groceries API
export function getGroceriesFromStore(): GroceryItem[] {
  return getStore().groceries;
}

export function updateGroceryStockInStore(id: string, newStock: number): GroceryItem {
  const store = getStore();
  const item = store.groceries.find((g) => g.id === id);
  if (!item) throw new Error("Grocery item not found");
  item.current_stock = Math.max(0, newStock);
  item.updated_at = new Date().toISOString();
  return item;
}

export function addGroceryItemInStore(data: {
  name: string;
  category: any;
  current_stock: number;
  min_threshold: number;
  unit: string;
}): GroceryItem {
  const store = getStore();
  const newItem: GroceryItem = {
    id: `g-${Date.now()}`,
    name: data.name,
    category: data.category,
    current_stock: data.current_stock,
    min_threshold: data.min_threshold,
    unit: data.unit,
    updated_at: new Date().toISOString(),
  };
  store.groceries.push(newItem);
  return newItem;
}

export function deleteGroceryItemInStore(id: string): void {
  const store = getStore();
  store.groceries = store.groceries.filter((g) => g.id !== id);
}

export function getRecipesWithStockMatching(): any[] {
  const store = getStore();
  const recipesFormatted = store.recipes.map((r) => {
    const ingredients = (r.ingredients || []).map((ing) => {
      const gItem = store.groceries.find((g) => g.id === ing.grocery_item_id);
      return {
        grocery_item_id: ing.grocery_item_id,
        ingredient_name: gItem ? gItem.name : "Ingredient",
        quantity_per_serving: ing.quantity_per_serving,
        unit: ing.unit,
      };
    });

    return {
      id: r.id,
      name: r.name,
      description: r.description,
      instructions: r.instructions,
      default_servings: r.default_servings,
      ingredients,
    };
  });

  return matchRecipesAgainstStock(recipesFormatted, store.groceries);
}

export function getReportAnalytics(timeRange: "week" | "month" = "week") {
  const store = getStore();
  const daysLimit = timeRange === "week" ? 7 : 30;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysLimit);
  const cutoffStr = cutoffDate.toISOString().split("T")[0];

  const relevantMenus = store.menus.filter((m) => m.menu_date >= cutoffStr && m.menu_date <= new Date().toISOString().split("T")[0]);
  const menuIds = new Set(relevantMenus.map((m) => m.id));

  const records = store.foodRecords.filter((fr) => menuIds.has(fr.menu_id));
  const ratings = store.ratings.filter((r) => menuIds.has(r.menu_id));

  const totalPrepared = records.reduce((sum, r) => sum + r.prepared_qty, 0);
  const totalLeftover = records.reduce((sum, r) => sum + r.leftover_qty, 0);
  const avgWastage = totalPrepared > 0 ? parseFloat(((totalLeftover / totalPrepared) * 100).toFixed(1)) : 0;
  const avgRating = ratings.length > 0 ? parseFloat((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)) : 4.6;
  const totalAttendance = records.reduce((sum, r) => sum + (r.actual_attendance || 0), 0);

  const dateMap = new Map<string, { date: string; prepared: number; leftover: number; wastage: number; attendance: number }>();

  relevantMenus.forEach((m) => {
    const record = records.find((r) => r.menu_id === m.id);
    if (!dateMap.has(m.menu_date)) {
      dateMap.set(m.menu_date, {
        date: m.menu_date,
        prepared: 0,
        leftover: 0,
        wastage: 0,
        attendance: 0,
      });
    }
    const cur = dateMap.get(m.menu_date)!;
    if (record) {
      cur.prepared += record.prepared_qty;
      cur.leftover += record.leftover_qty;
      cur.attendance += record.actual_attendance || 0;
    }
  });

  const dailyTrends = Array.from(dateMap.values())
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((d) => ({
      ...d,
      wastage: d.prepared > 0 ? parseFloat(((d.leftover / d.prepared) * 100).toFixed(1)) : 0,
      formattedDate: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));

  return {
    timeRange,
    totalPrepared: parseFloat(totalPrepared.toFixed(1)),
    totalLeftover: parseFloat(totalLeftover.toFixed(1)),
    avgWastage,
    avgRating,
    totalAttendance,
    totalMealsServed: records.length,
    dailyTrends,
  };
}

export function getAIRecommendationsForMess() {
  const store = getStore();
  const recentMenus = store.menus.filter((m) => m.food_record || store.foodRecords.some((fr) => fr.menu_id === m.id));

  const analysisData = recentMenus.map((m) => {
    const foodRecord = store.foodRecords.find((fr) => fr.menu_id === m.id);
    const items = store.menuItems.filter((i) => i.menu_id === m.id);
    const mealPlans = store.mealPlans.filter((p) => p.menu_id === m.id);
    const menuRatings = store.ratings.filter((r) => r.menu_id === m.id);

    const yesCount = mealPlans.filter((p) => p.status === "yes").length;
    const noCount = mealPlans.filter((p) => p.status === "no").length;
    const avgRating = menuRatings.length > 0 ? menuRatings.reduce((s, r) => s + r.rating, 0) / menuRatings.length : 4.6;

    const weekday = new Date(m.menu_date).toLocaleDateString("en-US", { weekday: "long" });

    return {
      menu_id: m.id,
      dish_names: items.map((i) => i.name),
      weekday,
      meal_type: m.meal_type,
      prepared_qty: foodRecord ? foodRecord.prepared_qty : 0,
      leftover_qty: foodRecord ? foodRecord.leftover_qty : 0,
      wastage_percentage: foodRecord ? foodRecord.wastage_percentage : 0,
      avg_rating: avgRating,
      opt_in_yes_count: yesCount,
      opt_in_no_count: noCount,
    };
  });

  return evaluateMessRecommendations(analysisData);
}

export function getDemandPredictionForMenu(menuId: string) {
  const store = getStore();
  const menu = store.menus.find((m) => m.id === menuId);
  if (!menu) throw new Error("Menu not found");

  const plans = store.mealPlans.filter((p) => p.menu_id === menuId);
  const plannedYes = plans.filter((p) => p.status === "yes").length;

  const targetDate = new Date(menu.menu_date);
  const targetDayOfWeek = targetDate.getDay();

  const pastMatchingMenus = store.menus
    .filter((m) => {
      if (m.id === menuId) return false;
      if (m.meal_type !== menu.meal_type) return false;
      const d = new Date(m.menu_date);
      return d.getDay() === targetDayOfWeek && d < targetDate;
    })
    .sort((a, b) => b.menu_date.localeCompare(a.menu_date));

  const history = pastMatchingMenus
    .map((m) => {
      const record = store.foodRecords.find((fr) => fr.menu_id === m.id);
      const mPlans = store.mealPlans.filter((p) => p.menu_id === m.id);
      const mYes = mPlans.filter((p) => p.status === "yes").length;

      if (!record) return null;
      return {
        planned_count: mYes,
        actual_attendance: record.actual_attendance || mYes,
        prepared_qty: record.prepared_qty,
        wastage_percentage: record.wastage_percentage,
        date: m.menu_date,
      };
    })
    .filter((h): h is NonNullable<typeof h> => h !== null);

  return calculateDemandPrediction(plannedYes, history, "kg");
}
