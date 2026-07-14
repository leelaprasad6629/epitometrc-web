"use client";

import { useState } from "react";
import { Sparkles, Play, Award, Clipboard, RefreshCw, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";

export default function AIMockInterviewWidget() {
  const [jobTitle, setJobTitle] = useState("Frontend Engineer Apprentice");
  const [sessionActive, setSessionActive] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [grading, setGrading] = useState<any | null>(null);
  const [scoreList, setScoreList] = useState<number[]>([]);
  const [error, setError] = useState("");

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");
    setChatHistory([]);
    setGrading(null);
    setScoreList([]);

    try {
      const initialQuestion = "Hello! Welcome to your technical mock screen. Let's start with a foundational question: in Next.js, what is the difference between a Server Component and a Client Component, and when should you use each?";
      setCurrentQuestion(initialQuestion);
      setSessionActive(true);
    } catch {
      setError("Mock interview manager offline.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAnswer.trim() || loading) return;

    setLoading(true);
    setError("");
    setGrading(null);

    const history = [...chatHistory, { question: currentQuestion, answer: studentAnswer }];

    try {
      const res = await fetch("/api/ai/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          chatHistory: history,
          studentAnswer,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGrading(data.result);
        setScoreList([...scoreList, data.result.score]);
        setChatHistory(history);
        setCurrentQuestion(data.result.nextQuestion);
        setStudentAnswer("");
      } else {
        setError(data.error || "Failed to process interview response.");
      }
    } catch {
      setError("Interview simulator is offline. Connection timed out.");
    } finally {
      setLoading(false);
    }
  };

  const averageScore = scoreList.length > 0
    ? Math.round(scoreList.reduce((a, b) => a + b, 0) / scoreList.length)
    : 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
          <h3 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
            AI Mock Interview Simulator
          </h3>
        </div>
        {sessionActive && scoreList.length > 0 && (
          <span className="px-2 py-0.5 rounded bg-orange-50 text-[10px] font-black text-orange-600 border border-orange-100 font-mono">
            Avg Score: {averageScore}%
          </span>
        )}
      </div>

      <p className="text-slate-400 text-xs font-sans leading-relaxed">
        Establish a simulated candidate technical interview environment, type your answer guides, and receive constructive evaluation scores.
      </p>

      {!sessionActive ? (
        <form onSubmit={handleStart} className="flex gap-2.5 items-end text-left">
          <div className="flex-1 space-y-1">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
              Target Interview Role
            </label>
            <input
              type="text"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Frontend Engineer Apprentice"
              className="w-full h-10 rounded-xl border border-slate-200 px-3.5 text-xs text-slate-600 focus:border-orange-500 outline-none"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-10 px-5 rounded-xl text-xs font-bold shrink-0"
          >
            Start Interview Session
          </Button>
        </form>
      ) : (
        <div className="space-y-4 text-left">
          {/* Active Question Box */}
          <div className="rounded-xl border border-blue-100 p-4 bg-blue-50/20 space-y-1.5 relative">
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-wider block">Simulator Question</span>
            <p className="text-slate-700 font-bold leading-relaxed">{currentQuestion}</p>
          </div>

          {/* Answer Form */}
          <form onSubmit={handleAnswerSubmit} className="space-y-2.5">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Type Your Response</label>
              <textarea
                required
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Type your explanation to this question..."
                className="w-full rounded-xl border border-slate-200 p-3 text-slate-600 font-sans leading-relaxed focus:border-orange-500 outline-none h-16 resize-none bg-slate-50/20"
              />
            </div>

            <div className="flex gap-2 justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSessionActive(false)}
                className="h-9 px-4 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Quit Session
              </Button>
              <Button
                type="submit"
                disabled={loading || !studentAnswer.trim()}
                className="h-9 px-5 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                {loading ? "Grading..." : "Submit Answer"} <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </form>

          {error && (
            <p className="text-red-500 text-[10px] font-semibold text-center mt-2">{error}</p>
          )}

          {/* Grading Feedback Panel */}
          <AnimatePresence>
            {grading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="rounded-xl border border-slate-100 p-4 bg-slate-50/50 space-y-2 font-sans"
              >
                <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Question Grading</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-[10px] font-black text-emerald-600 border border-emerald-100 font-mono">
                    Score: {grading.score}/100
                  </span>
                </div>
                <p className="text-slate-500 leading-relaxed text-[11px] font-sans">
                  {grading.feedback}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
