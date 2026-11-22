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
