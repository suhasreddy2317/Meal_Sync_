const { Client } = require('pg');

async function verifyDbDishes() {
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

  await client.connect();
  const res = await client.query(`
    SELECT DISTINCT name, category, image_url
    FROM public.menu_items
    ORDER BY name;
  `);

  console.log('--- SUPABASE DISTINCT DISHES ---');
  console.table(res.rows);

  const mealCount = await client.query(`
    SELECT meal_type, count(*) as count
    FROM public.menus
    GROUP BY meal_type;
  `);
  console.log('--- SUPABASE MENUS BY MEAL TYPE ---');
  console.table(mealCount.rows);

  await client.end();
}

verifyDbDishes().catch(console.error);
