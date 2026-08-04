"use client";

import React, { useState } from "react";
import { X, Check, Sparkles, AlertCircle, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MEMBERSHIP_PLANS, getPlanByName } from "@/lib/membershipConfig";
import Button from "@/components/common/Button";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  limitType?: "mock-interview" | "resume" | "general";
  onUpgradeSuccess?: () => void;
}

export default function UpgradeModal({ isOpen, onClose, limitType = "general", onUpgradeSuccess }: UpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"plans" | "checkout" | "success">("plans");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSelectPlan = (planName: string) => {
    if (planName === "Free Plan") return; // Already on Free Plan
    setSelectedPlan(planName);
    setCheckoutStep("checkout");
  };

  const handleSimulatePayment = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    
    try {
      const response = await fetch("/api/student/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName: selectedPlan })
      });

      if (response.ok) {
        setCheckoutStep("success");
        if (onUpgradeSuccess) onUpgradeSuccess();
      }
    } catch (err) {
      console.error("Mock checkout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#0b172a]/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <AnimatePresence mode="wait">
        {checkoutStep === "plans" && (
          <motion.div
            key="plans"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] z-10"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-orange-50/50 to-blue-50/30">
              <div className="flex gap-3">
                <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-600 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-display">
                    Upgrade to Premium
                  </h2>
                  <p className="text-sm text-slate-500 font-sans mt-0.5">
                    {limitType === "mock-interview" 
                      ? "You've used your 1 Free AI Mock Interview. Unlock professional coaching to continue."
                      : limitType === "resume"
                      ? "Your free resume optimization trial is completed. Unlock premium templates & tailored scoring."
                      : "Unlock full career copilot utilities and unrestricted platform features."}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-lg transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content (Scrollable plans cards list) */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/40">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MEMBERSHIP_PLANS.filter(p => p.name !== "Free Plan").map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 bg-white border ${
                      plan.recommended
                        ? "border-orange-500 shadow-lg shadow-orange-500/5 ring-1 ring-orange-500/20"
                        : "border-slate-200 hover:border-slate-350 hover:shadow-md"
                    }`}
                  >
                    {plan.recommended && (
                      <span className="absolute -top-3 left-6 px-3 py-1 bg-orange-500 text-white text-[10.5px] font-bold rounded-full uppercase tracking-wider font-sans">
                        RECOMMENDED
                      </span>
                    )}

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-display">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-slate-450 mt-1 font-sans">
                        Pricing Subject to Approval
                      </p>

                      <div className="mt-4 pb-4 border-b border-slate-100">
                        <span className="text-2xl font-bold text-slate-900">{plan.price}</span>
                        {plan.period !== "Forever" && (
                          <span className="text-xs text-slate-400 font-sans ml-1">/{plan.period}</span>
                        )}
                      </div>

                      {/* Specs */}
                      <ul className="mt-5 space-y-3">
                        {plan.features.slice(0, 5).map((feat, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-sans">
                            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8">
                      <Button
                        variant={plan.recommended ? "primary" : "secondary"}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold"
                        onClick={() => handleSelectPlan(plan.name)}
                      >
                        <span>Upgrade Now</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Extra Security Trust badges */}
              <div className="p-4 rounded-xl border border-slate-150 bg-white flex items-center gap-3 justify-center text-xs text-slate-500 font-sans">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>Secure SSL Checkouts • Fraud protection measures • Enterprise session lock guards</span>
              </div>
            </div>
          </motion.div>
        )}

        {checkoutStep === "checkout" && selectedPlan && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-10 font-sans"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <Lock className="h-4 w-4 text-orange-500" />
                <span>Simulated Upgrade</span>
              </h3>
              <button 
                onClick={() => setCheckoutStep("plans")}
                className="text-slate-450 hover:text-slate-650"
              >
                Back
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Plan Selected</span>
                <span className="text-base font-bold text-slate-900 mt-1 block">{selectedPlan}</span>
                <span className="text-xs text-slate-500 mt-1 block">Charges configured under dashboard keys.</span>
              </div>

              {/* Mock Credit Card fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Card Number</label>
                  <input 
                    type="text" 
                    placeholder="•••• •••• •••• 4242 (Simulator)" 
                    disabled 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      disabled 
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">CVV</label>
                    <input 
                      type="text" 
                      placeholder="•••" 
                      disabled 
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-orange-50 text-[11px] text-orange-700 flex items-start gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>Simulated payment test mode. Clicking confirm will instantly upgrade your account to Premium locally.</span>
              </div>

              <Button
                variant="primary"
                className="w-full py-2.5 text-xs font-bold mt-2"
                onClick={handleSimulatePayment}
                disabled={loading}
              >
                {loading ? "Authorizing Security Keys..." : `Confirm simulated Payment`}
              </Button>
            </div>
          </motion.div>
        )}

        {checkoutStep === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 p-8 text-center z-10 font-sans"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
              <Check className="h-8 w-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 font-display mt-6">
              Membership Activated!
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Your account has been successfully upgraded to <strong>{selectedPlan}</strong>. Your premium limits and features are now fully enabled.
            </p>

            <div className="mt-8">
              <Button
                variant="primary"
                className="w-full py-2.5 text-xs font-bold"
                onClick={onClose}
              >
                Start Using Premium Tools
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
