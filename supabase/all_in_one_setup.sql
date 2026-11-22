-- ========================================================
-- MealSync - Comprehensive Supabase Database Setup
-- Generated for single-step execution in Supabase SQL Editor
-- Tables, Constraints, RLS Security, Triggers & Seed Data
-- ========================================================

-- >>>>>>>>>>>>>>> START OF 001_initial_schema.sql <<<<<<<<<<<<<<<

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


-- >>>>>>>>>>>>>>> END OF 001_initial_schema.sql <<<<<<<<<<<<<<<

-- >>>>>>>>>>>>>>> START OF 002_rls_policies.sql <<<<<<<<<<<<<<<

-- 002_rls_policies.sql: Row Level Security Configuration

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grocery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if caller is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PROFILES POLICIES
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Users can update their own profile fields" ON public.profiles;
CREATE POLICY "Users can update their own profile fields"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- 2. MENUS POLICIES
DROP POLICY IF EXISTS "Anyone can view published menus" ON public.menus;
CREATE POLICY "Anyone can view published menus"
ON public.menus FOR SELECT TO anon, authenticated
USING (is_published = true OR public.is_admin());

DROP POLICY IF EXISTS "Admins have full control over menus" ON public.menus;
CREATE POLICY "Admins have full control over menus"
ON public.menus FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. MENU ITEMS POLICIES
DROP POLICY IF EXISTS "Anyone can view menu items of visible menus" ON public.menu_items;
CREATE POLICY "Anyone can view menu items of visible menus"
ON public.menu_items FOR SELECT TO anon, authenticated
USING (
    EXISTS (SELECT 1 FROM public.menus WHERE menus.id = menu_items.menu_id AND (menus.is_published = true OR public.is_admin()))
);

DROP POLICY IF EXISTS "Admins have full control over menu items" ON public.menu_items;
CREATE POLICY "Admins have full control over menu items"
ON public.menu_items FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 4. MEAL PLANS POLICIES
DROP POLICY IF EXISTS "Students view their own meal plans" ON public.meal_plans;
CREATE POLICY "Students view their own meal plans"
ON public.meal_plans FOR SELECT TO authenticated
USING (auth.uid() = student_id OR public.is_admin());

DROP POLICY IF EXISTS "Students insert their own meal plans" ON public.meal_plans;
CREATE POLICY "Students insert their own meal plans"
ON public.meal_plans FOR INSERT TO authenticated
WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students update their own meal plans" ON public.meal_plans;
CREATE POLICY "Students update their own meal plans"
ON public.meal_plans FOR UPDATE TO authenticated
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

-- 5. FOOD RECORDS POLICIES
DROP POLICY IF EXISTS "Everyone can view food records" ON public.food_records;
CREATE POLICY "Everyone can view food records"
ON public.food_records FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins manage food records" ON public.food_records;
CREATE POLICY "Admins manage food records"
ON public.food_records FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6. RATINGS POLICIES
DROP POLICY IF EXISTS "Ratings are viewable by all authenticated users" ON public.ratings;
CREATE POLICY "Ratings are viewable by all authenticated users"
ON public.ratings FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Students insert their own ratings" ON public.ratings;
CREATE POLICY "Students insert their own ratings"
ON public.ratings FOR INSERT TO authenticated
WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students update their own ratings" ON public.ratings;
CREATE POLICY "Students update their own ratings"
ON public.ratings FOR UPDATE TO authenticated
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

-- 7. NOTIFICATIONS POLICIES
DROP POLICY IF EXISTS "Users view their own notifications" ON public.notifications;
CREATE POLICY "Users view their own notifications"
ON public.notifications FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update read status of own notifications" ON public.notifications;
CREATE POLICY "Users update read status of own notifications"
ON public.notifications FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 8. DEMAND PREDICTIONS POLICIES
DROP POLICY IF EXISTS "Admins view and manage demand predictions" ON public.demand_predictions;
CREATE POLICY "Admins view and manage demand predictions"
ON public.demand_predictions FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 9. RECOMMENDATIONS POLICIES
DROP POLICY IF EXISTS "Admins view and manage recommendations" ON public.recommendations;
CREATE POLICY "Admins view and manage recommendations"
ON public.recommendations FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 10. GROCERY ITEMS POLICIES
DROP POLICY IF EXISTS "Admins manage grocery items" ON public.grocery_items;
CREATE POLICY "Admins manage grocery items"
ON public.grocery_items FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 11. RECIPES POLICIES
DROP POLICY IF EXISTS "Admins manage recipes" ON public.recipes;
CREATE POLICY "Admins manage recipes"
ON public.recipes FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 12. RECIPE INGREDIENTS POLICIES
DROP POLICY IF EXISTS "Admins manage recipe ingredients" ON public.recipe_ingredients;
CREATE POLICY "Admins manage recipe ingredients"
ON public.recipe_ingredients FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 13. COMPLAINTS POLICIES
DROP POLICY IF EXISTS "Students view their own complaints or admins view all" ON public.complaints;
CREATE POLICY "Students view their own complaints or admins view all"
ON public.complaints FOR SELECT TO authenticated
USING (auth.uid() = student_id OR public.is_admin());

DROP POLICY IF EXISTS "Students insert their own complaints" ON public.complaints;
CREATE POLICY "Students insert their own complaints"
ON public.complaints FOR INSERT TO authenticated
WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Admins can update complaints" ON public.complaints;
CREATE POLICY "Admins can update complaints"
ON public.complaints FOR UPDATE TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 14. WALLET TRANSACTIONS POLICIES
DROP POLICY IF EXISTS "Students view their own transactions or admins view all" ON public.wallet_transactions;
CREATE POLICY "Students view their own transactions or admins view all"
ON public.wallet_transactions FOR SELECT TO authenticated
USING (auth.uid() = student_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can record their own wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Users can record their own wallet transactions"
ON public.wallet_transactions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = student_id OR public.is_admin());

-- 15. ACTIVITY LOGS POLICIES
DROP POLICY IF EXISTS "Users can view activities" ON public.activity_logs;
CREATE POLICY "Users can view activities"
ON public.activity_logs FOR SELECT TO authenticated
USING (auth.uid() = student_id OR student_id IS NULL OR public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can create activities" ON public.activity_logs;
CREATE POLICY "Authenticated users can create activities"
ON public.activity_logs FOR INSERT TO authenticated
WITH CHECK (true);


-- >>>>>>>>>>>>>>> END OF 002_rls_policies.sql <<<<<<<<<<<<<<<

-- >>>>>>>>>>>>>>> START OF 003_triggers_and_functions.sql <<<<<<<<<<<<<<<

-- 003_triggers_and_functions.sql: Automated Triggers and Notification Functions

-- 1. Updated At Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to mutable tables
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_menus_updated_at ON public.menus;
CREATE TRIGGER set_menus_updated_at BEFORE UPDATE ON public.menus FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_meal_plans_updated_at ON public.meal_plans;
CREATE TRIGGER set_meal_plans_updated_at BEFORE UPDATE ON public.meal_plans FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_food_records_updated_at ON public.food_records;
CREATE TRIGGER set_food_records_updated_at BEFORE UPDATE ON public.food_records FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_ratings_updated_at ON public.ratings;
CREATE TRIGGER set_ratings_updated_at BEFORE UPDATE ON public.ratings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_grocery_items_updated_at ON public.grocery_items;
CREATE TRIGGER set_grocery_items_updated_at BEFORE UPDATE ON public.grocery_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 2. New User Profile Auto-Creation Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        roll_number,
        hostel_block,
        room_number,
        role
    ) VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student User'),
        COALESCE(NEW.raw_user_meta_data->>'roll_number', NULL),
        COALESCE(NEW.raw_user_meta_data->>'hostel_block', NULL),
        COALESCE(NEW.raw_user_meta_data->>'room_number', NULL),
        -- Force student role for any public registration
        'student'
    ) ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Automated Menu Change Notification Fan-out
CREATE OR REPLACE FUNCTION public.notify_students_on_menu_change()
RETURNS TRIGGER AS $$
DECLARE
    v_title TEXT;
    v_message TEXT;
BEGIN
    IF (TG_OP = 'INSERT') THEN
        v_title := 'New Menu Published';
        v_message := 'Menu for ' || to_char(NEW.menu_date, 'Dy, Mon DD') || ' (' || initcap(NEW.meal_type) || ') is now available.';
    ELSIF (TG_OP = 'UPDATE') THEN
        v_title := 'Menu Updated';
        v_message := 'Dishes for ' || to_char(NEW.menu_date, 'Dy, Mon DD') || ' (' || initcap(NEW.meal_type) || ') have been updated.';
    END IF;

    -- Batch insert notifications for all registered students
    INSERT INTO public.notifications (user_id, title, message, type, reference_id)
    SELECT id, v_title, v_message, 'menu_update', NEW.id
    FROM public.profiles
    WHERE role = 'student';

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_menu_notification ON public.menus;
CREATE TRIGGER trg_menu_notification
AFTER INSERT OR UPDATE ON public.menus
FOR EACH ROW
WHEN (NEW.is_published = true)
EXECUTE FUNCTION public.notify_students_on_menu_change();


-- >>>>>>>>>>>>>>> END OF 003_triggers_and_functions.sql <<<<<<<<<<<<<<<

-- >>>>>>>>>>>>>>> START OF 004_email_verifications.sql <<<<<<<<<<<<<<<

-- 004_email_verifications.sql: Email OTP Verification for MSRUAS Registration

CREATE TABLE IF NOT EXISTS public.email_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT false,
    attempts INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for fast lookup by email and active status
CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON public.email_verifications (email, verified, expires_at DESC);

-- Enable Row Level Security
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

-- Admins and Service Role have full access; students cannot query OTP table directly
DROP POLICY IF EXISTS "Service role manages email verifications" ON public.email_verifications;
CREATE POLICY "Service role manages email verifications"
ON public.email_verifications FOR ALL TO authenticated
USING (public.is_admin()) WITH CHECK (public.is_admin());


-- >>>>>>>>>>>>>>> END OF 004_email_verifications.sql <<<<<<<<<<<<<<<

-- >>>>>>>>>>>>>>> START OF seed.sql <<<<<<<<<<<<<<<

-- supabase/seed.sql: Comprehensive Realistic Demo Seed Data for Smart Mess Management System

-- 1. SEED GROCERY ITEMS (15 Realistic Kitchen Inventory Items)
INSERT INTO public.grocery_items (id, name, category, current_stock, min_threshold, unit) VALUES
('a0000001-0000-0000-0000-000000000001', 'Basmati Rice', 'grains', 180.00, 50.00, 'kg'),
('a0000001-0000-0000-0000-000000000002', 'Whole Wheat Atta', 'grains', 220.00, 60.00, 'kg'),
('a0000001-0000-0000-0000-000000000003', 'Toor Dal (Pigeon Pea)', 'pulses', 65.00, 25.00, 'kg'),
('a0000001-0000-0000-0000-000000000004', 'Rajma (Kidney Beans)', 'pulses', 40.00, 15.00, 'kg'),
('a0000001-0000-0000-0000-000000000005', 'Urad Dal Black', 'pulses', 30.00, 10.00, 'kg'),
('a0000001-0000-0000-0000-000000000006', 'Fresh Paneer', 'dairy', 25.00, 10.00, 'kg'),
('a0000001-0000-0000-0000-000000000007', 'Full Cream Milk', 'dairy', 45.00, 20.00, 'liters'),
('a0000001-0000-0000-0000-000000000008', 'Desi Ghee', 'dairy', 18.00, 5.00, 'liters'),
('a0000001-0000-0000-0000-000000000009', 'Refined Sunflower Oil', 'oils', 55.00, 20.00, 'liters'),
('a0000001-0000-0000-0000-000000000010', 'Red Onions', 'vegetables', 85.00, 30.00, 'kg'),
('a0000001-0000-0000-0000-000000000011', 'Potatoes (Aloo)', 'vegetables', 110.00, 40.00, 'kg'),
('a0000001-0000-0000-0000-000000000012', 'Fresh Tomatoes', 'vegetables', 45.00, 20.00, 'kg'),
('a0000001-0000-0000-0000-000000000013', 'Garam Masala & Turmeric Blend', 'spices', 12.00, 3.00, 'kg'),
('a0000001-0000-0000-0000-000000000014', 'Refined Sugar', 'other', 35.00, 15.00, 'kg'),
('a0000001-0000-0000-0000-000000000015', 'Flattened Rice (Poha)', 'grains', 28.00, 10.00, 'kg')
ON CONFLICT (id) DO UPDATE SET current_stock = EXCLUDED.current_stock;

-- 2. SEED RECIPES (8 Standard Hostel Recipes)
INSERT INTO public.recipes (id, name, description, instructions, default_servings) VALUES
('b0000001-0000-0000-0000-000000000001', 'Paneer Butter Masala', 'Rich cottage cheese cubes in mildly spiced velvety tomato gravy', '1. Sauté onions and pureed tomatoes. 2. Blend spices and simmer with butter/cream. 3. Add fresh paneer cubes and garnish with kasuri methi.', 100),
('b0000001-0000-0000-0000-000000000002', 'Punjabi Rajma Masala', 'Slow-cooked kidney beans in traditional spiced onion-tomato gravy', '1. Soak rajma overnight. 2. Pressure cook until tender. 3. Temper with cumin, ginger, garlic, tomatoes and garam masala.', 100),
('b0000001-0000-0000-0000-000000000003', 'Dal Makhani', 'Rich black lentils and kidney beans simmered overnight with butter', '1. Boil urad dal and rajma with salt. 2. Add ginger-garlic paste and tomato puree. 3. Simmer on slow heat with butter and cream.', 100),
('b0000001-0000-0000-0000-000000000004', 'Steamed Jeera Basmati Rice', 'Fragrant basmati rice tempered with roasted cumin seeds and ghee', '1. Rinse basmati rice. 2. Splutter jeera in hot ghee. 3. Steam rice until fluffy.', 100),
('b0000001-0000-0000-0000-000000000005', 'Tawa Whole Wheat Roti', 'Soft unleavened flatbreads made from fresh whole wheat flour', '1. Knead atta dough with warm water. 2. Roll into thin discs. 3. Cook on high heat tawa with light ghee brushing.', 100),
('b0000001-0000-0000-0000-000000000006', 'Kanda Batata Poha', 'Maharashtrian tempered flattened rice with onions, potatoes and peanuts', '1. Rinse poha lightly. 2. Sauté mustard seeds, curry leaves, diced potatoes and onions. 3. Mix poha with turmeric, lemon and coriander.', 100),
('b0000001-0000-0000-0000-000000000007', 'Aloo Gobhi Dry Masala', 'Spiced potatoes and cauliflower florets with cumin and ginger', '1. Sauté cumin seeds, ginger, and green chilies. 2. Add diced potatoes and florets with turmeric. 3. Cook covered until tender.', 100),
('b0000001-0000-0000-0000-000000000008', 'Traditional Rice Kheer', 'Cardamom-infused creamy rice pudding slow-simmered with full cream milk', '1. Boil basmati rice in milk. 2. Reduce milk to thick consistency. 3. Add sugar, crushed cardamom and roasted nuts.', 100)
ON CONFLICT (id) DO NOTHING;

-- 3. SEED RECIPE INGREDIENTS
INSERT INTO public.recipe_ingredients (recipe_id, grocery_item_id, quantity_per_serving, unit) VALUES
-- Paneer Butter Masala
('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000006', 0.1200, 'kg'), -- Paneer
('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000012', 0.0800, 'kg'), -- Tomatoes
('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000010', 0.0500, 'kg'), -- Onions
('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000008', 0.0150, 'liters'), -- Ghee
('b0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000013', 0.0050, 'kg'), -- Spices
-- Punjabi Rajma Masala
('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000004', 0.0800, 'kg'), -- Rajma
('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000010', 0.0500, 'kg'), -- Onions
('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000012', 0.0600, 'kg'), -- Tomatoes
('b0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000009', 0.0100, 'liters'), -- Oil
-- Kanda Batata Poha
('b0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000015', 0.0800, 'kg'), -- Poha
('b0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000010', 0.0300, 'kg'), -- Onions
('b0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000011', 0.0400, 'kg'), -- Potatoes
('b0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000009', 0.0100, 'liters'), -- Oil
-- Traditional Kheer
('b0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000001', 0.0300, 'kg'), -- Rice
('b0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000007', 0.1500, 'liters'), -- Milk
('b0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000014', 0.0250, 'kg')  -- Sugar
ON CONFLICT (recipe_id, grocery_item_id) DO NOTHING;


-- >>>>>>>>>>>>>>> END OF seed.sql <<<<<<<<<<<<<<<

