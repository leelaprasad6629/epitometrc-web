"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Send,
  X,
  Minus,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  CornerDownLeft,
  Navigation,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/ai/types";

interface AIChatWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  showToast: (msg: string) => void;
}

export default function AIChatWindow({ onClose, onMinimize, showToast }: AIChatWindowProps) {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I am the Official Epitome TRC AI Guide. I see you are browsing: **${pathname}**. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What IT development services do you offer?",
    "Tell me about corporate training cohorts",
    "How does strategic recruitment work?",
    "What are the office hours?",
  ];

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: { pathname },
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.text || "No response generated." },
        ]);
      } else {
        showToast(data.error || "Failed to query AI assistant.");
      }
    } catch {
      showToast("AI service is temporarily unavailable. Failed to reach server node.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        role: "assistant",
        content: `Chat history cleared. Currently inspecting: **${pathname}**. Ask me anything!`,
      },
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-6 z-45 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white/95 shadow-2xl backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-orange-500 p-4 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Sparkles className="h-4.5 w-4.5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display leading-tight">EpitomeTRC AI</h3>
            <div className="flex items-center gap-1 text-[9.5px] font-semibold opacity-90">
              <Navigation className="h-2.5 w-2.5 animate-pulse text-green-300 fill-green-300" />
              <span>Active Context: {pathname}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClear}
            title="Clear Chat"
            className="rounded-lg p-1.5 hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={onMinimize}
            title="Minimize"
            className="rounded-lg p-1.5 hover:bg-white/10 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            title="Close"
            className="rounded-lg p-1.5 hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs bg-slate-50/40">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex flex-col max-w-[85%] space-y-1.5",
              msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            <div
              className={cn(
                "rounded-2xl p-3.5 leading-relaxed shadow-sm",
                msg.role === "user"
                  ? "bg-[#0b172a] text-white rounded-br-none"
                  : "bg-white text-slate-700 border border-slate-100 rounded-bl-none"
              )}
            >
              {msg.content}
            </div>
            {msg.role === "assistant" && (
              <button
                onClick={() => handleCopy(msg.content, idx)}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors px-1"
              >
                {copiedId === idx ? (
                  <>
                    <Check className="h-3 w-3 text-green-500" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copy
                  </>
                )}
              </button>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex max-w-[80%] items-center gap-1 bg-white border border-slate-100 rounded-2xl rounded-bl-none p-3 shadow-sm text-slate-400">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></span>
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"></span>
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-slate-50 space-y-1 bg-white">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggested Questions</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="rounded-lg border border-slate-100 bg-slate-50/50 px-2.5 py-1 text-[10.5px] font-semibold text-slate-600 hover:bg-slate-100 hover:border-slate-200 transition-all text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center gap-2 border-t border-slate-100 bg-white p-3.5"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI guide..."
          className="flex-1 text-xs border-0 outline-none focus:ring-0 p-1 text-slate-800"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0b172a] text-white hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:hover:bg-[#0b172a]"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </motion.div>
  );
}
