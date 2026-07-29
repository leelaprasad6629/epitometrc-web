"use client";

import React, { useState } from "react";
import { Sparkles, Check, X, Wand2, ArrowRight, Lightbulb, ShieldCheck, Loader2 } from "lucide-react";
import { ParsedResume } from "@/lib/ai/store/resumeStore";

export interface AISuggestionItem {
  id: string;
  category: "summary" | "experience" | "skills" | "keywords" | "projects";
  title: string;
  originalText?: string;
  suggestedText: string;
  explanation: string;
  index?: number;
}

interface AIEnhancementModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ParsedResume;
  onAcceptSuggestion: (suggestion: AISuggestionItem) => void;
  onRejectSuggestion: (suggestionId: string) => void;
}

export default function AIEnhancementModal({
  isOpen,
  onClose,
  resumeData,
  onAcceptSuggestion,
  onRejectSuggestion,
}: AIEnhancementModalProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AISuggestionItem[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  if (!isOpen) return null;

  const generateEnhancements = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/resume-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "optimize-jd",
          targetRole: resumeData.headline || "Software Engineer",
          bio: resumeData.bio,
          experience: resumeData.experience,
          projects: resumeData.projects,
          skills: resumeData.technicalSkills,
          education: resumeData.education,
        }),
      });

      const data = await res.json();
      const generatedList: AISuggestionItem[] = [];

      if (data.success && data.result) {
        const r = data.result;

        // 1. Summary suggestion
        if (r.alreadyAvailable && r.alreadyAvailable.length > 0) {
          r.alreadyAvailable.forEach((s: any, idx: number) => {
            generatedList.push({
              id: `sug_sum_${idx}`,
              category: "summary",
              title: "Enhanced Professional Summary",
              originalText: resumeData.bio || "Current Summary",
              suggestedText: s.suggestedText || s.originalText,
              explanation: s.explanation || "Improves ATS keyword matching and recruiter impact.",
            });
          });
        }

        // 2. Experience bullet suggestions
        if (r.betterPresentation && r.betterPresentation.length > 0) {
          r.betterPresentation.forEach((s: any, idx: number) => {
            generatedList.push({
              id: `sug_exp_${idx}`,
              category: "experience",
              title: `Experience Bullet Improvement #${idx + 1}`,
              originalText: s.originalText || "Weak bullet point",
              suggestedText: s.suggestedText,
              explanation: s.explanation || "Uses strong action verbs and STAR achievement framing.",
              index: s.index ?? 0,
            });
          });
        }

        // 3. Missing skills / keywords suggestions
        if (r.missingRequirements && r.missingRequirements.length > 0) {
          r.missingRequirements.forEach((m: any, idx: number) => {
            generatedList.push({
              id: `sug_skill_${idx}`,
              category: "skills",
              title: `Add High-Impact Skill: ${m.skillName}`,
              suggestedText: m.skillName,
              explanation: m.reason || "Frequently required in target role job descriptions.",
            });
          });
        }
      }

      // Fallback suggestions if AI returns empty array
      if (generatedList.length === 0) {
        generatedList.push({
          id: "sug_fallback_1",
          category: "summary",
          title: "Strengthen Summary with Action Metrics",
          originalText: resumeData.bio,
          suggestedText: `${resumeData.bio || "Motivated Engineer"} Experienced in building high-performance scalable web applications, optimizing API latency, and delivering robust full-stack solutions.`,
          explanation: "Adds quantitative leadership and architectural depth.",
        });
        generatedList.push({
          id: "sug_fallback_2",
          category: "keywords",
          title: "Include Industry Keywords",
          suggestedText: "CI/CD, REST APIs, Microservices, System Architecture, Unit Testing",
          explanation: "Increases keyword density score for automated screening.",
        });
      }

      setSuggestions(generatedList);
      setHasGenerated(true);
    } catch (err) {
      console.error("AI enhancement error:", err);
      alert("Could not load AI suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredSuggestions = activeCategory === "all"
    ? suggestions
    : suggestions.filter(s => s.category === activeCategory);

  const handleAccept = (item: AISuggestionItem) => {
    onAcceptSuggestion(item);
    setSuggestions(prev => prev.filter(s => s.id !== item.id));
  };

  const handleReject = (id: string) => {
    onRejectSuggestion(id);
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full p-6 border border-gray-200 dark:border-gray-800 transition-all my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl text-white shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                AI Resume Enhancement Assistant
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Granular AI suggestions. You retain full control to Accept or Reject each change.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Initial Trigger State */}
        {!hasGenerated && !loading && (
          <div className="text-center py-10 px-4">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Wand2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Enhance Resume for ATS & Impact
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              AI will analyze your grammar, bullet point achievements, ATS keyword compatibility, and suggest actionable improvements.
            </p>
            <button
              onClick={generateEnhancements}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-500 hover:to-purple-500 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Generate AI Suggestions
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Analyzing resume content & computing ATS optimization suggestions...
            </p>
          </div>
        )}

        {/* Generated Suggestions List */}
        {hasGenerated && !loading && (
          <div>
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
              {["all", "summary", "experience", "skills", "keywords"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    activeCategory === cat
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {filteredSuggestions.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  All suggestions in this category reviewed!
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                {filteredSuggestions.map(s => (
                  <div
                    key={s.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800/70 rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:border-indigo-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-md">
                        {s.title}
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                        {s.explanation}
                      </span>
                    </div>

                    {s.originalText && (
                      <div className="mb-2 p-2.5 bg-red-50/60 dark:bg-red-950/20 rounded-lg text-xs text-gray-700 dark:text-gray-300 border-l-2 border-red-400">
                        <span className="font-bold text-red-700 dark:text-red-400">Current: </span>
                        {s.originalText}
                      </div>
                    )}

                    <div className="p-2.5 bg-emerald-50/70 dark:bg-emerald-950/20 rounded-lg text-xs text-gray-800 dark:text-gray-200 border-l-2 border-emerald-500 mb-3">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">AI Suggested: </span>
                      {s.suggestedText}
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => handleReject(s.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-red-600 bg-gray-200/70 dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleAccept(s)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm hover:shadow transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Accept Suggestion
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between items-center text-xs text-gray-500">
          <span>AI Suggestions leave your underlying profile intact until explicitly accepted.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 font-medium"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
