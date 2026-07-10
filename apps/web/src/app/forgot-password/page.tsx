"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Mail, CheckCircle2 } from "lucide-react";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate sending email verification link
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
              <h2 className="font-display text-2xl font-bold text-[#0b172a]">Forgot Password?</h2>
              <p className="text-slate-500 text-sm">
                Enter your registered email address and we'll send you a password reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
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

              <Button
                type="submit"
                variant="primary"
                className="w-full h-11 rounded-xl font-bold shadow-md shadow-orange-500/10"
                disabled={loading}
              >
                {loading ? "Sending link..." : "Send Reset Link"}
              </Button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-[#0b172a]">Check your email</h2>
              <p className="text-slate-500 text-sm">
                We've sent a password reset link to <strong className="text-slate-800">{email}</strong>. Please check your inbox.
              </p>
            </div>
            <Link href="/reset-password">
              <span className="inline-flex items-center text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors mt-2 cursor-pointer">
                Proceed to Reset Password screen <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        )}

        <div className="border-t border-slate-100 pt-6">
          <Link href="/login" className="text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
