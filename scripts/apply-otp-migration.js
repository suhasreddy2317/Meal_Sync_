const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function applyMigration() {
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
    password: password,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to Supabase PostgreSQL database.');

    const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '004_email_verifications.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Applying 004_email_verifications.sql...');
    await client.query(sql);

    console.log('✅ email_verifications table and indexes successfully created on Supabase!');

    const res = await client.query(`SELECT count(*) FROM public.email_verifications;`);
    console.log('Verification check: current rows =', res.rows[0].count);

    await client.end();
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

applyMigration();
