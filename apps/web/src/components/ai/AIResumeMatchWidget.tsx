"use client";

import { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, FileText, Upload, User, Mail, Phone, BookOpen, Briefcase, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";

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
  const [selectedJob, setSelectedJob] = useState("Frontend Developer");
  
  // Resume details state (initially empty to satisfy "without submitting/uploading it should not pre-render matching results")
  const [parsedData, setParsedData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedFile, setCopiedFile] = useState<File | null>(null);

  // Scores state
  const [scores, setScores] = useState({
    matchScore: 0,
    atsScore: 0,
    skillMatchPercentage: 0,
    completeness: 0
  });

  // Analysis lists
  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [learningTopics, setLearningTopics] = useState<string[]>([]);

  // Calculate scores and insights dynamically whenever parsedData or selectedJob changes
  useEffect(() => {
    if (!parsedData) {
      setScores({ matchScore: 0, atsScore: 0, skillMatchPercentage: 0, completeness: 0 });
      setMatchedSkills([]);
      setMissingSkills([]);
      setStrengths([]);
      setImprovements([]);
      setRecommendations([]);
      setLearningTopics([]);
      return;
    }

    // 1. Calculate Resume Completeness
    const fields = [
      parsedData.fullName,
      parsedData.email,
      parsedData.phone,
      parsedData.education,
      parsedData.experience,
      parsedData.projects,
      parsedData.certifications,
      parsedData.technicalSkills?.length > 0 ? "skills" : "",
      parsedData.softSkills?.length > 0 ? "soft" : "",
      parsedData.programmingLanguages?.length > 0 ? "languages" : "",
      parsedData.toolsFrameworks?.length > 0 ? "tools" : ""
    ].filter(Boolean);
    const completeness = Math.round((fields.length / 11) * 100);

    // 2. Skill matching calculations
    const jobSkills = ROLE_SKILLS_MAP[selectedJob] || { mustHave: [], preferred: [] };
    const allUserSkills = [
      ...(parsedData.technicalSkills || []),
      ...(parsedData.programmingLanguages || []),
      ...(parsedData.toolsFrameworks || [])
    ].map(s => s.toLowerCase());

    const matchedMustHave = jobSkills.mustHave.filter(s => allUserSkills.includes(s));
    const matchedPreferred = jobSkills.preferred.filter(s => allUserSkills.includes(s));

    const totalRequired = jobSkills.mustHave.length + jobSkills.preferred.length;
    const totalMatchedCount = matchedMustHave.length + matchedPreferred.length;

    const skillMatchPercentage = totalRequired > 0 
      ? Math.round((totalMatchedCount / totalRequired) * 100) 
      : 0;

    // 3. Match Score and ATS Score formulation
    // Match score factors must-have skills highly
    const mustHaveWeight = jobSkills.mustHave.length > 0 ? (matchedMustHave.length / jobSkills.mustHave.length) * 60 : 0;
    const preferredWeight = jobSkills.preferred.length > 0 ? (matchedPreferred.length / jobSkills.preferred.length) * 20 : 0;
    const completenessWeight = (completeness / 100) * 20;

    const matchScore = Math.min(100, Math.round(mustHaveWeight + preferredWeight + completenessWeight));
    
    // ATS Score matches formatting checks + keywords match
    const atsScore = Math.min(100, Math.round((matchedMustHave.length / Math.max(1, jobSkills.mustHave.length)) * 70 + (completeness / 100) * 30));

    setScores({
      matchScore,
      atsScore,
      skillMatchPercentage,
      completeness
    });

    // Match lists formatting
    const matchedList = [...matchedMustHave, ...matchedPreferred].map(s => s.toUpperCase());
    const missingList = [...jobSkills.mustHave, ...jobSkills.preferred]
      .filter(s => !allUserSkills.includes(s))
      .map(s => s.toUpperCase());

    setMatchedSkills(matchedList);
    setMissingSkills(missingList);

    // Dynamic strengths & improvements text
    const strengthPoints = [
      `Demonstrates clear familiarity with essential systems: ${matchedMustHave.slice(0, 3).join(", ").toUpperCase() || "basic development tools"}.`,
      completeness > 80 ? "Exhibits highly detailed and fully populated profile configurations." : "Maintains clean project outline structures."
    ];
    setStrengths(strengthPoints);

    const improvementPoints = [];
    if (missingList.length > 0) {
      improvementPoints.push(`Acquire verified expertise in critical missing stacks: ${missingList.slice(0, 2).join(" and ")}.`);
    }
    if (completeness < 85) {
      improvementPoints.push("Provide additional context in experience or certifications fields to maximize profile strength.");
    }
    if (improvementPoints.length === 0) {
      improvementPoints.push("Expand on cloud architecture metrics or server security implementations.");
    }
    setImprovements(improvementPoints);

    setRecommendations([
      `Tailor your summary bio to explicitly highlight your experience with ${jobSkills.mustHave.slice(0, 2).join(" and ").toUpperCase()}.`,
      `Add bulleted statistics (e.g. 'Improved efficiency by 25%') to quantify your project impact.`
    ]);

    setLearningTopics(
      missingList.length > 0 
        ? missingList.slice(0, 3).map(s => `Master ${s} through official bootcamps.`) 
        : ["Advance into Kubernetes containers.", "Learn AWS Serverless architectures."]
    );

  }, [parsedData, selectedJob]);

  // Handle simulated resume file selection & parsing API fetch
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setCopiedFile(file);

    try {
      const res = await fetch("/api/ai/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileContent: `Uploaded resume for ${file.name}. Simulated parse extraction content.`
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setParsedData(data.result);
      } else {
        setError(data.error || "Failed to parse resume file.");
      }
    } catch {
      setError("Resume parsing offline. Connection timed out.");
    } finally {
      setLoading(false);
    }
  };

  // SVG circular loader generator helper
  const CircularProgress = ({ value, label, colorClass }: { value: number; label: string; colorClass: string }) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div className="flex flex-col items-center gap-1">
        <div className="relative h-14 w-14 flex items-center justify-center">
          <svg className="h-full w-full -rotate-90">
            <circle cx="28" cy="28" r={radius} className="stroke-slate-100 fill-transparent stroke-3" />
            <circle
              cx="28"
              cy="28"
              r={radius}
              className={`fill-transparent stroke-3 transition-all duration-700 ${colorClass}`}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <span className="absolute text-[10px] font-black text-slate-800 font-mono">{value}%</span>
        </div>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      {/* 1. Resume Upload Card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
              AI Resume Parser & Match Analyzer
            </h2>
          </div>
        </div>

        <p className="text-slate-400 text-xs leading-relaxed">
          Upload your resume file (PDF/DOCX) below. The AI will extract your profile details and compare them against target job requirements in real-time.
        </p>

        {/* Drag & Drop Upload Zone */}
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/20 hover:bg-slate-50 hover:border-orange-400 cursor-pointer transition-all">
          <Upload className="h-8 w-8 text-slate-400 animate-bounce mb-2" />
          {copiedFile ? (
            <div className="space-y-0.5 text-center">
              <p className="text-xs font-bold text-orange-600 flex items-center gap-1.5 justify-center">
                <FileText className="h-4 w-4" /> {copiedFile.name}
              </p>
              <p className="text-[10px] text-slate-400 font-medium font-sans">Click or drag to replace resume</p>
            </div>
          ) : (
            <div className="text-center space-y-0.5">
              <p className="text-xs font-bold text-slate-700">Click to upload your resume</p>
              <p className="text-[10px] text-slate-400 font-medium font-sans">Supports PDF, DOCX, or TXT up to 5MB</p>
            </div>
          )}
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {loading && (
          <p className="text-orange-500 font-semibold text-center mt-2 animate-pulse">AI is parsing and extracting skills data...</p>
        )}

        {error && (
          <p className="text-red-500 text-[10px] font-semibold text-center mt-2">{error}</p>
        )}
      </div>

      <AnimatePresence>
        {parsedData && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
          >
            {/* 2. Resume Details Form (Left panel) */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <h3 className="font-display text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2">
                Parsed Resume Details
              </h3>

              <div className="space-y-3.5 text-left">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={parsedData.fullName}
                    onChange={(e) => setParsedData({ ...parsedData, fullName: e.target.value })}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-slate-600 focus:border-orange-500 outline-none"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" /> Email Address
                    </label>
                    <input
                      type="email"
                      value={parsedData.email}
                      onChange={(e) => setParsedData({ ...parsedData, email: e.target.value })}
                      className="w-full h-9 rounded-xl border border-slate-200 px-3 text-slate-600 focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" /> Contact Number
                    </label>
                    <input
                      type="text"
                      value={parsedData.phone}
                      onChange={(e) => setParsedData({ ...parsedData, phone: e.target.value })}
                      className="w-full h-9 rounded-xl border border-slate-200 px-3 text-slate-600 focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-slate-400" /> Education
                  </label>
                  <input
                    type="text"
                    value={parsedData.education}
                    onChange={(e) => setParsedData({ ...parsedData, education: e.target.value })}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-slate-600 focus:border-orange-500 outline-none"
                  />
                </div>

                {/* Experience */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" /> Professional Experience
                  </label>
                  <textarea
                    value={parsedData.experience}
                    onChange={(e) => setParsedData({ ...parsedData, experience: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 p-3 text-slate-600 h-14 resize-none outline-none focus:border-orange-500"
                  />
                </div>

                {/* Technical Skills */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                    Technical Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={parsedData.technicalSkills?.join(", ") || ""}
                    onChange={(e) => setParsedData({
                      ...parsedData,
                      technicalSkills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                    })}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-slate-600 focus:border-orange-500 outline-none"
                  />
                </div>

                {/* Tools & Frameworks */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                    Tools & Frameworks (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={parsedData.toolsFrameworks?.join(", ") || ""}
                    onChange={(e) => setParsedData({
                      ...parsedData,
                      toolsFrameworks: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                    })}
                    className="w-full h-9 rounded-xl border border-slate-200 px-3 text-slate-600 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. AI Analytics Dashboard (Right panel) */}
            <div className="space-y-6">
              {/* Job Selector & Analytics Overview */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                    Select Target Job Role
                  </label>
                  <select
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 px-3 py-1.5 outline-none bg-white text-slate-600 font-semibold"
                  >
                    {Object.keys(ROLE_SKILLS_MAP).map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                {/* Progress Circles */}
                <div className="flex justify-around items-center border-t border-slate-50 pt-4 pb-2">
                  <CircularProgress value={scores.atsScore} label="ATS Score" colorClass="stroke-red-500" />
                  <CircularProgress value={scores.matchScore} label="Match Score" colorClass="stroke-orange-500" />
                  <CircularProgress value={scores.skillMatchPercentage} label="Skills Match" colorClass="stroke-blue-500" />
                </div>

                {/* Resume Completeness */}
                <div className="space-y-1.5 text-left border-t border-slate-50 pt-3">
                  <div className="flex justify-between text-[10px] font-bold text-slate-600">
                    <span>Resume Completeness Indicator</span>
                    <span>{scores.completeness}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${scores.completeness}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Matched vs Missing Skills List */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 text-left">
                <h3 className="font-display text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2">
                  Skill Comparison Details
                </h3>

                <div className="space-y-4">
                  {/* Matched */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Matched Skills ({matchedSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {matchedSkills.length > 0 ? (
                        matchedSkills.map((s, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-700">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 italic text-[10.5px]">No matching skills found for this role.</span>
                      )}
                    </div>
                  </div>

                  {/* Missing */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" /> Missing Key Skills ({missingSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {missingSkills.length > 0 ? (
                        missingSkills.map((s, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg bg-red-50 border border-red-100 text-[10px] font-bold text-red-600">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-emerald-600 font-bold text-[10.5px]">All target skills present!</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Strategic Insights */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 text-left">
                <h3 className="font-display text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2">
                  AI Strategic Recommendations
                </h3>

                <div className="space-y-3.5 font-sans">
                  {/* Strengths */}
                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 block">Candidate Strengths</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-500 text-[10.5px]">
                      {strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 block">Areas for Improvement</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-500 text-[10.5px]">
                      {improvements.map((i, idx) => <li key={idx}>{i}</li>)}
                    </ul>
                  </div>

                  {/* ATS Tips */}
                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 block flex items-center gap-1 text-[10.5px]">
                      <Lightbulb className="h-3.5 w-3.5 text-amber-500" /> ATS Compatibility Recommendations
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-500 text-[10.5px]">
                      {recommendations.map((r, idx) => <li key={idx}>{r}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
