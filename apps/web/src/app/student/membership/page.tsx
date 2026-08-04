"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, Check, ShieldCheck, HelpCircle, Activity, 
  Info, Award, Lock, Unlock, ArrowRight, Loader2, Calendar 
} from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/common/Button";
import { MEMBERSHIP_PLANS, getPlanByName } from "@/lib/membershipConfig";
import UpgradeModal from "@/components/membership/UpgradeModal";

export default function StudentMembershipPage() {
  const [membership, setMembership] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeLimitType, setUpgradeLimitType] = useState<"mock-interview" | "resume" | "general">("general");

  const fetchMembership = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/student/membership");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMembership(data.membership);
        }
      } else {
        setError("Failed to retrieve membership data.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Network offline.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembership();
  }, []);

  const handleOpenUpgrade = (limitType: "mock-interview" | "resume" | "general" = "general") => {
    setUpgradeLimitType(limitType);
    setUpgradeOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
        <span className="text-sm text-slate-500 font-sans">Syncing membership credentials...</span>
      </div>
    );
  }

  const activePlan = getPlanByName(membership?.planName || "Free Plan");
  const isFreePlan = activePlan.name === "Free Plan";

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto py-2">
      {/* 1. Header Hero Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-2.5 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/35 text-[10px] font-bold rounded-full uppercase tracking-wider">
              MEMBERSHIP PROFILE
            </span>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-white mt-1">
              Your Active Plan: <span className="text-orange-400">{activePlan.name}</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-350 max-w-xl">
              Unlock the full potential of custom mock interviews, live ATS scans, resume optimizations, and personal career guides.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            {isFreePlan && (
              <Button
                variant="primary"
                className="flex items-center gap-2 px-5 py-3 text-xs font-bold shadow-lg shadow-orange-500/15"
                onClick={() => handleOpenUpgrade("general")}
              >
                <Sparkles className="h-4 w-4 animate-bounce" />
                <span>Upgrade to Premium</span>
              </Button>
            )}
            {!isFreePlan && (
              <div className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/40 text-xs font-semibold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 animate-pulse" />
                <span>Premium Active</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Active Plan Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mock Interview Stats */}
        <div className="p-6 rounded-2xl border border-slate-150 bg-white shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-450 uppercase tracking-wider">AI Mock Interviews</span>
              <Activity className="h-4 w-4 text-orange-500" />
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900">{membership?.mockInterviewsUsed || 0}</span>
              <span className="text-xs text-slate-400">/ {activePlan.mockInterviewLimit === -1 ? "∞" : activePlan.mockInterviewLimit} used</span>
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
                style={{ 
                  width: `${activePlan.mockInterviewLimit === -1 
                    ? 100 
                    : Math.min(((membership?.mockInterviewsUsed || 0) / activePlan.mockInterviewLimit) * 100, 100)}%` 
                }}
              />
            </div>
            <span className="text-[11px] text-slate-400 font-sans block">
              {activePlan.mockInterviewLimit === -1 
                ? "Unlimited sessions active" 
                : `${activePlan.mockInterviewLimit - (membership?.mockInterviewsUsed || 0)} free mock interview attempts left`}
            </span>
          </div>
        </div>

        {/* Resume Scan Stats */}
        <div className="p-6 rounded-2xl border border-slate-150 bg-white shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-450 uppercase tracking-wider">Resume Optimizations</span>
              <Award className="h-4 w-4 text-blue-500" />
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900">{membership?.resumesOptimizedUsed || 0}</span>
              <span className="text-xs text-slate-400">/ {activePlan.resumeOptimizationLimit === -1 ? "∞" : activePlan.resumeOptimizationLimit} used</span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ 
                  width: `${activePlan.resumeOptimizationLimit === -1 
                    ? 100 
                    : Math.min(((membership?.resumesOptimizedUsed || 0) / activePlan.resumeOptimizationLimit) * 100, 100)}%` 
                }}
              />
            </div>
            <span className="text-[11px] text-slate-400 font-sans block">
              {activePlan.resumeOptimizationLimit === -1 
                ? "Unlimited scans active" 
                : `${activePlan.resumeOptimizationLimit - (membership?.resumesOptimizedUsed || 0)} resume tailoring operations left`}
            </span>
          </div>
        </div>

        {/* Expiry Details */}
        <div className="p-6 rounded-2xl border border-slate-150 bg-white shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-450 uppercase tracking-wider">Validity Period</span>
              <Calendar className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-4">
              <span className="text-lg font-bold text-slate-800 block">
                {membership?.validUntil 
                  ? new Date(membership.validUntil).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "Lifetime (Free Plan)"}
              </span>
              <span className="text-xs text-slate-400 mt-1 block">Valid status: Active</span>
            </div>
          </div>

          <div className="mt-6 p-3 bg-emerald-50 border border-emerald-100/50 rounded-xl flex items-center gap-2 text-[10.5px] text-emerald-700 font-sans">
            <ShieldCheck className="h-4 w-4" />
            <span>Secure account subscription validation active</span>
          </div>
        </div>
      </div>

      {/* 3. Detailed Plans Matrix Grid */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Compare Platform Memberships
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-1">
            Choose the plan that matches your recruitment preparation and career search scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {MEMBERSHIP_PLANS.map((plan) => {
            const isPlanActive = membership?.planName === plan.name;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-5 flex flex-col justify-between bg-white border transition-all duration-300 ${
                  isPlanActive 
                    ? "border-emerald-500 bg-emerald-50/5 ring-1 ring-emerald-500/20"
                    : plan.recommended
                    ? "border-orange-500 shadow-md ring-1 ring-orange-500/10"
                    : "border-slate-200 hover:border-slate-350"
                }`}
              >
                {plan.recommended && (
                  <span className="absolute -top-3 left-4 px-2.5 py-0.5 bg-orange-500 text-white text-[9.5px] font-bold rounded-full uppercase tracking-wider">
                    RECOMMENDED
                  </span>
                )}
                {isPlanActive && (
                  <span className="absolute -top-3 left-4 px-2.5 py-0.5 bg-emerald-500 text-white text-[9.5px] font-bold rounded-full uppercase tracking-wider">
                    ACTIVE
                  </span>
                )}

                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    {plan.name}
                  </h3>
                  <div className="mt-3 pb-3 border-b border-slate-100 flex items-baseline gap-1">
                    <span className="text-xl font-extrabold text-slate-950">{plan.price}</span>
                    {plan.period !== "Forever" && (
                      <span className="text-xs text-slate-400">/{plan.period}</span>
                    )}
                  </div>

                  <ul className="mt-4 space-y-2.5">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-slate-650 font-sans">
                        <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.restrictions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-dashed border-slate-150">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1.5">Restrictions</span>
                      <ul className="space-y-1.5">
                        {plan.restrictions.map((rest, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-450 font-sans">
                            <Lock className="h-3 w-3 text-slate-400 shrink-0 mt-0.5" />
                            <span>{rest}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4">
                  {isPlanActive ? (
                    <div className="w-full text-center py-2.5 text-xs font-bold text-emerald-600 border border-emerald-200 bg-emerald-50/50 rounded-xl flex items-center justify-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Current Plan</span>
                    </div>
                  ) : plan.name === "Free Plan" ? (
                    <div className="w-full text-center py-2.5 text-xs font-bold text-slate-450 border border-slate-150 rounded-xl">
                      Standard Default Tier
                    </div>
                  ) : (
                    <Button
                      variant={plan.recommended ? "primary" : "secondary"}
                      className="w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1"
                      onClick={() => handleOpenUpgrade("general")}
                    >
                      <span>Activate Plan</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Membership Upgrade Dialog */}
      <UpgradeModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        limitType={upgradeLimitType}
        onUpgradeSuccess={fetchMembership}
      />
    </div>
  );
}
