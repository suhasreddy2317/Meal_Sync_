const { Client } = require('pg');

async function enforceDbConstraint() {
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
    await client.query(`
      ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS chk_msruas_email;
      ALTER TABLE public.profiles ADD CONSTRAINT chk_msruas_email CHECK (email ILIKE '%@msruas.ac.in');
    `);
    console.log('✅ PostgreSQL constraint chk_msruas_email added to public.profiles!');
    await client.end();
  } catch (e) {
    console.error('Error applying constraint:', e.message);
  }
}

enforceDbConstraint();
