"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema, LoginInput, RegisterInput, COLLEGE_EMAIL_DOMAIN } from "@/lib/validations/auth";
import { getStore } from "@/lib/data/mess-store";
import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/lib/types/database";
import { sendWelcomeStudentEmail, sendOtpVerificationEmail } from "@/lib/services/email";
import {
  generateNumericOtp,
  storeRegistrationOtp,
  verifyRegistrationOtp,
  checkOtpRateLimit,
} from "@/lib/services/otp";

export async function loginAction(input: LoginInput) {
  const result = loginSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.errors[0]?.message || "Invalid input" };
  }

  const { email, password } = result.data;

  // Strict MSRUAS domain check
  if (!email.toLowerCase().endsWith(COLLEGE_EMAIL_DOMAIN)) {
    return {
      success: false,
      error: `Access restricted: Only college email addresses ending in ${COLLEGE_EMAIL_DOMAIN} are permitted.`,
    };
  }

  const cookieStore = cookies();

  // Try Supabase Auth first
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data?.user && !error) {
      const role = data.user.user_metadata?.role || "student";
      cookieStore.set("mess_session_role", role, { path: "/", httpOnly: true });
      cookieStore.set("mess_user_id", data.user.id, { path: "/", httpOnly: true });
      cookieStore.set("mess_user_name", data.user.user_metadata?.full_name || "User", { path: "/" });

      return { success: true, role };
    }
  } catch {
    // If Supabase is unconfigured, proceed to repository authentication
  }

  // Repository / Demo authentication fallback
  const store = getStore();
  const profile = store.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());

  if (!profile) {
    return { success: false, error: "Invalid email or account does not exist." };
  }

  // Set local secure session cookies
  cookieStore.set("mess_session_role", profile.role, { path: "/", httpOnly: true });
  cookieStore.set("mess_user_id", profile.id, { path: "/", httpOnly: true });
  cookieStore.set("mess_user_name", profile.full_name, { path: "/" });

  return { success: true, role: profile.role };
}

export async function sendRegistrationOtpAction(input: RegisterInput) {
  const result = registerSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.errors[0]?.message || "Validation failed" };
  }

  const { full_name, email, roll_number } = result.data;

  // 1. Strict MSRUAS domain check
  if (!email.toLowerCase().endsWith(COLLEGE_EMAIL_DOMAIN)) {
    return {
      success: false,
      error: `Access restricted: Only college email addresses ending in ${COLLEGE_EMAIL_DOMAIN} are permitted.`,
    };
  }

  const store = getStore();

  // 2. Check unique email and roll_number
  if (store.profiles.some((p) => p.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "A student with this email address already exists." };
  }
  if (store.profiles.some((p) => p.roll_number?.toLowerCase() === roll_number.toLowerCase())) {
    return { success: false, error: "A student with this roll number is already registered." };
  }

  // 3. Check rate limiting (60-second cooldown)
  const rateLimit = await checkOtpRateLimit(email);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Please wait ${rateLimit.waitSeconds} seconds before requesting a new code.`,
    };
  }

  // 4. Generate 6-digit OTP & store
  const otp = generateNumericOtp();
  await storeRegistrationOtp(email, otp);

  // 5. Dispatch OTP email via Google SMTP
  const emailRes = await sendOtpVerificationEmail({
    to: email,
    fullName: full_name,
    otpCode: otp,
  });

  if (!emailRes.success) {
    console.warn("⚠️ SMTP dispatch warning:", emailRes.reason || emailRes.error);
  }

  return { success: true };
}

export async function verifyOtpAndRegisterAction(input: RegisterInput, otp: string) {
  const result = registerSchema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error.errors[0]?.message || "Validation failed" };
  }

  const { full_name, email, roll_number, hostel_block, room_number, password } = result.data;

  // 1. Verify OTP
  const verification = await verifyRegistrationOtp(email, otp);
  if (!verification.valid) {
    return { success: false, error: verification.error || "Invalid verification code." };
  }

  const cookieStore = cookies();
  const store = getStore();

  // 2. Check unique email and roll_number again
  if (store.profiles.some((p) => p.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: "A student with this email address already exists." };
  }
  if (store.profiles.some((p) => p.roll_number?.toLowerCase() === roll_number.toLowerCase())) {
    return { success: false, error: "A student with this roll number is already registered." };
  }

  // 3. Attempt Supabase Auth registration
  let createdId = `u-student-${Date.now()}`;
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          roll_number,
          hostel_block,
          room_number,
          role: "student",
        },
      },
    });
    if (data?.user?.id) {
      createdId = data.user.id;
    }
  } catch {
    // Supabase unavailable; proceed to local store
  }

  // 4. Create student profile in store
  const newProfile: Profile = {
    id: createdId,
    email,
    full_name,
    roll_number,
    department: "Computer Science & Engineering",
    hostel_block,
    room_number,
    mess_allocation: "Central Mess Hall 1",
    role: "student",
    wallet_balance: 450,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  store.profiles.push(newProfile);

  // 5. Set authenticated session cookies
  cookieStore.set("mess_session_role", "student", { path: "/", httpOnly: true });
  cookieStore.set("mess_user_id", newProfile.id, { path: "/", httpOnly: true });
  cookieStore.set("mess_user_name", newProfile.full_name, { path: "/" });

  // 6. Send Welcome Email via Google SMTP (asynchronous)
  sendWelcomeStudentEmail({
    to: email,
    fullName: full_name,
    rollNumber: roll_number,
    hostelBlock: hostel_block,
    roomNumber: room_number,
  }).catch((err) => {
    console.error("Non-blocking welcome email error:", err);
  });

  return { success: true, role: "student" };
}

export async function registerStudentAction(input: RegisterInput) {
  // Direct fallback registration (redirects to OTP flow)
  return sendRegistrationOtpAction(input);
}

export async function logoutAction() {
  const cookieStore = cookies();
  cookieStore.delete("mess_session_role");
  cookieStore.delete("mess_user_id");
  cookieStore.delete("mess_user_name");

  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch {
    // Ignore if offline
  }

  redirect("/login");
}

export async function getCurrentUser(): Promise<Profile | null> {
  let role: string | null = null;
  let id: string | null = null;
  let name: string | null = null;

  try {
    const cookieStore = cookies();
    role = cookieStore.get("mess_session_role")?.value || null;
    id = cookieStore.get("mess_user_id")?.value || null;
    name = cookieStore.get("mess_user_name")?.value || null;
  } catch {
    // In standalone CLI test execution outside an active HTTP request
  }

  if (!id) {
    const store = getStore();
    return store.profiles.find((p) => p.role === "student") || null;
  }

  const store = getStore();
  const profile = store.profiles.find((p) => p.id === id);

  return (
    profile || {
      id,
      email: `${role || "student"}@mess.college.edu`,
      full_name: name || "Aarav Sharma",
      roll_number: "2024CS001",
      department: "Computer Science",
      hostel_block: "Block A",
      room_number: "101",
      mess_allocation: "Central Mess Hall 1",
      role: (role as "student" | "admin") || "student",
      wallet_balance: 450,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  );
}
