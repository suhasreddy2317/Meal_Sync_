// scripts/test-smtp.js
// Utility script to verify Google SMTP credentials and send a test email

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return {};
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

async function testGoogleSmtp() {
  console.log('📬 Testing Google SMTP configuration...\n');
  const env = loadEnv();

  const user = process.argv[2] || env.GOOGLE_SMTP_USER;
  const pass = process.argv[3] || env.GOOGLE_SMTP_PASS;

  if (!user || !pass) {
    console.log('⚠️ Google SMTP credentials not yet provided in .env.local.');
    console.log('Please provide your Gmail address and 16-character App Password:');
    console.log('Usage: node scripts/test-smtp.js <your-gmail@gmail.com> <16-char-app-password>\n');
    return;
  }

  const cleanPass = pass.replace(/\s+/g, '');
  console.log('Connecting to Google SMTP (smtp.gmail.com:465)...');
  console.log('SMTP username is configured.');
  console.log('SMTP password is configured.');

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: user.trim(),
      pass: cleanPass,
    },
  });

  try {
    console.log('Verifying SMTP handshake...');
    await transporter.verify();
    console.log('✅ Google SMTP authentication successful!\n');

    // Optionally send a verification email to the user
  console.log('SMTP username is configured.');
    const info = await transporter.sendMail({
      from: `"MealSync" <${user}>`,
      to: user,
      subject: '✅ Google SMTP Connected — MealSync / MSRUAS Dining System',
      html: `
        <div style="font-family: sans-serif; background: #FFF5EF; padding: 24px; color: #241D1B;">
          <div style="max-width: 500px; margin: 0 auto; background: #FFFFFF; border-radius: 18px; padding: 28px; border: 1px solid #EADCD6;">
            <h2 style="color: #24866B; margin-top: 0;">SMTP Test Successful! 🎉</h2>
            <p>Your Google SMTP configuration is working properly.</p>
            <p>MealSync can now send automated emails to MSRUAS students for meal bookings, cutoff alerts, and mess announcements.</p>
            <p style="font-size: 12px; color: #777;">Sent from MealSync</p>
          </div>
        </div>
      `,
    });

    console.log('🎉 Test email dispatched successfully! Message ID:', info.messageId);
    console.log('Check your Gmail inbox/spam folder to verify receipt.');
  } catch (err) {
    console.error('❌ Google SMTP error:', err.message);
    if (err.message.includes('Username and Password not accepted') || err.message.includes('BadCredentials')) {
      console.log('\n💡 Tip: For Gmail, you must use a 16-character "App Password", not your normal Google account password.');
      console.log('Generate one at: https://myaccount.google.com/apppasswords');
    }
  }
}

testGoogleSmtp();
