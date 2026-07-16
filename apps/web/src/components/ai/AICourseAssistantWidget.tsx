"use client";

import { useState } from "react";
import { Sparkles, HelpCircle, Send, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";

interface AICourseAssistantWidgetProps {
  courseTitle: string;
}

export default function AICourseAssistantWidget({ courseTitle }: AICourseAssistantWidgetProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState("");

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/ai/course-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseTitle, studentQuestion: question }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.result);
      } else {
        setError(data.error || "Failed to get response from course tutor assistant.");
      }
    } catch {
      setError("Course assistant tutor is offline. Connection timed out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 font-sans text-xs">
      <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
        <Sparkles className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
        <h3 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
          AI Course Tutor Assistant
        </h3>
      </div>
      
      <p className="text-slate-400 text-xs font-sans leading-relaxed">
        Currently studying: <strong className="text-slate-700">{courseTitle}</strong>. Ask any question about the syllabus materials, code parameters, or database concepts.
      </p>

      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          type="text"
          required
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What does 'use client' do in next.js?"
          className="flex-1 h-10 rounded-xl border border-slate-200 px-3.5 text-xs text-slate-600 focus:border-orange-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="h-10 px-4 rounded-xl bg-[#0b172a] text-white hover:bg-orange-500 transition-colors text-xs font-bold shrink-0 flex items-center justify-center disabled:opacity-50"
        >
          {loading ? "Thinking..." : <Send className="h-4 w-4" />}
        </button>
      </form>

      {error && (
        <p className="text-red-500 text-[10px] font-semibold text-center mt-2">{error}</p>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pt-4 border-t border-slate-50 space-y-4 text-left"
          >
            {/* Explanation Display */}
            <div className="rounded-xl border border-slate-100 p-4 bg-slate-50/50 space-y-3 font-sans">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Tutor Explanation</span>
              <div className="text-slate-600 text-[11px] font-sans leading-relaxed whitespace-pre-line">
                {result.explanation}
              </div>
            </div>

            {/* Suggested Topic */}
            {result.suggestedTopic && (
              <div className="flex gap-2 items-center text-[10px] font-bold text-slate-500 font-sans">
                <BookOpen className="h-4 w-4 text-orange-500" />
                <span>Next Read: {result.suggestedTopic}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
