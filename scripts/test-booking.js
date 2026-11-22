const { Client } = require('pg');

async function testBooking() {
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

  // 1. Get sample student profile
  const profileRes = await client.query('SELECT id, email FROM public.profiles WHERE role = $1 LIMIT 1;', ['student']);
  console.log('Sample student profile:', profileRes.rows[0]);

  // 2. Get sample menu
  const menuRes = await client.query('SELECT id, menu_date, meal_type FROM public.menus LIMIT 1;');
  console.log('Sample menu:', menuRes.rows[0]);

  if (profileRes.rows[0] && menuRes.rows[0]) {
    const studentId = profileRes.rows[0].id;
    const menuId = menuRes.rows[0].id;

    // Test upsert into meal_plans
    const planRes = await client.query(`
      INSERT INTO public.meal_plans (student_id, menu_id, status, submitted_at, updated_at)
      VALUES ($1, $2, 'yes', NOW(), NOW())
      ON CONFLICT (student_id, menu_id)
      DO UPDATE SET status = EXCLUDED.status, updated_at = NOW()
      RETURNING *;
    `, [studentId, menuId]);

    console.log('✅ Successfully inserted/updated meal plan in Supabase:', planRes.rows[0]);
  }

  await client.end();
}

testBooking().catch(console.error);
