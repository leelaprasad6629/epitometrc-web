"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Lock, ShieldAlert, Sparkles, X } from "lucide-react";
import Button from "@/components/common/Button";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  onSignIn: () => void;
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  onSubscribe,
  onSignIn,
}: SubscriptionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          {/* Backdrop click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 cursor-default"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl z-10 text-left md:p-8"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-6">
              {/* Header Icon */}
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <Lock className="h-6 w-6 animate-bounce" />
              </div>

              {/* Title & Description */}
              <div className="space-y-2 text-left">
                <h3 className="font-display text-xl font-extrabold text-[#0b172a] sm:text-2xl tracking-tight flex items-center gap-2">
                  Continue Your Learning Journey
                  <Sparkles className="h-5 w-5 text-amber-500 shrink-0" />
                </h3>
                <p className="text-slate-500 text-sm font-sans leading-relaxed">
                  You&apos;ve reached the end of your free preview. Sign in or subscribe to unlock the complete course, including:
                </p>
              </div>

              {/* Benefits Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {[
                  "All video lessons",
                  "Comprehensive Notes",
                  "Hands-on Assignments",
                  "Downloadable resources",
                  "Quizzes & Mock Assessments",
                  "Verified Certificates",
                  "Cohort Progress tracking",
                  "AI Tutor Consultation"
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-left">
                    <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0" />
                    <span className="text-xs font-semibold text-slate-700 font-sans">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Security Banner */}
              <div className="flex gap-2.5 items-start p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <ShieldAlert className="h-4.5 w-4.5 text-orange-500 mt-0.5 shrink-0" />
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans font-medium">
                  Enrollment grants lifetime access to curriculum updates and our private corporate placement networks.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={onSubscribe}
                  variant="primary"
                  className="w-full h-11 rounded-xl text-xs font-black shadow-md shadow-orange-500/10"
                >
                  Subscribe Now
                </Button>
                <Button
                  onClick={onSignIn}
                  variant="outline"
                  className="w-full h-11 rounded-xl text-xs font-extrabold"
                >
                  Sign In
                </Button>
              </div>

              {/* Tertiary Action */}
              <div className="text-center pt-1">
                <button
                  onClick={onClose}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
