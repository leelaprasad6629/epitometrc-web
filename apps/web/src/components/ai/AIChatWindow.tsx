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
  Navigation,
  Headphones,
  UserCheck,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Message } from "@/lib/ai/types";
import { getClientMetadata } from "@/lib/clientMetadata";

interface AIChatWindowProps {
  onClose: () => void;
  onMinimize: () => void;
  showToast: (msg: string) => void;
}

export default function AIChatWindow({ onClose, onMinimize, showToast }: AIChatWindowProps) {
  const pathname = usePathname();
  const [sessionId] = useState<string>(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I am the Official Epitome TRC AI Guide. I see you are browsing: **${pathname}**. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Intelligent Escalation States
  const [showEscalation, setShowEscalation] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const [escalationSubmitted, setEscalationSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("Recruitment & Staffing");
  const [conversationSummary, setConversationSummary] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "What IT development services do you offer?",
    "Tell me about corporate training cohorts",
    "How does strategic recruitment work?",
    "Speak with a specialist mentor",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, showEscalation]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const clientMetadata = getClientMetadata();

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          context: { pathname },
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        const text = data.text || "No response generated.";
        setMessages((prev) => [...prev, { role: "assistant", content: text }]);

        // Pre-fill department recommendation if AI confidence is low or escalation is triggered
        if (data.shouldEscalate) {
          setShowEscalation(true);
          if (data.detectedDepartment) setDepartment(data.detectedDepartment);
          if (data.conversationSummary) setConversationSummary(data.conversationSummary);
        }

        // Log session & message to CRM backend
        fetch("/api/ai/chat/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            messages: [...updatedMessages, { role: "assistant", content: text }],
            escalated: false,
            confidenceScore: data.confidence,
            intent: data.intent,
            assignedDepartment: data.detectedDepartment || department,
            conversationSummary: data.conversationSummary,
            clientMetadata,
          }),
        }).catch(() => {});
      } else {
        showToast(data.error || "Failed to query AI assistant.");
      }
    } catch {
      showToast("AI service is temporarily unavailable. Failed to reach server node.");
    } finally {
      setLoading(false);
    }
  };

  const handleEscalationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) {
      showToast("Please provide your Name and Email.");
      return;
    }

    setEscalating(true);
    const clientMetadata = getClientMetadata();

    try {
      const res = await fetch("/api/ai/chat/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          name,
          email,
          phone,
          messages,
          escalated: true,
          escalationReason: `Intelligent routing to ${department}`,
          assignedDepartment: department,
          conversationSummary: conversationSummary || `User requested specialist escalation to ${department}`,
          clientMetadata,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setEscalationSubmitted(true);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Thank you, **${name}**! Your request has been routed directly to our **${department}** team. A specialist will reach out to **${email}** shortly.`,
          },
        ]);
        setTimeout(() => setShowEscalation(false), 4000);
      } else {
        showToast(data.error || "Failed to submit escalation.");
      }
    } catch {
      showToast("Network error submitting escalation.");
    } finally {
      setEscalating(false);
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
    setShowEscalation(false);
    setEscalationSubmitted(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-45 flex h-[530px] w-[calc(100vw-32px)] sm:w-[390px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-slate-900 via-blue-900 to-orange-600 p-4 text-white">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm shrink-0">
            <Sparkles className="h-4.5 w-4.5 text-orange-300 animate-pulse" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold font-display leading-tight truncate">EpitomeTRC AI Guide</h3>
            <div className="flex items-center gap-1 text-[9.5px] font-semibold opacity-90 truncate">
              <Navigation className="h-2.5 w-2.5 animate-pulse text-green-300 fill-green-300 shrink-0" />
              <span className="truncate">{pathname}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowEscalation((prev) => !prev)}
            title="Escalate to Human Specialist"
            className="rounded-lg p-1.5 hover:bg-white/15 transition-colors text-orange-200 hover:text-white"
          >
            <Headphones className="h-4 w-4" />
          </button>
          <button
            onClick={handleClear}
            title="Clear Chat"
            className="rounded-lg p-1.5 hover:bg-white/15 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={onMinimize}
            title="Minimize"
            className="rounded-lg p-1.5 hover:bg-white/15 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            title="Close"
            className="rounded-lg p-1.5 hover:bg-white/15 transition-colors"
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
                "rounded-2xl p-3.5 leading-relaxed shadow-xs",
                msg.role === "user"
                  ? "bg-slate-900 text-white rounded-br-none"
                  : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-none"
              )}
            >
              {msg.content}
            </div>
            {msg.role === "assistant" && msg.content && (
              <button
                onClick={() => handleCopy(msg.content, idx)}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors px-1"
              >
                {copiedId === idx ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" /> Copied
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
          <div className="flex max-w-[80%] items-center gap-1.5 bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 shadow-xs text-slate-400">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></span>
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"></span>
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"></span>
          </div>
        )}

        {/* Intelligent Escalation Form Card */}
        {showEscalation && !escalationSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-blue-50 border border-orange-200 shadow-md space-y-3 my-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-orange-600" />
                <h4 className="font-bold text-slate-900 text-xs">Connect to Specialist</h4>
              </div>
              <button onClick={() => setShowEscalation(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-slate-600 leading-normal">
              Pre-routed to our <strong className="text-slate-900">{department}</strong> team.
            </p>

            <form onSubmit={handleEscalationSubmit} className="space-y-2">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name *"
                className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 font-medium"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Work Email *"
                className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 font-medium"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone (Optional)"
                className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 font-medium"
              />

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-orange-500 font-medium text-slate-700"
              >
                <option value="Recruitment & Staffing">Recruitment & Staffing</option>
                <option value="AI Resume Builder Support">AI Resume Builder Support</option>
                <option value="Career Mentorship">Career Mentorship</option>
                <option value="Corporate Training">Corporate Training</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Sales">Sales</option>
                <option value="General Enquiries">General Enquiries</option>
              </select>

              <button
                type="submit"
                disabled={escalating}
                className="w-full py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 mt-1"
              >
                {escalating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                {escalating ? "Connecting..." : "Confirm Escalation Request"}
              </button>
            </form>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && !showEscalation && (
        <div className="px-4 py-2 border-t border-slate-100 space-y-1 bg-white">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggested Questions</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="rounded-lg border border-slate-200 bg-slate-50/60 px-2.5 py-1 text-[10.5px] font-semibold text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-all text-left"
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
        className="flex items-center gap-2 border-t border-slate-200 bg-white p-3.5"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI guide or request specialist..."
          className="flex-1 text-xs border-0 outline-none focus:ring-0 p-1 text-slate-800 font-medium"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:hover:bg-slate-900"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </motion.div>
  );
}
