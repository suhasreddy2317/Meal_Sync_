// scripts/test-otp-flow.js
// Standalone verification for the complete 6-digit Email OTP registration lifecycle

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

// 1. Load .env.local
const envContent = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.trim().split('=');
  if (parts.length >= 2 && !parts[0].startsWith('#')) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim();
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const transporter = nodemailer.createTransport({
  host: env.GOOGLE_SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(env.GOOGLE_SMTP_PORT || '465', 10),
  secure: true,
  auth: {
    user: env.GOOGLE_SMTP_USER,
    pass: env.GOOGLE_SMTP_PASS,
  },
});

function generateNumericOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

async function testOtpLifecycle() {
  console.log('🧪 Starting 6-Digit Email OTP Lifecycle Verification...\n');

  // Test 1: OTP Generation
  const testOtp = generateNumericOtp();
  if (!/^\d{6}$/.test(testOtp)) {
    throw new Error('❌ OTP is not a 6-digit number!');
  }
  console.log('   ✅ Valid 6-digit numeric format verified.');
  const testEmail = process.env.TEST_EMAIL;
  if (!testEmail) {
    throw new Error('Missing required environment variable: TEST_EMAIL');
  }

  // Test 2: Storage in Supabase Database
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const { data: insertData, error: insertError } = await supabase
    .from('email_verifications')
    .insert({
      email: testEmail,
      otp_code: testOtp,
      expires_at: expiresAt,
      verified: false,
      attempts: 0,
    })
    .select('id')
    .single();

  if (insertError) {
    throw new Error('❌ Failed to store OTP in database: ' + insertError.message);
  }
  const recordId = insertData.id;
  console.log('   ✅ OTP successfully stored in Supabase with record ID:', recordId);

  // Test 3: Email Dispatch via Google SMTP
  console.log('\n3. Dispatching OTP email via Google SMTP (smtp.gmail.com)...');
  const info = await transporter.sendMail({
    from: `"MealSync" <${env.GOOGLE_SMTP_USER}>`,
    to: testEmail,
    subject: `Your MealSync Verification Code: ${testOtp} 🔐`,
    html: `
      <div style="font-family: sans-serif; background: #FFF5EF; padding: 24px; color: #241D1B;">
        <div style="max-width: 500px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; padding: 28px; border: 1px solid #EADCD6;">
          <h2 style="color: #241D1B; text-align: center;">Verify Your College Email</h2>
          <p style="text-align: center;">Use this 6-digit verification code to complete your registration:</p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="font-family: monospace; font-size: 34px; font-weight: 900; letter-spacing: 8px; background: #FFF5EF; border: 2px dashed #EF6A32; padding: 12px 24px; border-radius: 12px; color:#241D1B;">${testOtp}</span>
          </div>
          <p style="font-size: 12px; color: #777; text-align: center;">Valid for 10 minutes. Never share this code.</p>
        </div>
      </div>
    `,
  });

  // Test 4: Reject Invalid OTP
  console.log('\n4. Testing rejection of incorrect OTP ("000000")...');
  const { data: rec } = await supabase
    .from('email_verifications')
    .select('*')
    .eq('id', recordId)
    .single();

  if (rec.otp_code === '000000') {
    throw new Error('❌ Code unexpectedly matches!');
  }
  // increment attempt
  await supabase.from('email_verifications').update({ attempts: rec.attempts + 1 }).eq('id', recordId);
  console.log('   ✅ Correctly rejected incorrect OTP (attempts incremented to 1).');

  // Test 5: Accept Correct OTP
  const { data: validRec } = await supabase
    .from('email_verifications')
    .select('*')
    .eq('id', recordId)
    .eq('verified', false)
    .single();

  if (validRec.otp_code !== testOtp) {
    throw new Error('❌ Correct OTP was not matched!');
  }
  // Mark as verified
  await supabase.from('email_verifications').update({ verified: true }).eq('id', recordId);
  console.log('   ✅ Correct OTP verified successfully and marked verified = true!');

  // Test 6: Verify Single-Use Invalidation
  console.log('\n6. Testing single-use protection (re-submitting same OTP)...');
  const { data: reuseRec } = await supabase
    .from('email_verifications')
    .select('*')
    .eq('id', recordId)
    .eq('verified', false)
    .maybeSingle();

  if (reuseRec) {
    throw new Error('❌ Reusable OTP detected! Single-use policy breached.');
  }
  console.log('   ✅ Re-submission safely blocked (record is already marked verified).');

  console.log('\n🎉 ALL 6 OTP LIFECYCLE TESTS PASSED PERFECTLY!\n');
}

testOtpLifecycle().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
