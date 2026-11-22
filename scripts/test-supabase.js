// scripts/test-supabase.js
// Utility script to verify live Supabase connection and database schema health

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read .env.local manually so we don't depend on dotenv
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found at:', envPath);
    process.exit(1);
  }

  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

async function verifySupabase() {
  console.log('🔍 Testing Supabase connection...\n');
  const env = loadEnv();

  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('Target URL:', url ? url : '(Not Set)');
  console.log('Anon Key:', anonKey ? (anonKey.startsWith('eyJ') || anonKey.startsWith('sb_publishable_') ? 'Valid Key format' : 'Set (custom)') : '(Not Set)');
  console.log('Service Role Key:', serviceKey ? (serviceKey.startsWith('eyJ') || serviceKey.startsWith('sb_secret_') ? 'Valid Secret format' : (serviceKey.includes('dummy') ? 'Placeholder (optional for client queries)' : 'Set')) : '(Not Set)');

  if (!url || url.includes('dummy') || !anonKey || anonKey.includes('dummy')) {
    console.log('\n⚠️ Notice: Dummy/placeholder credentials detected in .env.local.');
    console.log('Please provide your live Supabase Project URL and API Keys to complete the connection.\n');
    return false;
  }

  try {
    const client = createClient(url, anonKey);
    console.log('\n📡 Connecting to Supabase with Anon key...');
    const { data: menuData, error: menuError } = await client.from('menus').select('id, menu_date, meal_type').limit(5);

    if (menuError) {
      console.log('📡 Supabase endpoint responded:', menuError.message);
      if (menuError.code === '42P01' || menuError.code === 'PGRST205' || menuError.message.includes('schema cache') || menuError.message.includes('does not exist')) {
        console.log('\n======================================================');
        console.log('👉 ACTION REQUIRED: Run the SQL setup script!');
        console.log('1. Go to: https://supabase.com/dashboard/project/<your-project-ref>/sql/new');
        console.log('2. Paste the contents of supabase/all_in_one_setup.sql');
        console.log('3. Click "Run"');
        console.log('======================================================\n');
      }
      return false;
    }

    console.log('✅ Successfully connected to Supabase! Found', menuData ? menuData.length : 0, 'sample menu rows.');
    
    if (serviceKey && !serviceKey.includes('dummy')) {
      const adminClient = createClient(url, serviceKey);
      const { data: profileData, error: profileErr } = await adminClient.from('profiles').select('id, full_name, role').limit(5);
      if (profileErr) {
        console.warn('⚠️ Admin client check warning:', profileErr.message);
      } else {
        console.log('✅ Admin service role key verified! Found', profileData ? profileData.length : 0, 'profiles in database.');
      }
    }

    return true;
  } catch (err) {
    console.error('❌ Unexpected connection failure:', err.message);
    return false;
  }
}

verifySupabase();
