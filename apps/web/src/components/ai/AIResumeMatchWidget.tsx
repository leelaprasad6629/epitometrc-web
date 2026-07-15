"use client";

import { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, FileText, Upload, User, Mail, Phone, BookOpen, Briefcase, Trash2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useResumeStore, ParsedResume } from "@/lib/ai/store/resumeStore";

// Role Skills Mapping Configuration
const ROLE_SKILLS_MAP: Record<string, { mustHave: string[]; preferred: string[] }> = {
  "Full Stack Developer": {
    mustHave: ["javascript", "react", "node.js", "express", "sql", "git"],
    preferred: ["docker", "aws", "typescript", "mongodb"]
  },
  "Frontend Developer": {
    mustHave: ["javascript", "react", "html", "css", "tailwind", "git"],
    preferred: ["next.js", "typescript", "zustand", "framer motion"]
  },
  "Backend Developer": {
    mustHave: ["node.js", "express", "postgresql", "rest apis", "git", "sql"],
    preferred: ["docker", "aws", "redis", "graphql", "prisma"]
  },
  "Python Developer": {
    mustHave: ["python", "django", "fastapi", "flask", "sql", "git"],
    preferred: ["docker", "aws", "redis", "postgresql"]
  },
  "Java Developer": {
    mustHave: ["java", "spring boot", "hibernate", "sql", "git", "maven"],
    preferred: ["docker", "aws", "microservices", "kubernetes"]
  },
  "Data Analyst": {
    mustHave: ["python", "sql", "excel", "tableau", "statistics", "pandas"],
    preferred: ["power bi", "r", "machine learning", "matplotlib"]
  },
  "AI/ML Engineer": {
    mustHave: ["python", "tensorflow", "pytorch", "scikit-learn", "statistics", "git"],
    preferred: ["docker", "aws", "nlp", "computer vision", "transformers"]
  }
};

export default function AIResumeMatchWidget() {
  const {
    fileName,
    selectedJobRole,
    parsedResumeDetails,
    atsScore,
    matchScore,
    skillMatchPercentage,
    completeness,
    matchedSkills,
    missingSkills,
    recommendations,
    setResumeData,
    updateParsedDetails,
    setSelectedJobRole,
    updateAnalysis,
    deleteResume
  } = useResumeStore();

  const [activeTab, setActiveTab] = useState<"details" | "analytics">("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Calculate scores dynamically whenever parsedResumeDetails or selectedJobRole changes
  useEffect(() => {
    if (!parsedResumeDetails) return;

    // 1. Calculate profile completeness percentage
    const fields = [
      parsedResumeDetails.fullName,
      parsedResumeDetails.email,
      parsedResumeDetails.phone,
      parsedResumeDetails.education,
      parsedResumeDetails.experience,
      parsedResumeDetails.projects,
      parsedResumeDetails.certifications,
      parsedResumeDetails.technicalSkills?.length > 0 ? "skills" : "",
      parsedResumeDetails.softSkills?.length > 0 ? "soft" : "",
      parsedResumeDetails.programmingLanguages?.length > 0 ? "languages" : "",
      parsedResumeDetails.frameworks?.length > 0 ? "frameworks" : "",
      parsedResumeDetails.databases?.length > 0 ? "databases" : "",
      parsedResumeDetails.toolsTechnologies?.length > 0 ? "tools" : ""
    ].filter(Boolean);
    const completenessVal = Math.round((fields.length / 13) * 100);

    // 2. Skill matching calculations
    const jobSkills = ROLE_SKILLS_MAP[selectedJobRole] || { mustHave: [], preferred: [] };
    const allUserSkills = [
      ...(parsedResumeDetails.technicalSkills || []),
      ...(parsedResumeDetails.programmingLanguages || []),
      ...(parsedResumeDetails.frameworks || []),
      ...(parsedResumeDetails.databases || []),
      ...(parsedResumeDetails.toolsTechnologies || [])
    ].map(s => s.toLowerCase());

    const matchedMustHave = jobSkills.mustHave.filter(s => allUserSkills.includes(s));
    const matchedPreferred = jobSkills.preferred.filter(s => allUserSkills.includes(s));

    const totalRequired = jobSkills.mustHave.length + jobSkills.preferred.length;
    const totalMatchedCount = matchedMustHave.length + matchedPreferred.length;

    const skillMatchPercentageVal = totalRequired > 0 
      ? Math.round((totalMatchedCount / totalRequired) * 100) 
      : 0;

    // 3. Score weighting
    const mustHaveWeight = jobSkills.mustHave.length > 0 ? (matchedMustHave.length / jobSkills.mustHave.length) * 60 : 0;
    const preferredWeight = jobSkills.preferred.length > 0 ? (matchedPreferred.length / jobSkills.preferred.length) * 20 : 0;
    const completenessWeight = (completenessVal / 100) * 20;

    const matchScoreVal = Math.min(100, Math.round(mustHaveWeight + preferredWeight + completenessWeight));
    const atsScoreVal = Math.min(100, Math.round((matchedMustHave.length / Math.max(1, jobSkills.mustHave.length)) * 70 + (completenessVal / 100) * 30));

    // Insights lists
    const matchedList = [...matchedMustHave, ...matchedPreferred].map(s => s.toUpperCase());
    const missingList = [...jobSkills.mustHave, ...jobSkills.preferred]
      .filter(s => !allUserSkills.includes(s))
      .map(s => s.toUpperCase());

    const strengthsList = [
      `Strong alignment with target stack: ${matchedMustHave.slice(0, 3).join(", ").toUpperCase() || "foundations"}.`,
      completenessVal > 80 ? "Exhibits highly detailed and structural resume sections." : "Contains clear project definitions."
    ];

    const improvementsList = [];
    if (missingList.length > 0) {
      improvementsList.push(`Add verified projects showcasing: ${missingList.slice(0, 2).join(" and ")}.`);
    }
    if (completenessVal < 85) {
      improvementsList.push("Provide more details in database and certifications fields to score higher.");
    }
    if (improvementsList.length === 0) {
      improvementsList.push("Document advanced cloud config metrics or automated linting checks.");
    }

    const recommendationsList = [
      `Tailor resume profile summary to explicitly emphasize skills in ${jobSkills.mustHave.slice(0, 2).join(" & ").toUpperCase()}.`,
      `Quantify professional accomplishments using clear metrics (e.g. 'reduced latency by 20%').`
    ];

    const certRecommendationsList = [
      `Certified ${selectedJobRole} Professional`,
      `Advanced Cloud Systems Architect Certificate`
    ];

    const projectRecommendationsList = [
      `Scale a high-concurrency client-server wrapper using ${jobSkills.mustHave[0] || 'TypeScript'}.`,
      `Deploy a secure database container with robust Prisma schema indexes.`
    ];

    // Update global store values so all separate modules read the updated report card
    updateAnalysis({
      atsScore: atsScoreVal,
      matchScore: matchScoreVal,
      skillMatchPercentage: skillMatchPercentageVal,
      completeness: completenessVal,
      matchedSkills: matchedList,
      missingSkills: missingList,
      missingKeywords: missingList.slice(0, 3),
      strengths: strengthsList,
      improvements: improvementsList,
      recommendations: recommendationsList,
      certRecommendations: certRecommendationsList,
      projectRecommendations: projectRecommendationsList
    });

  }, [parsedResumeDetails, selectedJobRole]);

  // File parsing fetch trigger
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64Data = event.target?.result?.toString().split(",")[1] || "";
        const res = await fetch("/api/ai/parse-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileMimeType: file.type || "application/pdf",
            fileBase64: base64Data,
            fileContent: `Uploaded resume for ${file.name}.`
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          // Destructure result and map fields
          const result = data.result;
          const mappedDetails: ParsedResume = {
            fullName: result.fullName || "",
            email: result.email || "",
            phone: result.phone || "",
            education: result.education || "",
            experience: result.experience || "",
            projects: result.projects || "",
            certifications: result.certifications || "",
            technicalSkills: result.technicalSkills || [],
            softSkills: result.softSkills || [],
            programmingLanguages: result.programmingLanguages || [],
            frameworks: result.frameworks || result.toolsFrameworks || [],
            databases: result.databases || [],
            toolsTechnologies: result.toolsTechnologies || result.toolsFrameworks || []
          };

          setResumeData(file.name, base64Data, file.type || "application/pdf", mappedDetails);
          setActiveTab("analytics"); // Switch tabs to show scorecards
        } else {
          setError(data.error || "Failed to parse resume file.");
        }
      } catch {
        setError("Resume parsing offline. Connection timed out.");
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError("Failed to read the file payload.");
      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  // SVG Gauge Loader
  const CircularProgress = ({ value, label, colorClass }: { value: number; label: string; colorClass: string }) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div className="flex flex-col items-center gap-1.5 p-2 bg-slate-50/55 rounded-xl border border-slate-100/40 flex-1 min-w-[70px]">
        <div className="relative h-12 w-12 flex items-center justify-center">
          <svg className="h-full w-full -rotate-90">
            <circle cx="24" cy="24" r={radius} className="stroke-slate-100 fill-transparent stroke-2.5" />
            <circle
              cx="24"
              cy="24"
              r={radius}
              className={`fill-transparent stroke-2.5 transition-all duration-700 ${colorClass}`}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <span className="absolute text-[10px] font-black text-slate-800 font-mono">{value}%</span>
        </div>
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center">{label}</span>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-5 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
          <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
            AI Resume Match Analyzer
          </h2>
        </div>
      </div>

      <p className="text-slate-400 text-xs leading-relaxed text-left font-medium">
        This module manages your uploaded resume, parsing skills and evaluating compatibility against target career vacancies.
      </p>

      {/* Upload Zone / Active Resume controls */}
      {fileName ? (
        <div className="rounded-xl border border-slate-100 p-4 bg-slate-50/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-xl bg-orange-50 border border-orange-100 text-orange-500 shrink-0">
              <FileText className="h-5 w-5" />
            </span>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{fileName}</h4>
              <p className="text-[10px] text-slate-400 font-medium font-sans">Stored Resume Source of Truth</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {/* Replace Button */}
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer font-bold text-[10px] text-slate-600 transition-colors">
              <RefreshCw className="h-3 w-3" />
              Replace File
              <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
            {/* Delete Button */}
            <button
              onClick={deleteResume}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Delete Stored
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/20 hover:bg-slate-50 hover:border-orange-400 cursor-pointer transition-all">
          <Upload className="h-6.5 w-6.5 text-slate-400 mb-1.5 animate-bounce" />
          <div className="text-center">
            <p className="text-xs font-bold text-slate-700">Click to upload your resume</p>
            <p className="text-[9px] text-slate-400 font-medium font-sans">Supports PDF, DOCX, or TXT</p>
          </div>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      )}

      {loading && (
        <p className="text-orange-500 font-semibold text-center animate-pulse">Reading file and parsing metadata details...</p>
      )}

      {error && (
        <p className="text-red-500 text-[10px] font-semibold text-center">{error}</p>
      )}

      {parsedResumeDetails && (
        <div className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex rounded-xl bg-slate-50 p-1 border border-slate-100">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 py-2 rounded-lg font-bold text-[10.5px] uppercase tracking-wider transition-colors ${
                activeTab === "details"
                  ? "bg-white text-[#0b172a] shadow-sm border border-slate-100"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              📋 Parsed Details
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex-1 py-2 rounded-lg font-bold text-[10.5px] uppercase tracking-wider transition-colors ${
                activeTab === "analytics"
                  ? "bg-white text-[#0b172a] shadow-sm border border-slate-100"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              📊 Job Match Report
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "details" ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4 text-left pt-1"
              >
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <User className="h-3.5 w-3.5" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={parsedResumeDetails.fullName}
                    onChange={(e) => updateParsedDetails({ fullName: e.target.value })}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-slate-600 focus:border-orange-500 outline-none text-xs"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" /> Email Address
                    </label>
                    <input
                      type="email"
                      value={parsedResumeDetails.email}
                      onChange={(e) => updateParsedDetails({ email: e.target.value })}
                      className="w-full h-9 rounded-xl border border-slate-200 px-3 text-slate-600 focus:border-orange-500 outline-none text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" /> Contact Number
                    </label>
                    <input
                      type="text"
                      value={parsedResumeDetails.phone}
                      onChange={(e) => updateParsedDetails({ phone: e.target.value })}
                      className="w-full h-9 rounded-xl border border-slate-200 px-3 text-slate-600 focus:border-orange-500 outline-none text-xs"
                    />
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" /> Education History
                  </label>
                  <input
                    type="text"
                    value={parsedResumeDetails.education}
                    onChange={(e) => updateParsedDetails({ education: e.target.value })}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-slate-600 focus:border-orange-500 outline-none text-xs"
                  />
                </div>

                {/* Experience */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" /> Professional Experience
                  </label>
                  <textarea
                    value={parsedResumeDetails.experience}
                    onChange={(e) => updateParsedDetails({ experience: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-3 text-slate-600 h-16 resize-none outline-none focus:border-orange-500 text-xs"
                  />
                </div>

                {/* Technical Skills */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                    Technical Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={parsedResumeDetails.technicalSkills?.join(", ") || ""}
                    onChange={(e) => updateParsedDetails({
                      technicalSkills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                    })}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-slate-600 focus:border-orange-500 outline-none text-xs"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-5 text-left"
              >
                {/* Job Role selector */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-700 uppercase tracking-wider block">
                    Select Target Job Role
                  </label>
                  <select
                    value={selectedJobRole}
                    onChange={(e) => setSelectedJobRole(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 px-3 py-1.5 outline-none bg-white text-slate-600 font-semibold"
                  >
                    {Object.keys(ROLE_SKILLS_MAP).map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                {/* SVG Score Rings */}
                <div className="flex gap-3 justify-between items-center">
                  <CircularProgress value={atsScore} label="ATS Score" colorClass="stroke-red-500" />
                  <CircularProgress value={matchScore} label="Match Score" colorClass="stroke-orange-500" />
                  <CircularProgress value={skillMatchPercentage} label="Skills Match" colorClass="stroke-blue-500" />
                </div>

                {/* Profile Completeness bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-600">
                    <span>Profile Completeness</span>
                    <span>{completeness}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${completeness}%` }}
                    />
                  </div>
                </div>

                {/* Matched vs Missing Skills */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[9.5px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Matched Skills ({matchedSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {matchedSkills.length > 0 ? (
                        matchedSkills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-emerald-50 text-[9px] font-bold text-emerald-600 border border-emerald-100">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-[10px]">No matches found.</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9.5px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Missing Skills ({missingSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {missingSkills.length > 0 ? (
                        missingSkills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-red-50 text-[9px] font-bold text-red-600 border border-red-100">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-emerald-600 font-bold text-[10px]">Profile contains all target skills!</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="border-t border-slate-100 pt-4 space-y-2.5">
                  <span className="font-bold text-slate-700 block">AI Strategic Recommendations</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-500 text-[10px] leading-relaxed">
                    {recommendations.map((r, idx) => <li key={idx}>{r}</li>)}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
