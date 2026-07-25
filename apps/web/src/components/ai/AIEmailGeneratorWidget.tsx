"use client";

import { useState, useEffect } from "react";
import { Sparkles, Mail, Clipboard, Check, RefreshCw, Edit2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";

interface AIEmailGeneratorWidgetProps {
  candidates?: { id: number | string; name: string; role: string; email?: string }[];
  initialRecipient?: string;
  initialTemplate?: string;
  initialContext?: string;
}

const DEFAULT_RECIPIENTS = [
  { id: 1, name: "Sarah Jenkins (Acme Logistics)", role: "Lead Developer", email: "sarah.jenkins@acmelogistics.com" },
  { id: 2, name: "David Vance (MedTech Innovations)", role: "Product VP", email: "david.vance@medtech.com" },
  { id: 3, name: "Robert Downey (Candidate)", role: "Senior Next.js Developer", email: "robert.downey@example.com" }
];

export default function AIEmailGeneratorWidget({
  candidates = DEFAULT_RECIPIENTS,
  initialRecipient = "",
  initialTemplate = "",
  initialContext = ""
}: AIEmailGeneratorWidgetProps) {
  const [selectedRecipient, setSelectedRecipient] = useState(initialRecipient || (candidates[0]?.name || ""));
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailTone, setEmailTone] = useState("Professional");
  const [templateType, setTemplateType] = useState(initialTemplate || "Recruitment");
  const [additionalContext, setAdditionalContext] = useState(initialContext || "");
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Direct sending state
  const [sendingMail, setSendingMail] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (initialRecipient) {
      const exists = candidates.some(c => c.name === initialRecipient);
      if (!exists) {
        candidates.push({ 
          id: `temp-${Date.now()}`, 
          name: initialRecipient, 
          role: "Client Advisory", 
          email: "advisory@epitometrc.com" 
        });
      }
      setSelectedRecipient(initialRecipient);
    }
    if (initialTemplate) setTemplateType(initialTemplate);
    if (initialContext) setAdditionalContext(initialContext);
  }, [initialRecipient, initialTemplate, initialContext, candidates]);

  // Sync recipientEmail when selectedRecipient changes
  useEffect(() => {
    const r = candidates.find((item) => item.name === selectedRecipient) || candidates[0];
    if (r) {
      setRecipientEmail(r.email || "recipient@example.com");
    }
  }, [selectedRecipient, candidates]);

  const tones = ["Professional", "Formal", "Friendly"];
  
  const templates = [
    { value: "Recruitment", label: "Candidate Sourcing" },
    { value: "Client Communication", label: "Client Project Update" },
    { value: "Sales", label: "Advisory Outreach" },
    { value: "Follow-up", label: "Meeting Follow-up" },
    { value: "Interview Invitation", label: "Interview Schedule Invite" },
    { value: "Training Invitation", label: "Training Cohort Invite" },
    { value: "Proposal Sharing", label: "Transmit Business Proposal" },
    { value: "General", label: "Custom Outreach Memo" }
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipient || loading) return;

    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);
    setIsEditing(false);
    setSendSuccess(null);

    const r = candidates.find((item) => item.name === selectedRecipient) || candidates[0];

    try {
      const res = await fetch("/api/ai/email-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: r.name,
          targetRoleOrJob: r.role,
          emailTone,
          templateType,
          additionalContext: additionalContext.trim() || "N/A"
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.result);
      } else {
        setError(data.error || "Failed to generate outreach email.");
      }
    } catch {
      setError("AI Email Generator is offline. Connection timed out.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.body) return;
    navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = async () => {
    if (!recipientEmail || !result?.body || sendingMail) return;
    setSendingMail(true);
    setError("");
    setSendSuccess(null);

    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipientEmail,
          subject: result.subject,
          emailBody: result.body
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSendSuccess(data.message || "Email delivered successfully.");
      } else {
        setError(data.error || "Failed to dispatch email via SMTP server.");
      }
    } catch (e: any) {
      setError("Failed to connect to email delivery API.");
    } finally {
      setSendingMail(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-50">
            <Mail className="h-4.5 w-4.5 text-orange-500 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
              AI Recruiter Email Generator
            </h3>
            <p className="text-slate-400 text-[10px] font-sans">Enterprise Email Template Outreach Suite</p>
          </div>
        </div>
      </div>

      <p className="text-slate-500 text-xs font-sans leading-relaxed">
        Select a recipient, customize template themes, and set email tones. AI drafts ready-to-send corporate correspondence.
      </p>

      <form onSubmit={handleGenerate} className="space-y-4 text-left font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
          {/* Recipient Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
              Recipient Account
            </label>
            <select
              value={selectedRecipient}
              onChange={(e) => setSelectedRecipient(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 px-3 py-1.5 outline-none bg-white text-slate-655 font-semibold"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Recipient Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
              Recipient Email Address
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 px-3 py-1.5 outline-none text-slate-655 font-semibold bg-white"
            />
          </div>

          {/* Template Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
              Template Theme
            </label>
            <select
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 px-3 py-1.5 outline-none bg-white text-slate-655 font-semibold"
            >
              {templates.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Tone Selector */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
              Writing Tone
            </label>
            <select
              value={emailTone}
              onChange={(e) => setEmailTone(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 px-3 py-1.5 outline-none bg-white text-slate-655 font-semibold"
            >
              {tones.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Context Box */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
            Additional Context to Include (Optional)
          </label>
          <input
            type="text"
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder="e.g. Schedule for tomorrow 3 PM, mention our pricing discounts, include Zoom credentials"
            className="w-full h-10 rounded-xl border border-slate-200 px-3 py-1.5 outline-none text-slate-655 font-semibold bg-slate-50/10 focus:border-orange-500"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 rounded-xl text-xs font-bold w-full"
        >
          {loading ? (
            <span className="flex items-center gap-1.5 justify-center">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Authoring B2B Outreach Message...
            </span>
          ) : (
            "Generate Outreach Email"
          )}
        </Button>
      </form>

      {error && (
        <p className="text-red-500 text-[10px] font-semibold text-center mt-2">{error}</p>
      )}

      {sendSuccess && (
        <p className="text-emerald-600 text-[10px] font-bold text-center mt-2">{sendSuccess}</p>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pt-4 border-t border-slate-50 space-y-3.5 text-left"
          >
            {/* Email Layout */}
            <div className="rounded-xl border border-slate-155 p-5 bg-slate-50/10 space-y-3.5 relative font-sans">
              <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Subject Line</span>
                  {isEditing ? (
                    <input
                      value={result.subject}
                      onChange={(e) => setResult({ ...result, subject: e.target.value })}
                      className="border border-slate-200 rounded px-2 py-0.5 text-slate-700 font-bold text-xs w-96"
                    />
                  ) : (
                    <p className="font-bold text-slate-700 text-xs">{result.subject}</p>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
                    title={isEditing ? "Save edit" : "Edit email text"}
                  >
                    {isEditing ? <Check className="h-4 w-4 text-emerald-500" /> : <Edit2 className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
                    title="Copy subject & body"
                  >
                    <Clipboard className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Email Body</span>
                {isEditing ? (
                  <textarea
                    value={result.body}
                    onChange={(e) => setResult({ ...result, body: e.target.value })}
                    className="w-full border border-slate-200 rounded p-2 text-[11px] leading-relaxed"
                    rows={8}
                  />
                ) : (
                  <p className="text-slate-655 text-[11px] font-sans leading-relaxed whitespace-pre-line">
                    {result.body}
                  </p>
                )}
              </div>

              {copied && (
                <span className="text-[9px] font-bold text-emerald-600 absolute right-5 bottom-4">Copied to Clipboard!</span>
              )}
            </div>

            {/* Direct Send button panel */}
            <div className="flex justify-end pt-1">
              <Button
                onClick={handleSendEmail}
                disabled={sendingMail || !recipientEmail}
                variant="primary"
                className="h-10 rounded-xl px-6 font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/10"
              >
                {sendingMail ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Sending Email...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Email via Transporter
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
