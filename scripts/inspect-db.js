const { Client } = require('pg');

async function check() {
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
  const cols = await client.query(`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'meal_plans';
  `);
  console.log('Columns on meal_plans:');
  console.table(cols.rows);

  const cons = await client.query(`
    SELECT conname, pg_get_constraintdef(c.oid)
    FROM pg_constraint c
    JOIN pg_class r ON r.oid = c.conrelid
    WHERE r.relname = 'meal_plans';
  `);
  console.log('Constraints on meal_plans:');
  console.table(cons.rows);

  await client.end();
}

check().catch(console.error);
