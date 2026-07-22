"use client";

import { useState, useEffect } from "react";
import { Sparkles, FileText, Download, Printer, RefreshCw, Plus, Trash2, Edit2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";

interface ProposalData {
  companyOverview: string;
  projectScope: string;
  services: { name: string; description: string }[];
  timeline: { milestone: string; duration: string; description: string }[];
  deliverables: string[];
  estimatedPricing: {
    total: string;
    breakdown: { item: string; cost: string }[];
  };
  termsAndConditions: string;
}

interface AIProposalGeneratorWidgetProps {
  initialClientName?: string;
  initialRequirements?: string;
}

export default function AIProposalGeneratorWidget({ initialClientName = "", initialRequirements = "" }: AIProposalGeneratorWidgetProps) {
  const [clientName, setClientName] = useState(initialClientName);
  const [requirements, setRequirements] = useState(initialRequirements);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProposalData | null>(null);

  useEffect(() => {
    if (initialClientName) setClientName(initialClientName);
    if (initialRequirements) setRequirements(initialRequirements);
  }, [initialClientName, initialRequirements]);
  const [error, setError] = useState("");

  // Edit State
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleEdit = async () => {
    if (isEditing && result) {
      try {
        const res = await fetch("/api/ai/proposal-generator", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientName: clientName.trim(),
            requirements: requirements.trim(),
            proposalData: result,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.error || "Failed to persist proposal changes.");
        }
      } catch {
        setError("Proposal saving offline. Connection timeout.");
      }
    }
    setIsEditing(!isEditing);
  };

  const handleGenerateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !requirements.trim() || loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/ai/proposal-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          requirements: requirements.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.result);
      } else {
        setError(data.error || "Failed to generate business proposal.");
      }
    } catch {
      setError("AI Proposal Builder is offline. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintProposal = () => {
    if (!result) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>B2B Business Proposal - ${clientName}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; padding: 40px; line-height: 1.6; }
            .header { border-bottom: 2px solid #ea580c; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #0f172a; }
            .subtitle { font-size: 14px; color: #64748b; margin-top: 5px; }
            h1 { font-size: 28px; color: #0f172a; margin-top: 0; }
            h2 { font-size: 18px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px; }
            .meta { margin-bottom: 40px; font-size: 13px; color: #475569; }
            .section { margin-bottom: 25px; }
            .price-total { font-size: 20px; font-weight: bold; color: #ea580c; margin-top: 15px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 13px; }
            th { bg-color: #f8fafc; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">EpitomeTRC Strategic Solutions</div>
            <div class="subtitle">B2B CONSULTING & TECHNOLOGY OUTLINE PROPOSAL</div>
          </div>
          <h1>Business Proposal for ${clientName}</h1>
          <div class="meta">
            <strong>Date Generated:</strong> ${new Date().toLocaleDateString()}<br/>
            <strong>Prepared by:</strong> EpitomeTRC Business Advisory Suite
          </div>
          
          <h2>1. Executive Summary & Company Profile</h2>
          <p>${result.companyOverview}</p>

          <h2>2. Project Scope & Architecture Solution</h2>
          <p>${result.projectScope}</p>

          <h2>3. Recommended Corporate Services</h2>
          <ul>
            ${result.services?.map(s => `<li><strong>${s.name}</strong>: ${s.description}</li>`).join("")}
          </ul>

          <h2>4. Implementation Timeline Roadmaps</h2>
          <table>
            <thead>
              <tr>
                <th>Phase/Milestone</th>
                <th>Duration</th>
                <th>Focus Areas</th>
              </tr>
            </thead>
            <tbody>
              ${result.timeline?.map(t => `
                <tr>
                  <td><strong>${t.milestone}</strong></td>
                  <td>${t.duration}</td>
                  <td>${t.description}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <h2>5. Statement of Deliverables</h2>
          <ul>
            ${result.deliverables?.map(d => `<li>${d}</li>`).join("")}
          </ul>

          <h2>6. Investment & Price Estimation</h2>
          <table>
            <thead>
              <tr>
                <th>Item / Deliverable Scope</th>
                <th>Pricing Estimate</th>
              </tr>
            </thead>
            <tbody>
              ${result.estimatedPricing?.breakdown?.map(b => `
                <tr>
                  <td>${b.item}</td>
                  <td>${b.cost}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="price-total">Estimated Total Investment: ${result.estimatedPricing?.total}</div>

          <h2>7. Advisory Terms & Service Level Terms</h2>
          <p>${result.termsAndConditions}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleExportWord = () => {
    if (!result) return;
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Business Proposal</title></head>
      <body>
        <h1>Business Proposal prepared for ${clientName}</h1>
        <h2>Company Profile</h2><p>${result.companyOverview}</p>
        <h2>Project Scope</h2><p>${result.projectScope}</p>
        <h2>Timeline</h2><p>${result.timeline?.map(t => `${t.milestone} (${t.duration})`).join("; ")}</p>
        <h2>Estimated Total Pricing: ${result.estimatedPricing?.total}</h2>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + htmlContent], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Proposal_${clientName.replace(/\s+/g, "_")}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-50">
            <FileText className="h-4.5 w-4.5 text-orange-500 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
              AI Business Proposal Generator & Builder
            </h3>
            <p className="text-slate-400 text-[10px] font-sans">Enterprise Proposal Authoring & B2B Document Writer</p>
          </div>
        </div>
      </div>

      <p className="text-slate-500 text-xs font-sans leading-relaxed">
        Input prospective client details and project parameters to generate a complete business proposal, customize each phase, and export to PDF/Word.
      </p>

      <form onSubmit={handleGenerateProposal} className="space-y-4 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
              Prospective Client Name
            </label>
            <input
              required
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Acme Logistics Corp"
              className="w-full h-10 rounded-xl border border-slate-200 px-3 py-1.5 outline-none text-slate-655 font-semibold bg-slate-50/10 focus:border-orange-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
              Client Requirements / Project Concept
            </label>
            <input
              required
              type="text"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="e.g. Scaling fleet tracking map, migration to AWS, support training"
              className="w-full h-10 rounded-xl border border-slate-200 px-3 py-1.5 outline-none text-slate-655 font-semibold bg-slate-50/10 focus:border-orange-500"
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl text-xs font-bold"
        >
          {loading ? (
            <span className="flex items-center gap-1.5 justify-center">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Drafting B2B Business Architecture Proposal...
            </span>
          ) : (
            "Generate Business Proposal"
          )}
        </Button>
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
            className="pt-5 border-t border-slate-50 space-y-4 text-left font-sans"
          >
            {/* Header controls for generated proposal */}
            <div className="flex justify-between items-center bg-slate-50 p-2 border border-slate-100 rounded-xl flex-wrap gap-2">
              <div className="flex gap-1.5">
                <button
                  onClick={handleToggleEdit}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-bold text-slate-600 flex items-center gap-1 transition-colors"
                >
                  {isEditing ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Edit2 className="h-3.5 w-3.5 text-blue-500" />}
                  {isEditing ? "Finish Editing" : "Edit Proposal"}
                </button>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={handlePrintProposal}
                  className="px-3 py-1.5 rounded-lg bg-[#0b172a] hover:bg-slate-800 text-white text-[10px] font-bold flex items-center gap-1 transition-colors"
                >
                  <Printer className="h-3.5 w-3.5" /> Print / Save PDF
                </button>
                <button
                  onClick={handleExportWord}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-bold text-slate-600 flex items-center gap-1 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" /> Export Word
                </button>
              </div>
            </div>

            {/* Structured Proposal Document Container */}
            <div className="rounded-xl border border-slate-150 p-5 space-y-4.5 bg-slate-50/20 font-sans leading-relaxed text-xs">
              
              {/* Profile Overview */}
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">1. Company Profile Summary</span>
                {isEditing ? (
                  <textarea
                    value={result.companyOverview}
                    onChange={(e) => setResult({ ...result, companyOverview: e.target.value })}
                    className="w-full border border-slate-200 rounded p-2 text-xs"
                    rows={3}
                  />
                ) : (
                  <p className="text-slate-655 font-medium">{result.companyOverview}</p>
                )}
              </div>

              {/* Project Scope */}
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">2. Solution & Project Scope</span>
                {isEditing ? (
                  <textarea
                    value={result.projectScope}
                    onChange={(e) => setResult({ ...result, projectScope: e.target.value })}
                    className="w-full border border-slate-200 rounded p-2 text-xs"
                    rows={3}
                  />
                ) : (
                  <p className="text-slate-655 font-medium">{result.projectScope}</p>
                )}
              </div>

              {/* Services details */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">3. Proposed Corporate Services</span>
                <div className="space-y-2">
                  {result.services?.map((s, idx) => (
                    <div key={idx} className="border-l-2 border-orange-500 pl-3">
                      {isEditing ? (
                        <div className="space-y-1">
                          <input
                            value={s.name}
                            onChange={(e) => {
                              const updated = [...result.services];
                              updated[idx].name = e.target.value;
                              setResult({ ...result, services: updated });
                            }}
                            className="w-full border border-slate-200 rounded px-2 py-0.5 font-bold"
                          />
                          <textarea
                            value={s.description}
                            onChange={(e) => {
                              const updated = [...result.services];
                              updated[idx].description = e.target.value;
                              setResult({ ...result, services: updated });
                            }}
                            className="w-full border border-slate-200 rounded p-1.5 text-[11px]"
                            rows={2}
                          />
                        </div>
                      ) : (
                        <>
                          <h4 className="font-bold text-slate-700">{s.name}</h4>
                          <p className="text-slate-400 text-[10.5px] font-semibold">{s.description}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* pricing */}
              <div className="space-y-2 border-t border-slate-200/80 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">4. Financial Terms & Estimated Investment</span>
                  {isEditing ? (
                    <input
                      value={result.estimatedPricing.total}
                      onChange={(e) => setResult({
                        ...result,
                        estimatedPricing: { ...result.estimatedPricing, total: e.target.value }
                      })}
                      className="border border-slate-200 rounded px-2 py-0.5 text-right font-black text-orange-600"
                    />
                  ) : (
                    <span className="font-black text-orange-600 text-sm font-mono">{result.estimatedPricing.total}</span>
                  )}
                </div>
                
                <table className="w-full text-left font-sans mt-2">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border border-slate-200 font-bold text-[9px] uppercase tracking-wider">
                      <th className="p-2 border-r border-slate-200">Scope Deliverable Item</th>
                      <th className="p-2 text-right">Cost Estimate</th>
                    </tr>
                  </thead>
                  <tbody className="border border-slate-200 font-medium">
                    {result.estimatedPricing?.breakdown?.map((b, idx) => (
                      <tr key={idx} className="border-b border-slate-200 last:border-0 hover:bg-slate-50/50">
                        <td className="p-2 border-r border-slate-200">
                          {isEditing ? (
                            <input
                              value={b.item}
                              onChange={(e) => {
                                const updated = [...result.estimatedPricing.breakdown];
                                updated[idx].item = e.target.value;
                                setResult({ ...result, estimatedPricing: { ...result.estimatedPricing, breakdown: updated } });
                              }}
                              className="w-full bg-transparent border-0 outline-none font-semibold text-slate-700"
                            />
                          ) : (
                            b.item
                          )}
                        </td>
                        <td className="p-2 text-right text-slate-700 font-mono font-semibold">
                          {isEditing ? (
                            <input
                              value={b.cost}
                              onChange={(e) => {
                                const updated = [...result.estimatedPricing.breakdown];
                                updated[idx].cost = e.target.value;
                                setResult({ ...result, estimatedPricing: { ...result.estimatedPricing, breakdown: updated } });
                              }}
                              className="bg-transparent border-0 outline-none text-right font-semibold text-slate-700"
                            />
                          ) : (
                            b.cost
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* terms */}
              <div className="space-y-1 border-t border-slate-200/80 pt-3">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">5. standard Terms & Deliverable Handover Rules</span>
                {isEditing ? (
                  <textarea
                    value={result.termsAndConditions}
                    onChange={(e) => setResult({ ...result, termsAndConditions: e.target.value })}
                    className="w-full border border-slate-200 rounded p-2 text-xs"
                    rows={2}
                  />
                ) : (
                  <p className="text-slate-404 text-[10.5px] font-semibold">{result.termsAndConditions}</p>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
