// lib/services/otp.ts - Cryptographically Secure 6-Digit Email OTP Service

import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

interface MemoryOtpRecord {
  otp: string;
  expiresAt: number;
  attempts: number;
  verified: boolean;
  createdAt: number;
}

// In-memory fallback cache (used if Supabase is temporarily unreachable)
const memoryOtpStore = new Map<string, MemoryOtpRecord>();

/**
 * Generate a 6-digit numeric OTP (100000 - 999999)
 */
export function generateNumericOtp(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Check if a student can request a new OTP (60-second cooldown)
 */
export async function checkOtpRateLimit(email: string): Promise<{ allowed: boolean; waitSeconds: number }> {
  const normalizedEmail = email.trim().toLowerCase();
  const now = Date.now();

  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("email_verifications")
      .select("created_at")
      .eq("email", normalizedEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data?.created_at) {
      const lastCreated = new Date(data.created_at).getTime();
      const elapsed = Math.floor((now - lastCreated) / 1000);
      if (elapsed < 60) {
        return { allowed: false, waitSeconds: 60 - elapsed };
      }
    }
  } catch {
    const mem = memoryOtpStore.get(normalizedEmail);
    if (mem) {
      const elapsed = Math.floor((now - mem.createdAt) / 1000);
      if (elapsed < 60) {
        return { allowed: false, waitSeconds: 60 - elapsed };
      }
    }
  }

  return { allowed: true, waitSeconds: 0 };
}

/**
 * Store generated OTP in Supabase database & in-memory fallback
 */
export async function storeRegistrationOtp(email: string, otp: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Update in-memory fallback
  memoryOtpStore.set(normalizedEmail, {
    otp,
    expiresAt: expiresAt.getTime(),
    attempts: 0,
    verified: false,
    createdAt: Date.now(),
  });

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("email_verifications").insert({
      email: normalizedEmail,
      otp_code: otp,
      expires_at: expiresAt.toISOString(),
      verified: false,
      attempts: 0,
    });

    if (error) {
      console.warn("⚠️ Failed to write OTP to Supabase, fallback to memory:", error.message);
    }
    return true;
  } catch (err: any) {
    console.warn("⚠️ Database unreachable, using memory store for OTP:", err.message);
    return true;
  }
}

/**
 * Verify entered 6-digit OTP
 */
export async function verifyRegistrationOtp(
  email: string,
  enteredOtp: string
): Promise<{ valid: boolean; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const cleanOtp = enteredOtp.trim();

  if (!/^\d{6}$/.test(cleanOtp)) {
    return { valid: false, error: "Please enter a valid 6-digit verification code." };
  }

  try {
    const supabase = createAdminClient();
    const { data: record, error } = await supabase
      .from("email_verifications")
      .select("id, otp_code, expires_at, attempts, verified")
      .eq("email", normalizedEmail)
      .eq("verified", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && record) {
      const now = new Date();
      const expiresAt = new Date(record.expires_at);

      if (now > expiresAt) {
        return { valid: false, error: "Verification code has expired. Please request a new one." };
      }

      if (record.attempts >= 5) {
        return { valid: false, error: "Too many incorrect attempts. Please request a new verification code." };
      }

      if (record.otp_code !== cleanOtp) {
        // Increment attempts count
        await supabase
          .from("email_verifications")
          .update({ attempts: record.attempts + 1 })
          .eq("id", record.id);

        const remaining = 5 - (record.attempts + 1);
        return {
          valid: false,
          error: `Incorrect code. ${remaining > 0 ? `${remaining} attempts remaining.` : "Please request a new code."}`,
        };
      }

      // Mark as verified
      await supabase
        .from("email_verifications")
        .update({ verified: true })
        .eq("id", record.id);

      return { valid: true };
    }
  } catch (err) {
    console.warn("Falling back to memory store for verification:", err);
  }

  // Memory fallback
  const mem = memoryOtpStore.get(normalizedEmail);
  if (!mem) {
    return { valid: false, error: "No verification code requested. Please click send code." };
  }

  if (Date.now() > mem.expiresAt) {
    return { valid: false, error: "Verification code has expired. Please request a new code." };
  }

  if (mem.attempts >= 5) {
    return { valid: false, error: "Too many failed attempts. Please request a new code." };
  }

  if (mem.otp !== cleanOtp) {
    mem.attempts++;
    const remaining = 5 - mem.attempts;
    return {
      valid: false,
      error: `Incorrect code. ${remaining > 0 ? `${remaining} attempts remaining.` : "Please request a new code."}`,
    };
  }

  mem.verified = true;
  return { valid: true };
}
