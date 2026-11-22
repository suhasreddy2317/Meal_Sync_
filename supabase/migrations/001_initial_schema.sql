-- 001_initial_schema.sql: Smart Mess Management System Core DDL Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    roll_number TEXT UNIQUE,
    hostel_block TEXT,
    room_number TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    wallet_balance NUMERIC(10,2) NOT NULL DEFAULT 450.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. MENUS
CREATE TABLE IF NOT EXISTS public.menus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_date DATE NOT NULL,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
    cutoff_time TIME NOT NULL,
    serving_start_time TIME NOT NULL,
    serving_end_time TIME NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_menu_date_meal_type UNIQUE (menu_date, meal_type),
    CONSTRAINT chk_serving_times CHECK (serving_start_time < serving_end_time)
);

-- 3. MENU ITEMS
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_id UUID NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'main' CHECK (category IN ('main', 'bread', 'rice', 'dessert', 'beverage', 'side')),
    is_vegetarian BOOLEAN NOT NULL DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. MEAL PLANS
CREATE TABLE IF NOT EXISTS public.meal_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    menu_id UUID NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('yes', 'no')),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_student_menu_meal_plan UNIQUE (student_id, menu_id)
);

-- 5. FOOD RECORDS
CREATE TABLE IF NOT EXISTS public.food_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_id UUID NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
    prepared_qty NUMERIC(10,2) NOT NULL CHECK (prepared_qty >= 0),
    leftover_qty NUMERIC(10,2) NOT NULL CHECK (leftover_qty >= 0),
    unit TEXT NOT NULL CHECK (unit IN ('kg', 'portions')),
    actual_attendance INTEGER CHECK (actual_attendance >= 0),
    wastage_percentage NUMERIC(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN prepared_qty > 0 THEN ROUND(((leftover_qty / prepared_qty) * 100), 2)
            ELSE 0.00
        END
    ) STORED,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_menu_food_record UNIQUE (menu_id),
    CONSTRAINT chk_leftover_lte_prepared CHECK (leftover_qty <= prepared_qty)
);

-- 6. RATINGS
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    menu_id UUID NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_student_menu_rating UNIQUE (student_id, menu_id)
);

-- 7. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('menu_update', 'cutoff_alert', 'announcement', 'system')),
    is_read BOOLEAN NOT NULL DEFAULT false,
    reference_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. DEMAND PREDICTIONS
CREATE TABLE IF NOT EXISTS public.demand_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_id UUID NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
    planned_count INTEGER NOT NULL DEFAULT 0,
    adjusted_planned_count NUMERIC(10,2) NOT NULL,
    model_prediction NUMERIC(10,2) NOT NULL,
    final_predicted_count INTEGER NOT NULL,
    recommended_prep_qty NUMERIC(10,2) NOT NULL,
    unit TEXT NOT NULL CHECK (unit IN ('kg', 'portions')),
    rationale TEXT NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_menu_demand_prediction UNIQUE (menu_id)
);

-- 9. RECOMMENDATIONS
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recommendation_type TEXT NOT NULL CHECK (
        recommendation_type IN ('reduce_prep', 'replace_dish', 'day_anomaly', 'high_performer', 'small_batch')
    ),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_menu_id UUID REFERENCES public.menus(id) ON DELETE SET NULL,
    related_dish_name TEXT,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    is_dismissed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. GROCERY ITEMS
CREATE TABLE IF NOT EXISTS public.grocery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('grains', 'pulses', 'vegetables', 'spices', 'dairy', 'oils', 'other')),
    current_stock NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
    min_threshold NUMERIC(10,2) NOT NULL DEFAULT 10 CHECK (min_threshold >= 0),
    unit TEXT NOT NULL CHECK (unit IN ('kg', 'liters', 'packets', 'units')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. RECIPES
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    instructions TEXT NOT NULL,
    default_servings INTEGER NOT NULL DEFAULT 100 CHECK (default_servings > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. RECIPE INGREDIENTS
CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    grocery_item_id UUID NOT NULL REFERENCES public.grocery_items(id) ON DELETE RESTRICT,
    quantity_per_serving NUMERIC(8,4) NOT NULL CHECK (quantity_per_serving > 0),
    unit TEXT NOT NULL,
    CONSTRAINT uq_recipe_grocery_ingredient UNIQUE (recipe_id, grocery_item_id)
);

-- 13. COMPLAINTS
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT,
    category TEXT NOT NULL CHECK (category IN ('Food Quality', 'Hygiene', 'Food Quantity', 'Late Serving', 'Menu Issues', 'Other')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved')),
    urgency TEXT NOT NULL DEFAULT 'Normal' CHECK (urgency IN ('Normal', 'High', 'Urgent')),
    admin_remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    resolved_at TIMESTAMPTZ
);

-- 14. WALLET TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('topup', 'meal_deduction', 'refund')),
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Success' CHECK (status IN ('Success', 'Pending', 'Failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('meal', 'wallet', 'menu', 'complaint', 'feedback')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_menus_date_published ON public.menus (menu_date, is_published);
CREATE INDEX IF NOT EXISTS idx_menu_items_menu_id ON public.menu_items (menu_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_menu_status ON public.meal_plans (menu_id, status);
CREATE INDEX IF NOT EXISTS idx_meal_plans_student ON public.meal_plans (student_id);
CREATE INDEX IF NOT EXISTS idx_ratings_menu ON public.ratings (menu_id);
CREATE INDEX IF NOT EXISTS idx_ratings_student ON public.ratings (student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications (user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_food_records_menu ON public.food_records (menu_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_active ON public.recommendations (is_dismissed, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipe_ingredients_recipe ON public.recipe_ingredients (recipe_id);
CREATE INDEX IF NOT EXISTS idx_complaints_student ON public.complaints (student_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints (status);
CREATE INDEX IF NOT EXISTS idx_wallet_student ON public.wallet_transactions (student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_student ON public.activity_logs (student_id, created_at DESC);
