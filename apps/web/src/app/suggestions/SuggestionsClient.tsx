"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  Sparkles,
  Award,
  CheckCircle2,
  AlertCircle,
  Send,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  ChevronRight,
  FileText
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import Link from "next/link";
import { ALLOWED_CATEGORIES } from "@/app/api/suggestions/route";

export default function SuggestionsClient() {
  const [formData, setFormData] = useState({
    title: "",
    category: "Product Improvement",
    description: "",
    currentProblem: "",
    proposedSolution: "",
    expectedOutcome: "",
    benefits: "",
    whyImplement: "",
    additionalNotes: "",
    userName: "",
    userEmail: ""
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    submissionId: string;
    status: string;
    loaNotice: string;
  } | null>(null);

  // Auto-detect logged in user profile
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setIsLoggedIn(true);
          setFormData((prev) => ({
            ...prev,
            userName: data.user.name || "",
            userEmail: data.user.email || ""
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit suggestion");
      }

      setSuccessResult({
        submissionId: data.submissionId,
        status: data.status || "Pending",
        loaNotice: data.loaNotice
      });
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting your suggestion.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessResult(null);
    setFormData((prev) => ({
      ...prev,
      title: "",
      description: "",
      currentProblem: "",
      proposedSolution: "",
      expectedOutcome: "",
      benefits: "",
      whyImplement: "",
      additionalNotes: ""
    }));
  };

  return (
    <>
      <Navbar />
      <main className="pt-20 font-sans bg-slate-50/50 min-h-screen pb-20">
        
        {/* Hero Banner */}
        <section className="bg-[#0b172a] text-white py-16 md:py-24 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-[130px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[130px] pointer-events-none" />

          <Container className="relative z-10 space-y-6 max-w-4xl mx-auto text-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider shadow-sm">
              <Lightbulb className="h-4 w-4 text-orange-400 animate-pulse" />
              <span>EpitomeTRC Innovation &amp; Idea Portal</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Shape the Future of <br />
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-indigo-400 bg-clip-text text-transparent">
                EpitomeTRC Platform.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans max-w-2xl mx-auto">
              We deeply value ground-breaking ideas. Every proposal is rigorously audited by our senior innovation team. Outstanding contributions that create significant value may receive a formal <strong>Letter of Appreciation (LOA)</strong>.
            </p>

            {/* Value Guarantees Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6 text-left font-sans text-xs">
              {[
                { title: "We Value Innovation", desc: "Every idea is audited by engineering & product leads." },
                { title: "Careful Review", desc: "Structured status workflow with timestamps." },
                { title: "Value Implementation", desc: "Selected proposals transition directly into build roadmaps." },
                { title: "LOA Eligibility", desc: "Formal Letter of Appreciation awarded for high-impact ideas." }
              ].map((val, idx) => (
                <div key={idx} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-1 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span>{val.title}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{val.desc}</p>
                </div>
              ))}
            </div>

          </Container>
        </section>

        {/* Main Content Area */}
        <section className="py-12 md:py-16">
          <Container className="max-w-4xl mx-auto">
            
            {successResult ? (
              /* Success Confirmation Screen */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl space-y-8 text-center"
              >
                <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <div className="space-y-3 max-w-xl mx-auto">
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0b172a]">
                    Thank You for Your Suggestion!
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Your idea has been successfully submitted to the <strong>EpitomeTRC Innovation Team</strong>.
                  </p>
                </div>

                {/* Status Badge Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md mx-auto space-y-3 text-left font-sans text-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Submission Tracking Code</span>
                    <span className="font-mono font-extrabold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-lg text-xs">
                      {successResult.submissionId}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Current Status</span>
                    <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600 font-extrabold text-[11px]">
                      ⏱️ {successResult.status} Review
                    </span>
                  </div>
                </div>

                {/* LOA Notice Box */}
                <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-indigo-500/10 border border-orange-200/80 rounded-2xl p-6 max-w-xl mx-auto text-left space-y-2">
                  <div className="flex items-center gap-2 font-display font-bold text-[#0b172a] text-sm">
                    <Award className="h-5 w-5 text-orange-500 shrink-0" />
                    <span>Letter of Appreciation (LOA) Notice</span>
                  </div>
                  <p className="text-slate-600 text-xs font-sans leading-relaxed">
                    {successResult.loaNotice}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  {isLoggedIn ? (
                    <Button href="/student/suggestions" variant="primary" className="h-11 px-6 rounded-xl font-bold bg-[#0b172a] hover:bg-orange-500">
                      View My Submissions Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button href="/login" variant="primary" className="h-11 px-6 rounded-xl font-bold bg-[#0b172a] hover:bg-orange-500">
                      Login to Track Submission Status
                    </Button>
                  )}
                  <Button onClick={handleReset} variant="outline" className="h-11 px-6 rounded-xl font-bold border-slate-300 text-slate-700 hover:bg-slate-50">
                    Submit Another Idea
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* Structured Idea Submission Form */
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8">
                
                <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h2 className="font-display text-xl font-bold text-[#0b172a]">
                      Idea Submission Form
                    </h2>
                    <p className="text-slate-500 text-xs font-sans mt-0.5">
                      Please complete all mandatory fields with clear detail to ensure an effective evaluation.
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full">
                    One-Way Communication Platform
                  </span>
                </div>

                {error && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 font-sans text-xs">
                  
                  {/* User Details */}
                  {!isLoggedIn && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          name="userName"
                          required
                          placeholder="E.g. Sarah Jenkins"
                          value={formData.userName}
                          onChange={handleChange}
                          className="w-full h-10 rounded-xl border border-slate-200 px-3 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white font-semibold text-slate-800"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                          Your Email Address *
                        </label>
                        <input
                          type="email"
                          name="userEmail"
                          required
                          placeholder="name@company.com"
                          value={formData.userEmail}
                          onChange={handleChange}
                          className="w-full h-10 rounded-xl border border-slate-200 px-3 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none bg-white font-semibold text-slate-800"
                        />
                      </div>
                    </div>
                  )}

                  {/* Idea Title & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                    <div className="sm:col-span-8 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                          Idea Title *
                        </label>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {formData.title.length}/150
                        </span>
                      </div>
                      <input
                        type="text"
                        name="title"
                        required
                        maxLength={150}
                        placeholder="E.g. Automated Skill Assessment Dashboard for Internship Applications"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full h-11 rounded-xl border border-slate-200 px-3 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none font-semibold text-slate-800"
                      />
                    </div>

                    <div className="sm:col-span-4 space-y-1.5">
                      <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full h-11 rounded-xl border border-slate-200 px-3 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none font-semibold text-slate-800 bg-white"
                      >
                        {ALLOWED_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Describe Your Idea */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                        Describe Your Idea *
                      </label>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {formData.description.length}/3000
                      </span>
                    </div>
                    <textarea
                      name="description"
                      required
                      maxLength={3000}
                      rows={3}
                      placeholder="Provide a comprehensive summary of the core concept..."
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none font-sans leading-relaxed text-slate-700 resize-none"
                    />
                  </div>

                  {/* Current Problem & Proposed Solution */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                        Current Problem *
                      </label>
                      <textarea
                        name="currentProblem"
                        required
                        rows={3}
                        placeholder="What bottleneck or inefficiency exists currently?"
                        value={formData.currentProblem}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none font-sans leading-relaxed text-slate-700 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                        Proposed Solution *
                      </label>
                      <textarea
                        name="proposedSolution"
                        required
                        rows={3}
                        placeholder="How specifically should this problem be solved?"
                        value={formData.proposedSolution}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none font-sans leading-relaxed text-slate-700 resize-none"
                      />
                    </div>
                  </div>

                  {/* Expected Outcome & Benefits */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                        Expected Outcome *
                      </label>
                      <textarea
                        name="expectedOutcome"
                        required
                        rows={3}
                        placeholder="What tangible result will this generate?"
                        value={formData.expectedOutcome}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none font-sans leading-relaxed text-slate-700 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                        Key Benefits *
                      </label>
                      <textarea
                        name="benefits"
                        required
                        rows={3}
                        placeholder="Who benefits and what is the strategic value?"
                        value={formData.benefits}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none font-sans leading-relaxed text-slate-700 resize-none"
                      />
                    </div>
                  </div>

                  {/* Why implement */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                      Why Should This Be Implemented? *
                    </label>
                    <textarea
                      name="whyImplement"
                      required
                      rows={2}
                      placeholder="Explain why this proposal warrants prioritization by the Innovation Team..."
                      value={formData.whyImplement}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none font-sans leading-relaxed text-slate-700 resize-none"
                    />
                  </div>

                  {/* Additional Notes (Optional) */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      name="additionalNotes"
                      rows={2}
                      placeholder="Any supplementary references, links, or details..."
                      value={formData.additionalNotes}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none font-sans leading-relaxed text-slate-700 resize-none"
                    />
                  </div>

                  {/* Submit Action */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>One-way submission. All proposals strictly audited.</span>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      variant="primary"
                      className="w-full sm:w-auto h-11 px-8 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20"
                    >
                      {loading ? "Submitting Proposal..." : "Submit Proposal"} <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                </form>

              </div>
            )}

          </Container>
        </section>

      </main>
      <Footer />
    </>
  );
}
