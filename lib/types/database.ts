// lib/types/database.ts: Supabase & MealSync Unified Database Interface Definitions

export type UserRole = "student" | "admin";
export type MealType = "breakfast" | "lunch" | "snacks" | "dinner";
export type MealPlanStatus = "yes" | "no";
export type FoodUnit = "kg" | "portions";
export type ItemCategory = "main" | "bread" | "rice" | "dessert" | "beverage" | "side" | "snack";
export type GroceryCategory = "grains" | "pulses" | "vegetables" | "spices" | "dairy" | "oils" | "other";
export type NotificationType = "menu_update" | "cutoff_alert" | "announcement" | "system" | "payment" | "complaint";
export type RecommendationType = "reduce_prep" | "replace_dish" | "day_anomaly" | "high_performer" | "small_batch";
export type PriorityLevel = "low" | "medium" | "high" | "critical";
export type ComplaintStatus = "Pending" | "In Progress" | "Resolved";
export type ComplaintCategory = "Food Quality" | "Hygiene" | "Food Quantity" | "Late Serving" | "Menu Issues" | "Other";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  roll_number?: string | null;
  department?: string | null;
  hostel_block?: string | null;
  room_number?: string | null;
  mess_allocation?: string | null;
  phone?: string | null;
  role: UserRole;
  wallet_balance: number;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Menu {
  id: string;
  menu_date: string; // YYYY-MM-DD
  meal_type: MealType;
  cutoff_time: string; // HH:MM:SS
  serving_start_time: string; // HH:MM:SS
  serving_end_time: string; // HH:MM:SS
  is_published: boolean;
  image_url?: string;
  special_badge?: string;
  calories?: number;
  created_at: string;
  updated_at: string;
  items?: MenuItem[];
  food_record?: FoodRecord | null;
  demand_prediction?: DemandPrediction | null;
  expected_attendance?: number;
  user_meal_plan?: MealPlan | null;
  user_rating?: Rating | null;
  avg_rating?: number;
  total_ratings?: number;
}

export interface MenuItem {
  id: string;
  menu_id: string;
  name: string;
  description?: string | null;
  category: ItemCategory;
  is_vegetarian: boolean;
  image_url?: string | null;
  created_at: string;
}

export interface MealPlan {
  id: string;
  student_id: string;
  menu_id: string;
  status: MealPlanStatus;
  submitted_at: string;
  updated_at: string;
  student?: Profile;
}

export interface FoodRecord {
  id: string;
  menu_id: string;
  prepared_qty: number;
  leftover_qty: number;
  unit: FoodUnit;
  actual_attendance?: number | null;
  wastage_percentage: number;
  recorded_at: string;
  updated_at: string;
}

export interface Rating {
  id: string;
  student_id: string;
  menu_id: string;
  rating: number; // 1 - 5
  comment?: string | null;
  meal_type?: MealType;
  created_at: string;
  updated_at: string;
  student?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  reference_id?: string | null;
  created_at: string;
}

export interface DemandPrediction {
  id: string;
  menu_id: string;
  planned_count: number;
  adjusted_planned_count: number;
  model_prediction: number;
  final_predicted_count: number;
  recommended_prep_qty: number;
  unit: FoodUnit;
  rationale: string;
  generated_at: string;
}

export interface Recommendation {
  id: string;
  recommendation_type: RecommendationType;
  title: string;
  message: string;
  related_menu_id?: string | null;
  related_dish_name?: string | null;
  priority: PriorityLevel;
  is_dismissed: boolean;
  created_at: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  category: GroceryCategory;
  current_stock: number;
  min_threshold: number;
  unit: string;
  updated_at: string;
}

export interface Recipe {
  id: string;
  name: string;
  description?: string | null;
  instructions: string;
  default_servings: number;
  created_at: string;
  ingredients?: RecipeIngredient[];
  match_score?: number;
  available_ingredients?: string[];
  missing_ingredients?: string[];
}

export interface RecipeIngredient {
  id: string;
  recipe_id: string;
  grocery_item_id: string;
  quantity_per_serving: number;
  unit: string;
  grocery_item?: GroceryItem;
}

export interface Complaint {
  id: string;
  student_id: string;
  student_name: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  status: ComplaintStatus;
  urgency: "Normal" | "High" | "Urgent";
  created_at: string;
  resolved_at?: string;
  admin_remarks?: string;
}

export interface WalletTransaction {
  id: string;
  student_id: string;
  amount: number;
  type: "topup" | "meal_deduction" | "refund";
  description: string;
  status: "Success" | "Pending" | "Failed";
  created_at: string;
}

export interface ActivityItem {
  id: string;
  student_id?: string;
  title: string;
  timestamp: string;
  type: "meal" | "wallet" | "menu" | "complaint" | "feedback";
}
