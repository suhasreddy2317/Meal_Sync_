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
