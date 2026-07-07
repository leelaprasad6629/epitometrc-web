"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import Button from "@/components/common/Button";

type NewsletterProps = {
  title?: string;
  description?: string;
  dark?: boolean;
};

export default function Newsletter({
  title = "Executive Briefing",
  description = "Join 15,000+ leaders receiving strategic insights and industry updates.",
  dark = true,
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <div
      className={`rounded-2xl p-6 ${
        dark ? "bg-[#0b172a] text-white" : "border border-slate-200 bg-white"
      }`}
    >
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className={`mt-2 font-sans text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
        {description}
      </p>
      {submitted ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 font-sans text-sm text-orange-400"
        >
          Thank you for subscribing!
        </motion.p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            aria-label="Email address"
            className={`w-full rounded-xl border px-4 py-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 ${
              dark
                ? "border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
                : "border-slate-200 bg-white text-slate-800"
            }`}
          />
          <Button type="submit" variant="primary" className="w-full">
            Subscribe Now
          </Button>
        </form>
      )}
    </div>
  );
}
