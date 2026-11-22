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
