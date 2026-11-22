// lib/services/email.ts - Google SMTP Email Notification Service for MealSync / MSRUAS

import nodemailer from "nodemailer";

function getSmtpTransporter() {
  const user = process.env.GOOGLE_SMTP_USER;
  const pass = process.env.GOOGLE_SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.GOOGLE_SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.GOOGLE_SMTP_PORT || "465", 10),
    secure: process.env.GOOGLE_SMTP_SECURE !== "false", // true for 465, false for 587
    auth: {
      user: user.trim(),
      pass: pass.trim().replace(/\s+/g, ""), // Remove any spaces in 16-character App Password
    },
  });
}

export async function isSmtpConfigured(): Promise<boolean> {
  const transporter = getSmtpTransporter();
  if (!transporter) return false;

  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.warn("⚠️ Google SMTP verification failed:", (error as Error).message);
    return false;
  }
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  const transporter = getSmtpTransporter();
  const from = process.env.GOOGLE_SMTP_FROM || `MealSync <${process.env.GOOGLE_SMTP_USER || "no-reply@msruas.ac.in"}>`;

  if (!transporter) {
    console.log(`[SMTP Not Configured] Skipped email to ${to} | Subject: "${subject}"`);
    return { success: false, reason: "SMTP not configured in environment variables" };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ""),
    });
    console.log(`✅ Email sent successfully to ${to} | MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`❌ Failed to send email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Welcome Email for newly registered MSRUAS students
 */
export async function sendWelcomeStudentEmail(params: {
  to: string;
  fullName: string;
  rollNumber?: string;
  hostelBlock?: string;
  roomNumber?: string;
}) {
  const subject = "Welcome to MealSync — MSRUAS Hostel Mess System 🍽️";
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FFF5EF; margin: 0; padding: 24px; color: #241D1B; }
        .card { max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 24px; border: 1px solid #EADCD6; padding: 36px; box-shadow: 0 4px 20px rgba(169,29,50,0.06); }
        .brand { text-align: center; margin-bottom: 24px; }
        .brand-badge { display: inline-block; background: #A91D32; color: #FFFFFF; font-size: 14px; font-weight: 900; padding: 8px 18px; border-radius: 20px; }
        .title { font-size: 22px; font-weight: 800; color: #241D1B; margin-bottom: 12px; }
        .details-box { background: #FFF5EF; border: 1px solid #EADCD6; border-radius: 16px; padding: 18px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
        .detail-label { color: #777777; font-weight: 600; }
        .detail-value { color: #241D1B; font-weight: 700; }
        .btn { display: inline-block; background: #A91D32; color: #FFFFFF; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 28px; border-radius: 14px; margin-top: 18px; text-align: center; }
        .footer { text-align: center; font-size: 11px; color: #777777; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="brand">
          <div class="brand-badge">MealSync • MSRUAS Dining</div>
        </div>
        <h1 class="title">Welcome, ${params.fullName}! 👋</h1>
        <p style="font-size: 14px; line-height: 1.6; color: #444444;">
          Your dining registration at <strong>M. S. Ramaiah University of Applied Sciences</strong> has been activated. You can now opt in for daily meals, check weekly menus, top up your mess wallet, and submit dining feedback.
        </p>

        <div class="details-box">
          <div class="detail-row">
            <span class="detail-label">Registered Email:</span>
            <span class="detail-value">${params.to}</span>
          </div>
          ${params.rollNumber ? `
          <div class="detail-row">
            <span class="detail-label">Roll Number:</span>
            <span class="detail-value">${params.rollNumber}</span>
          </div>` : ""}
          ${params.hostelBlock ? `
          <div class="detail-row">
            <span class="detail-label">Hostel Allocation:</span>
            <span class="detail-value">${params.hostelBlock} ${params.roomNumber ? `• Room ${params.roomNumber}` : ""}</span>
          </div>` : ""}
          <div class="detail-row">
            <span class="detail-label">Starting Wallet Balance:</span>
            <span class="detail-value" style="color: #43B978;">₹450.00</span>
          </div>
        </div>

        <div style="text-align: center;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/student/dashboard" class="btn">
            Open Student Dashboard →
          </a>
        </div>

        <div class="footer">
          <p>M. S. Ramaiah University of Applied Sciences (MSRUAS) — Mess Operations</p>
          <p>This is an automated system notification. For mess queries, contact your hostel mess supervisor.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: params.to, subject, html });
}

/**
 * 6-Digit Email Verification Code (OTP) for MSRUAS Student Registration
 */
export async function sendOtpVerificationEmail(params: {
  to: string;
  fullName: string;
  otpCode: string;
}) {
  const subject = `Your MealSync Verification Code: ${params.otpCode} 🔐`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FFF5EF; margin: 0; padding: 24px; color: #241D1B; }
        .card { max-width: 520px; margin: 0 auto; background: #FFFFFF; border-radius: 24px; border: 1px solid #EADCD6; padding: 36px; box-shadow: 0 4px 20px rgba(169,29,50,0.06); }
        .brand { text-align: center; margin-bottom: 24px; }
        .brand-badge { display: inline-block; background: #A91D32; color: #FFFFFF; font-size: 13px; font-weight: 900; padding: 6px 16px; border-radius: 20px; }
        .title { font-size: 22px; font-weight: 800; color: #241D1B; text-align: center; margin-bottom: 8px; }
        .subtitle { font-size: 13px; color: #666666; text-align: center; line-height: 1.5; margin-bottom: 24px; }
        .otp-box { text-align: center; margin: 28px 0; }
        .otp-code { display: inline-block; background: #FFF5EF; border: 2px dashed #EF6A32; border-radius: 16px; padding: 16px 28px; font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #241D1B; }
        .warning-box { background: #FFF3F3; border: 1px solid #FFE0E0; border-radius: 12px; padding: 12px 16px; font-size: 12px; color: #D32F2F; line-height: 1.4; margin-top: 24px; }
        .footer { text-align: center; font-size: 11px; color: #888888; margin-top: 28px; border-top: 1px solid #EEE8E0; pt: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="brand">
          <div class="brand-badge">MealSync • MSRUAS Mess System</div>
        </div>
        <h1 class="title">Verify Your College Email</h1>
        <p class="subtitle">
          Hello <strong>${params.fullName}</strong>,<br>
          Use the 6-digit verification code below to complete your registration for the MSRUAS Hostel Mess Portal:
        </p>

        <div class="otp-box">
          <div class="otp-code">${params.otpCode}</div>
        </div>

        <div class="warning-box">
          <strong>⏰ Valid for 10 minutes:</strong> This code will expire shortly. Never share this verification code with anyone. MealSync or MSRUAS staff will never ask for your OTP.
        </div>

        <div class="footer">
          <p style="margin: 4px 0;">M. S. Ramaiah University of Applied Sciences (MSRUAS)</p>
          <p style="margin: 4px 0;">If you did not request this registration, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: params.to, subject, html });
}

/**
 * Meal Cutoff Alert Email
 */
export async function sendMealCutoffAlert(params: {
  to: string;
  fullName: string;
  mealType: string;
  cutoffTime: string;
  dateStr: string;
}) {
  const subject = `Cutoff Alert: ${params.mealType.toUpperCase()} Opt-In Closing at ${params.cutoffTime} ⏰`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: sans-serif; background: #FFF9F3; padding: 24px; color: #171717;">
      <div style="max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 28px; border: 1px solid #EEE8E0;">
        <h2 style="color: #EF6464; margin-top: 0;">Cutoff Warning ⏰</h2>
        <p>Hi ${params.fullName},</p>
        <p>The opt-in cutoff for <strong>${params.mealType}</strong> on <strong>${params.dateStr}</strong> closes at <strong>${params.cutoffTime}</strong>.</p>
        <p>If you plan to dine today, please confirm your meal attendance in the portal to help the mess reduce food wastage.</p>
        <p style="text-align: center; margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/student/meal-plans" style="background: #FFC83D; color: #151515; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 12px;">Confirm Meal Now</a>
        </p>
      </div>
    </body>
    </html>
  `;
  return sendEmail({ to: params.to, subject, html });
}
