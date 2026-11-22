"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { loginAction } from "@/app/actions/auth-actions";
import { QubiteLogo } from "@/components/shared/qubite-logo";
import { AuthIsometricBackground } from "@/components/shared/auth-isometric-background";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await loginAction({ email, password });
    setLoading(false);

    if (res.success) {
      if (res.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
      router.refresh();
    } else {
      setErrorMsg(res.error || "Login failed");
    }
  };

  return (
    <div className="auth-theme relative min-h-screen flex flex-col justify-center items-center overflow-hidden p-4">
      <AuthIsometricBackground />
      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block hover:scale-105 transition-transform">
            <QubiteLogo size="xl" />
          </Link>
          <h1 className="text-2xl font-black text-brand-dark tracking-tight">
            Meal<span className="text-[#EF6A32]">Sync</span> <span className="text-[#71645F]">Portal</span>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-brand-dark">Sign In</h2>
              <p className="text-xs text-zinc-400">Enter your official @msruas.ac.in credentials</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">MSRUAS Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="name@msruas.ac.in"
                  className="w-full h-10 pl-10 pr-3 rounded-xl border border-brand-border text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full h-10 pl-10 pr-3 rounded-xl border border-brand-border text-xs text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-xs text-zinc-500 pt-1">
              New resident student?{" "}
              <Link href="/register" className="font-extrabold text-brand-dark hover:underline">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
