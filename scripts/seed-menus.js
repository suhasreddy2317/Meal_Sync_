// scripts/seed-menus.js
// Seeds active menus and verified dishes into live Supabase PostgreSQL database
// with authentic, verified food image paths.

const { Client } = require('pg');

async function seedMenus() {
  const host = process.env.SUPABASE_DB_HOST;
  const password = process.env.SUPABASE_DB_PASSWORD;
  if (!host || !password) {
    console.error('Missing required environment variables: SUPABASE_DB_HOST and SUPABASE_DB_PASSWORD');
    process.exitCode = 1;
    return;
  }
  const client = new Client({
    host,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL database.');

    // Ensure meal_type check constraint includes 'snacks'
    await client.query(`
      ALTER TABLE public.menus DROP CONSTRAINT IF EXISTS menus_meal_type_check;
      ALTER TABLE public.menus ADD CONSTRAINT menus_meal_type_check CHECK (meal_type = ANY (ARRAY['breakfast'::text, 'lunch'::text, 'snacks'::text, 'dinner'::text]));
    `);
    console.log('✅ Updated menus_meal_type_check to include snacks.');

    // Ensure menu_items category check constraint includes 'snack'
    await client.query(`
      ALTER TABLE public.menu_items DROP CONSTRAINT IF EXISTS menu_items_category_check;
      ALTER TABLE public.menu_items ADD CONSTRAINT menu_items_category_check CHECK (category = ANY (ARRAY['main'::text, 'bread'::text, 'rice'::text, 'dessert'::text, 'beverage'::text, 'side'::text, 'snack'::text]));
      ALTER TABLE public.menus ADD COLUMN IF NOT EXISTS image_url text;
    `);
    console.log('✅ Updated menu_items_category_check and ensured menus.image_url column.');

    // Today and next 6 days (7 total days)
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().slice(0, 10));
    }

    // 28 Dishes From The Master Mess Food Chart (7 Days x 4 Meals)
    const masterDishes = {
      breakfast: [
        { name: "Idli", category: "main", image_url: "/images/dishes/idli.jpg", description: "Steamed fluffy rice-lentil cakes served with freshly ground coconut and tomato chutney.", is_vegetarian: true },
        { name: "Dosa", category: "main", image_url: "/images/dishes/dosa.jpg", description: "Golden crispy roast dosa served with hot sambar and fresh chutney.", is_vegetarian: true },
        { name: "Masala Dosa", category: "main", image_url: "/images/dishes/masala_dosa.jpg", description: "Crisp golden crepe folded over aromatic spiced potato masala.", is_vegetarian: true },
        { name: "Upma", category: "main", image_url: "/images/dishes/upma.jpg", description: "Savory semolina porridge tempered with mustard seeds, curry leaves, and veggies.", is_vegetarian: true },
        { name: "Pongal", category: "main", image_url: "/images/dishes/pongal.jpg", description: "Traditional ghee ven pongal seasoned with whole cashews, black pepper, and cumin.", is_vegetarian: true },
        { name: "Poori", category: "bread", image_url: "/images/dishes/poori.jpg", description: "Golden puffed fried breads served with mildly spiced potato sagu.", is_vegetarian: true },
        { name: "Aloo Paratha", category: "bread", image_url: "/images/dishes/aloo_paratha.jpg", description: "Wholesome wheat flatbread stuffed with spiced potatoes and topped with melting butter.", is_vegetarian: true },
      ],
      lunch: [
        { name: "Steamed Rice + Sambar", category: "rice", image_url: "/images/dishes/rice_sambar.jpg", description: "Hot steamed rice with rich lentil vegetable sambar.", is_vegetarian: true },
        { name: "Curd Rice", category: "rice", image_url: "/images/dishes/curd_rice.jpg", description: "Cool and soothing yogurt rice tempered with mustard, ginger, and curry leaves.", is_vegetarian: true },
        { name: "Vegetable Pulav", category: "rice", image_url: "/images/dishes/veg_pulav.jpg", description: "Fragrant basmati rice gently cooked with farm-fresh vegetables and mild spices.", is_vegetarian: true },
        { name: "Chana Masala", category: "main", image_url: "/images/dishes/chana_masala.jpg", description: "Tender chickpeas simmered in a robust, tangy spiced tomato-onion gravy.", is_vegetarian: true },
        { name: "Dal Rice", category: "rice", image_url: "/images/dishes/dal_rice.jpg", description: "Comforting steamed rice paired with golden cumin-garlic tempered yellow dal.", is_vegetarian: true },
        { name: "Chicken Biryani", category: "rice", image_url: "/images/dishes/chicken_biryani.jpg", description: "Aromatic dum basmati rice layered with succulent marinated chicken and whole spices.", is_vegetarian: false },
        { name: "Fish Curry", category: "main", image_url: "/images/dishes/fish_curry.jpg", description: "Tender fish steaks simmered in a coastal spiced coconut and tamarind gravy.", is_vegetarian: false },
      ],
      snacks: [
        { name: "Samosa", category: "snack", image_url: "/images/dishes/samosa.jpg", description: "Flaky crispy golden pastry stuffed with spicy potato and pea filling.", is_vegetarian: true },
        { name: "Aloo Bonda", category: "snack", image_url: "/images/dishes/aloo_bonda.jpg", description: "Crispy chickpea-batter fritters with seasoned potato interior.", is_vegetarian: true },
        { name: "Veg Cutlet", category: "snack", image_url: "/images/dishes/veg_cutlet.jpg", description: "Golden-crumbed savoury patties made with mixed vegetables and aromatic spices.", is_vegetarian: true },
        { name: "Corn Chat", category: "snack", image_url: "/images/dishes/corn_chat.jpg", description: "Steamed sweet golden corn kernels tossed with tangy chaat masala, onions, and lemon.", is_vegetarian: true },
        { name: "Masala Tea", category: "beverage", image_url: "/images/dishes/masala_tea.jpg", description: "Hot freshly brewed milk tea infused with crushed ginger and cardamom.", is_vegetarian: true },
        { name: "Egg Roll", category: "snack", image_url: "/images/dishes/egg_roll.jpg", description: "Crispy flaky flatbread wrapped with egg, chopped onions, and zesty sauces.", is_vegetarian: false },
        { name: "Chicken 65", category: "snack", image_url: "/images/dishes/chicken_65.jpg", description: "Crispy deep-fried chicken cubes seasoned with red chilies, garlic, and curry leaves.", is_vegetarian: false },
      ],
      dinner: [
        { name: "Chapati with Dal", category: "bread", image_url: "/images/dishes/chapati_dal.jpg", description: "Fresh whole wheat chapatis served with homestyle spiced yellow dal.", is_vegetarian: true },
        { name: "Paneer Butter Masala with Naan", category: "main", image_url: "/images/dishes/paneer_naan.jpg", description: "Soft cottage cheese cubes in rich tomato-butter gravy with crisp tandoori naan.", is_vegetarian: true },
        { name: "Veg Fried Rice", category: "rice", image_url: "/images/dishes/veg_fried_rice.jpg", description: "Wok-tossed long-grain rice with crunchy garden vegetables and light soy seasoning.", is_vegetarian: true },
        { name: "Mixed Vegetable Curry", category: "main", image_url: "/images/dishes/mixed_veg_curry.jpg", description: "Medley of seasonal vegetables simmered in a spiced onion-tomato curry.", is_vegetarian: true },
        { name: "Curd", category: "side", image_url: "/images/dishes/curd.jpg", description: "Fresh set whole milk curd, soothing and probiotic.", is_vegetarian: true },
        { name: "Chicken Curry", category: "main", image_url: "/images/dishes/chicken_curry.jpg", description: "Tender chicken pieces simmered in an aromatic spiced gravy with onions and tomatoes.", is_vegetarian: false },
        { name: "Egg Curry", category: "main", image_url: "/images/dishes/egg_curry.jpg", description: "Hard-boiled eggs simmered in a luscious onion-tomato masala gravy.", is_vegetarian: false },
      ],
    };

    const mealTiming = {
      breakfast: { cutoff_time: "06:00:00", serving_start_time: "07:30:00", serving_end_time: "09:30:00" },
      lunch: { cutoff_time: "10:00:00", serving_start_time: "12:30:00", serving_end_time: "14:30:00" },
      snacks: { cutoff_time: "15:30:00", serving_start_time: "17:00:00", serving_end_time: "18:00:00" },
      dinner: { cutoff_time: "17:00:00", serving_start_time: "19:30:00", serving_end_time: "21:30:00" },
    };

    let menusCreated = 0;
    let itemsCreated = 0;

    for (const menuDate of dates) {
      const d = new Date(menuDate);
      const dayIdx = (d.getDay() + 6) % 7; // Monday = 0 ... Sunday = 6

      for (const mealType of ["breakfast", "lunch", "snacks", "dinner"]) {
        const timing = mealTiming[mealType];
        const primaryDish = masterDishes[mealType][dayIdx];

        // Upsert menu with primary dish's image
        const menuRes = await client.query(`
          INSERT INTO public.menus (menu_date, meal_type, cutoff_time, serving_start_time, serving_end_time, is_published, image_url)
          VALUES ($1, $2, $3, $4, $5, true, $6)
          ON CONFLICT (menu_date, meal_type)
          DO UPDATE SET
            cutoff_time = EXCLUDED.cutoff_time,
            serving_start_time = EXCLUDED.serving_start_time,
            serving_end_time = EXCLUDED.serving_end_time,
            is_published = true,
            image_url = EXCLUDED.image_url
          RETURNING id;
        `, [menuDate, mealType, timing.cutoff_time, timing.serving_start_time, timing.serving_end_time, primaryDish.image_url]);

        const menuId = menuRes.rows[0].id;
        menusCreated++;

        // Clear any old/mismatched items for this specific menu to ensure clean state
        await client.query('DELETE FROM public.menu_items WHERE menu_id = $1;', [menuId]);

        // Insert primary dish
        await client.query(`
          INSERT INTO public.menu_items (menu_id, name, description, category, is_vegetarian, image_url)
          VALUES ($1, $2, $3, $4, $5, $6);
        `, [menuId, primaryDish.name, primaryDish.description, primaryDish.category, primaryDish.is_vegetarian, primaryDish.image_url]);
        itemsCreated++;

        // Insert complementing item
        if (mealType === "breakfast") {
          await client.query(`
            INSERT INTO public.menu_items (menu_id, name, description, category, is_vegetarian, image_url)
            VALUES ($1, 'Masala Tea', 'Hot freshly brewed milk tea infused with crushed ginger and cardamom.', 'beverage', true, '/images/dishes/masala_tea.jpg');
          `, [menuId]);
          itemsCreated++;
        } else if (mealType === "lunch" && primaryDish.name !== "Curd Rice") {
          await client.query(`
            INSERT INTO public.menu_items (menu_id, name, description, category, is_vegetarian, image_url)
            VALUES ($1, 'Curd', 'Fresh set whole milk curd.', 'side', true, '/images/dishes/curd.jpg');
          `, [menuId]);
          itemsCreated++;
        } else if (mealType === "snacks" && primaryDish.name !== "Masala Tea") {
          await client.query(`
            INSERT INTO public.menu_items (menu_id, name, description, category, is_vegetarian, image_url)
            VALUES ($1, 'Masala Tea', 'Hot freshly brewed ginger cardamom tea.', 'beverage', true, '/images/dishes/masala_tea.jpg');
          `, [menuId]);
          itemsCreated++;
        }
      }
    }

    // Also globally fix any legacy menu items that might exist on other dates
    await client.query(`
      UPDATE public.menu_items
      SET image_url = '/images/dishes/aloo_gobhi.jpg'
      WHERE name ILIKE '%gobhi%' OR name ILIKE '%gobi%';
    `);

    await client.query(`
      UPDATE public.menu_items
      SET image_url = '/images/dishes/idli.jpg'
      WHERE name ILIKE '%idli%' OR name ILIKE '%idly%';
    `);

    await client.query(`
      UPDATE public.menu_items
      SET image_url = '/images/dishes/vada.jpg'
      WHERE name ILIKE '%vada%' OR name ILIKE '%wada%';
    `);

    await client.query(`
      UPDATE public.menu_items
      SET image_url = '/images/dishes/coffee.jpg'
      WHERE name ILIKE '%coffee%' OR name ILIKE '%kaapi%';
    `);

    await client.query(`
      UPDATE public.menu_items
      SET image_url = '/images/dishes/tea.jpg'
      WHERE name ILIKE '%chai%' OR name ILIKE '%tea%';
    `);

    await client.query(`
      UPDATE public.menu_items
      SET image_url = '/images/dishes/paneer.jpg'
      WHERE name ILIKE '%paneer%';
    `);

    await client.query(`
      UPDATE public.menu_items
      SET image_url = '/images/dishes/dal.jpg'
      WHERE (name ILIKE '%dal%' OR name ILIKE '%tadka%') AND name NOT ILIKE '%makhani%';
    `);

    await client.query(`
      UPDATE public.menu_items
      SET image_url = '/images/dishes/roti.jpg'
      WHERE name ILIKE '%roti%' OR name ILIKE '%phulka%' OR name ILIKE '%chapati%';
    `);

    await client.query(`
      UPDATE public.menu_items
      SET image_url = '/images/dishes/rice.jpg'
      WHERE name ILIKE '%steamed rice%' OR (name ILIKE '%rice%' AND name NOT ILIKE '%pulao%' AND name NOT ILIKE '%biryani%');
    `);

    await client.query(`
      UPDATE public.menu_items
      SET image_url = '/images/dishes/pulao.jpg'
      WHERE name ILIKE '%pulao%' OR name ILIKE '%jeera%';
    `);

    await client.query(`
      UPDATE public.menu_items
      SET image_url = '/images/dishes/gulab_jamun.jpg'
      WHERE name ILIKE '%jamun%' OR name ILIKE '%gulab%';
    `);

    await client.query(`
      UPDATE public.menu_items
      SET image_url = '/images/dishes/samosa.jpg'
      WHERE name ILIKE '%samosa%';
    `);

    console.log(`🎉 Seeding complete! Created/updated ${menusCreated} menus with ${itemsCreated} verified menu items across 7 days.`);
    await client.end();
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
}

seedMenus();
