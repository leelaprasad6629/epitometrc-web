"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ShieldCheck, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import DnaCanvas from "@/components/common/DnaCanvas";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const errParam = searchParams?.get("error");
    if (errParam) {
      setError(errParam);
    }
  }, [searchParams]);

  const handleOAuthLogin = async (provider: "google" | "facebook") => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/oauth/url?provider=${provider}`);
      const data = await res.json();
      if (!res.ok || !data.success || !data.url) {
        throw new Error(data.error || `Failed to initialize ${provider} login`);
      }
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "OAuth redirection failed");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      const role = data.user.role;
      if (role === "Student") {
        router.push("/student/dashboard");
      } else if (role === "Admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/employee/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Left side banner (hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#060b13] via-[#09111e] to-[#141235] text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Glow ambient blobs */}
        <div className="absolute top-1/4 -left-10 w-72 h-72 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute bottom-1/4 -right-10 w-72 h-72 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-purple-500/5 blur-[120px] pointer-events-none z-0"></div>

        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        <DnaCanvas />

        <div className="relative z-10 flex items-center space-x-2">
          <span className="rounded-lg bg-slate-900/60 p-1.5 border border-slate-800/40 backdrop-blur-md">
            <ShieldCheck className="h-6 w-6 text-orange-500" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            Epitome<span className="text-orange-500">TRC</span>
          </span>
        </div>

        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl text-slate-100">
            Precision in Strategy,<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-rose-500 to-indigo-400">Excellence in Execution.</span>
          </h1>
          <p className="text-slate-300/90 text-sm leading-relaxed font-medium">
            Join the network of elite IT professionals and corporate leaders shaping the future of global enterprise solutions. Connect with experts, streamline operations, and master production-grade skills.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-6 text-xs text-slate-400 font-medium">
            <Link href="/consulting" className="hover:text-white transition-colors">Business Consulting</Link>
            <span className="h-1 w-1 rounded-full bg-slate-600"></span>
            <Link href="/services#it-services" className="hover:text-white transition-colors">IT Services</Link>
            <span className="h-1 w-1 rounded-full bg-slate-600"></span>
            <Link href="/services#recruitment" className="hover:text-white transition-colors">Recruitment</Link>
          </div>
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} EpitomeTRC. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <div className="flex items-center justify-center lg:justify-start space-x-2 lg:hidden mb-6">
              <span className="rounded-lg bg-[#0b172a] p-1.5">
                <ShieldCheck className="h-6 w-6 text-orange-500" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-[#0b172a]">
                Epitome<span className="text-orange-500">TRC</span>
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0b172a] tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-500 text-sm font-sans">
              Access your strategic dashboard and enterprise resources.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/10 w-full"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/10 w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 h-4 w-4 accent-orange-500"
                />
                <span className="text-xs text-slate-600 font-medium font-sans">Remember me</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl font-bold shadow-md shadow-orange-500/15"
            >
              {loading ? "Authenticating..." : "Login"}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span className="bg-white px-3">Or Continue With</span>
            </div>
          </div>

          <div className="w-full">
            <button
              type="button"
              onClick={() => handleOAuthLogin("google")}
              disabled={loading}
              className="flex items-center justify-center gap-2.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.77 14.93 1 12 1 7.24 1 3.2 3.74 1.25 7.72l3.7 2.87c.87-2.61 3.32-4.55 7.05-4.55z"
                />
                <path
                  fill="#4285F4"
                  d="M23.45 12.3c0-.82-.07-1.62-.21-2.4H12v4.54h6.43c-.28 1.48-1.12 2.73-2.37 3.58l3.7 2.87c2.16-1.99 3.69-4.92 3.69-8.59z"
                />
                <path
                  fill="#FBBC05"
                  d="M4.95 10.59c-.22-.67-.35-1.39-.35-2.13s.13-1.46.35-2.13l-3.7-2.87C.45 5.06 0 6.48 0 8s.45 2.94 1.25 4.54l3.7-2.95z"
                />
                <path
                  fill="#34A853"
                  d="M12 19.04c-3.73 0-6.18-1.94-7.05-4.55l-3.7 2.87C3.2 21.26 7.24 24 12 24c2.93 0 5.45-.98 7.26-2.65l-3.56-2.77c-1.07.72-2.45 1.46-3.7 1.46z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>

          <div className="text-center text-sm font-medium font-sans">
            <span className="text-slate-500">Don't have an account? </span>
            <Link
              href="/register"
              className="text-orange-500 hover:text-orange-600 transition-colors"
            >
              Register
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-4 text-[10px] font-bold text-slate-400 tracking-wider font-sans border-t border-slate-100 pt-6">
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">PRIVACY POLICY</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-600 transition-colors">TERMS OF SERVICE</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-slate-600 transition-colors">SUPPORT</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen bg-slate-50 items-center justify-center font-sans text-slate-500 text-xs">
        Loading form...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
