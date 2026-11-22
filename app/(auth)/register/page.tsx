"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Utensils,
  Lock,
  Mail,
  User,
  Hash,
  Building2,
  DoorClosed,
  ArrowRight,
  KeyRound,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import {
  sendRegistrationOtpAction,
  verifyOtpAndRegisterAction,
} from "@/app/actions/auth-actions";
import { QubiteLogo } from "@/components/shared/qubite-logo";
import { AuthIsometricBackground } from "@/components/shared/auth-isometric-background";

export default function RegisterPage() {
  const router = useRouter();

  // Step state: "details" | "otp"
  const [step, setStep] = useState<"details" | "otp">("details");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [hostelBlock, setHostelBlock] = useState("Block A");
  const [roomNumber, setRoomNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // OTP state
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Status states
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Resend countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (step === "otp" && resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, resendCooldown]);

  // Step 1: Submit details & dispatch OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessNotice(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (!email.toLowerCase().endsWith("@msruas.ac.in")) {
      setErrorMsg("Access restricted: Only college email addresses ending in @msruas.ac.in are permitted.");
      return;
    }

    setLoading(true);

    const res = await sendRegistrationOtpAction({
      full_name: fullName.trim(),
      email: email.trim(),
      roll_number: rollNumber.trim().toUpperCase(),
      hostel_block: hostelBlock,
      room_number: roomNumber.trim(),
      password,
      confirm_password: confirmPassword,
    });

    setLoading(false);

    if (res.success) {
      setStep("otp");
      setResendCooldown(60);
      setCanResend(false);
      setSuccessNotice(`Verification code dispatched to ${email.trim()}`);
    } else {
      setErrorMsg(res.error || "Failed to send verification code");
    }
  };

  // Step 2: Verify OTP & complete registration
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessNotice(null);

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      setErrorMsg("Please enter the complete 6-digit numeric verification code.");
      return;
    }

    setLoading(true);

    const res = await verifyOtpAndRegisterAction(
      {
        full_name: fullName.trim(),
        email: email.trim(),
        roll_number: rollNumber.trim().toUpperCase(),
        hostel_block: hostelBlock,
        room_number: roomNumber.trim(),
        password,
        confirm_password: confirmPassword,
      },
      cleanOtp
    );

    setLoading(false);

    if (res.success) {
      router.push("/student/dashboard");
      router.refresh();
    } else {
      setErrorMsg(res.error || "Verification failed");
    }
  };

  // Resend OTP handler
  const handleResend = async () => {
    if (!canResend || resending) return;
    setResending(true);
    setErrorMsg(null);

    const res = await sendRegistrationOtpAction({
      full_name: fullName.trim(),
      email: email.trim(),
      roll_number: rollNumber.trim().toUpperCase(),
      hostel_block: hostelBlock,
      room_number: roomNumber.trim(),
      password,
      confirm_password: confirmPassword,
    });

    setResending(false);

    if (res.success) {
      setResendCooldown(60);
      setCanResend(false);
      setSuccessNotice(`A new 6-digit verification code has been sent to ${email.trim()}`);
    } else {
      setErrorMsg(res.error || "Failed to resend code");
    }
  };

  return (
    <div className="auth-theme relative min-h-screen flex flex-col justify-center items-center overflow-hidden p-4 py-10">
      <AuthIsometricBackground />
      <div className="relative z-10 w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-block hover:scale-105 transition-transform"
          >
            <QubiteLogo size="xl" />
          </Link>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">
            MealSync Student Registration
          </h1>
          <p className="text-xs text-zinc-500 font-medium">
            M. S. Ramaiah University of Applied Sciences (MSRUAS)
          </p>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-amber-50 border border-amber-200/80 rounded-full text-[11px] font-bold text-amber-900 shadow-xs">
              🏛️ University Access Only (@msruas.ac.in)
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="auth-card bg-white rounded-3xl border border-brand-border p-7 shadow-floating space-y-5">
          {step === "details" ? (
            /* STEP 1: STUDENT DETAILS FORM */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-brand-dark">Student Details</h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-brand-cream text-zinc-600 rounded-lg border border-brand-border">
                    Step 1 of 2
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Enter your university details to receive your 6-digit email verification code.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Aarav Sharma"
                      className="w-full h-10 pl-10 pr-3 rounded-xl border border-brand-border text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">MSRUAS Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder="student@msruas.ac.in"
                      className="w-full h-10 pl-10 pr-3 rounded-xl border border-brand-border text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Roll Number</label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="2024CS099"
                      className="w-full h-10 pl-10 pr-3 rounded-xl border border-brand-border text-xs text-brand-dark uppercase font-mono focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Hostel Block</label>
                  <select
                    value={hostelBlock}
                    onChange={(e) => setHostelBlock(e.target.value)}
                    className="w-full h-10 rounded-xl border border-brand-border bg-white px-3 text-xs font-medium text-brand-dark"
                  >
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Block C">Block C</option>
                    <option value="Block D">Block D</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Room No</label>
                  <div className="relative">
                    <DoorClosed className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="204"
                      className="w-full h-10 pl-10 pr-3 rounded-xl border border-brand-border text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      placeholder="Min 6 characters"
                      className="w-full h-10 pl-10 pr-3 rounded-xl border border-brand-border text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-700">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      placeholder="Re-enter password"
                      className="w-full h-10 pl-10 pr-3 rounded-xl border border-brand-border text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-brand-yellow hover:bg-brand-yellowHover text-brand-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                {loading ? "Sending Verification Code..." : "Continue & Send OTP Code"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-xs text-zinc-500 pt-1">
                Already registered?{" "}
                <Link href="/login" className="font-extrabold text-brand-dark hover:underline">
                  Sign in here
                </Link>
              </p>
            </form>
          ) : (
            /* STEP 2: 6-DIGIT OTP VERIFICATION */
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-brand-black mb-1">
                  <KeyRound className="h-6 w-6 stroke-[2.5] text-amber-700" />
                </div>
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-lg font-black text-brand-dark">Verify Your Email</h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-brand-cream text-zinc-600 rounded-lg border border-brand-border">
                    Step 2 of 2
                  </span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
                  We have sent a 6-digit verification code to: <br />
                  <strong className="text-brand-dark font-extrabold">{email}</strong>
                </p>
              </div>

              {successNotice && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>{successNotice}</span>
                </div>
              )}

              <div className="space-y-2 text-center">
                <label className="text-xs font-bold text-zinc-700 block">
                  Enter 6-Digit OTP Code
                </label>
                <div className="flex justify-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="w-56 h-14 text-center font-mono text-2xl tracking-[12px] font-black rounded-2xl border-2 border-brand-yellow/80 bg-brand-cream/40 text-brand-dark focus:outline-none focus:ring-4 focus:ring-brand-yellow/30 shadow-inner"
                    autoFocus
                    required
                  />
                </div>
                <p className="text-[11px] text-zinc-400">
                  Code expires in 10 minutes. Check your inbox or spam folder.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium text-center">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.trim().length !== 6}
                className="w-full py-3.5 rounded-xl bg-brand-yellow hover:bg-brand-yellowHover text-brand-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify & Complete Registration"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between pt-2 border-t border-brand-border text-xs text-zinc-500">
                <button
                  type="button"
                  onClick={() => {
                    setStep("details");
                    setErrorMsg(null);
                    setSuccessNotice(null);
                  }}
                  className="inline-flex items-center gap-1 font-bold text-zinc-600 hover:text-brand-dark transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit details</span>
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend || resending}
                  className="inline-flex items-center gap-1 font-bold text-brand-dark hover:underline disabled:opacity-40 disabled:no-underline"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
                  <span>
                    {canResend
                      ? "Resend Code"
                      : `Resend in ${resendCooldown}s`}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
