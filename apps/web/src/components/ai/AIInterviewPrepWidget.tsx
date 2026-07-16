"use client";

import { useState } from "react";
import { Sparkles, HelpCircle, Eye, EyeOff, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";

interface AIInterviewPrepWidgetProps {
  courses: { id: number; title: string }[];
}

export default function AIInterviewPrepWidget({ courses }: AIInterviewPrepWidgetProps) {
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.title || "");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [revealedAnswers, setRevealedAnswers] = useState<number[]>([]);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || loading) return;

    setLoading(true);
    setError("");
    setQuestions([]);
    setRevealedAnswers([]);

    try {
      const res = await fetch("/api/ai/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseTitle: selectedCourse }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setQuestions(data.result.questions);
      } else {
        setError(data.error || "Failed to generate questions.");
      }
    } catch {
      setError("AI Interview Prep is offline. Connection timed out.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswer = (id: number) => {
    if (revealedAnswers.includes(id)) {
      setRevealedAnswers(revealedAnswers.filter((item) => item !== id));
    } else {
      setRevealedAnswers([...revealedAnswers, id]);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6 font-sans text-xs">
      <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
        <Sparkles className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
        <h3 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
          AI Interview Prep Generator
        </h3>
      </div>
      <p className="text-slate-400 text-xs font-sans leading-relaxed">
        Select a target training topic from your active modules below to generate technical practice questions and comprehensive answer outlines.
      </p>

      <form onSubmit={handleGenerate} className="flex gap-2.5 items-end">
        <div className="flex-1 space-y-1.5 text-left">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
            Select Course Topic
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full h-10 rounded-xl border border-slate-200 px-3 py-1.5 outline-none bg-white text-slate-600 font-semibold"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.title}>{c.title}</option>
            ))}
          </select>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="h-10 px-5 rounded-xl text-xs font-bold shrink-0"
        >
          {loading ? "Generating..." : "Generate Practice Questions"}
        </Button>
      </form>

      {error && (
        <p className="text-red-500 text-[10px] font-semibold text-center mt-2">{error}</p>
      )}

      <AnimatePresence>
        {questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="space-y-3.5 pt-4 border-t border-slate-50"
          >
            {questions.map((q) => (
              <div key={q.id} className="rounded-xl border border-slate-100 p-4 bg-slate-50/50 space-y-2.5 text-left">
                <div className="flex justify-between items-start gap-4">
                  <span className="flex items-center gap-1.5 font-bold text-slate-700">
                    <HelpCircle className="h-4.5 w-4.5 text-orange-500 shrink-0" /> Question #{q.id}: {q.question}
                  </span>
                  <button
                    onClick={() => toggleAnswer(q.id)}
                    className="inline-flex items-center justify-center p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                    title="Toggle Answer Key"
                  >
                    {revealedAnswers.includes(q.id) ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {revealedAnswers.includes(q.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden text-[10.5px] text-slate-500 font-sans leading-relaxed pl-6 border-l-2 border-orange-500/30 pt-1"
                    >
                      <strong className="text-slate-600 block mb-0.5">Answer Guide:</strong>
                      {q.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
