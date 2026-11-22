// scripts/run-migration.js
// Executes all_in_one_setup.sql directly against the live Supabase PostgreSQL database

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function runMigration() {
  const host = process.env.SUPABASE_DB_HOST;
  const password = process.env.SUPABASE_DB_PASSWORD;
  if (!host || !password) {
    console.error('❌ Missing database password.');
    console.log('Usage: node scripts/run-migration.js <your-database-password>');
    process.exit(1);
  }
  console.log(`📡 Connecting to PostgreSQL at ${host}:5432...`);

  const client = new Client({
    host,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: password,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database successfully!');

    const sqlPath = path.join(__dirname, '..', 'supabase', 'all_in_one_setup.sql');
    console.log('📖 Reading setup script from:', sqlPath);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('⚙️ Executing all_in_one_setup.sql (tables, RLS, triggers, seed data)...');
    await client.query(sql);

    console.log('🎉 All tables, triggers, and seed data created successfully!');

    // Verify row counts
    const tables = ['profiles', 'menus', 'menu_items', 'grocery_items', 'recipes', 'complaints', 'wallet_transactions'];
    console.log('\n📊 Database Health Check:');
    for (const table of tables) {
      try {
        const countRes = await client.query(`SELECT count(*) FROM public.${table};`);
        console.log(`   - Table "${table}": ${countRes.rows[0].count} rows`);
      } catch (e) {
        console.log(`   - Table "${table}": Error checking count (${e.message})`);
      }
    }

    console.log('\n🚀 MealSync is now 100% connected to live Supabase cloud database!');
    await client.end();
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

runMigration();
