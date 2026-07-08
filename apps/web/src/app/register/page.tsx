"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Mail, Lock, User, Check, ShieldAlert } from "lucide-react";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";

type UserRole = "Student" | "Employer" | "Organization";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("Student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!agree) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Route based on role
      if (role === "Student") {
        router.push("/student/dashboard");
      } else if (role === "Employer") {
        router.push("/employee/dashboard");
      } else {
        router.push("/employee/dashboard"); // Organization acts as employer/employee portal
      }
    }, 800);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Left side banner (hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 bg-[#0b172a] text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

        <div className="relative z-10 flex items-center space-x-2">
          <span className="rounded-lg bg-slate-900 p-1.5 border border-slate-800">
            <ShieldCheck className="h-6 w-6 text-orange-500" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            Epitome<span className="text-orange-500">TRC</span>
          </span>
        </div>

        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Precision in Strategy,<br />
            <span className="text-orange-500">Excellence in Execution.</span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Join a global network of professionals where strategic depth meets operational brilliance. Our platform empowers career growth and business transformation through elite recruitment and IT services.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            <div>
              <div className="text-2xl font-bold text-orange-500">500+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">Global Partners</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500">15k+</div>
              <div className="text-xs text-slate-400 mt-1 uppercase font-semibold tracking-wider">Placements</div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
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
              Create Account
            </h2>
            <p className="text-slate-500 text-sm font-sans">
              Step into the future of corporate excellence. Set up your profile in minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100 flex items-start gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Role Selection Buttons */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Role Selection
              </label>
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                {(["Student", "Employer", "Organization"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      role === r
                        ? "bg-white text-orange-600 shadow-sm border border-slate-100"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/10 w-full"
                />
              </div>
            </div>

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
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/10 w-full"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-sans">
                Must be at least 8 characters with a mix of letters and numbers.
              </p>
            </div>

            <label className="flex items-start space-x-2.5 cursor-pointer py-1">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 h-4 w-4 mt-0.5 accent-orange-500"
              />
              <span className="text-xs text-slate-500 font-medium font-sans leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-orange-500 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-orange-500 hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl font-bold shadow-md shadow-orange-500/15"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <div className="text-center text-sm font-medium font-sans border-t border-slate-100 pt-6">
            <span className="text-slate-500">Already have an account? </span>
            <Link
              href="/login"
              className="text-orange-500 hover:text-orange-600 transition-colors"
            >
              Login
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-4 text-[10px] font-bold text-slate-400 tracking-wider font-sans border-t border-slate-100 pt-4">
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3 text-green-500" /> ISO CERTIFIED
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3 text-green-500" /> SECURE SSL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
