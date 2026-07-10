"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, Lock, CheckCircle2, ShieldAlert } from "lucide-react";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Strong password validation
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      setError("Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Simulate reset request
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
        <div className="flex justify-center space-x-2">
          <span className="rounded-lg bg-[#0b172a] p-1.5">
            <ShieldCheck className="h-6 w-6 text-orange-500" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-[#0b172a]">
            Epitome<span className="text-orange-500">TRC</span>
          </span>
        </div>

        {!success ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-[#0b172a]">Reset Password</h2>
              <p className="text-slate-500 text-sm">
                Enter your new secure password below to complete the reset process.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100 flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  New Password
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
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/10 w-full"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-11 rounded-xl font-bold shadow-md shadow-orange-500/10"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-[#0b172a]">Password Reset Complete</h2>
              <p className="text-slate-500 text-sm">
                Your password has been successfully updated. You can now log in with your new credentials.
              </p>
            </div>
            <Button
              onClick={() => router.push("/login")}
              variant="primary"
              className="w-full h-11 rounded-xl font-bold"
            >
              Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
