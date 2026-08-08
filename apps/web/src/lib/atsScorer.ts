import { ParsedResume, EducationEntry, ExperienceEntry, ProjectEntry, CertificationEntry, AchievementEntry } from "./ai/store/resumeStore";

export interface CategoryBreakdown {
  category: string;
  score: number;
  maxScore: number;
  status: "excellent" | "good" | "needs_improvement" | "missing";
  details: string;
}

export interface DeductionItem {
  id: string;
  category: string;
  pointsDeducted: number;
  reason: string;
  recommendation: string;
}

export interface ATSScoreResult {
  totalScore: number;
  breakdown: {
    contactInfo: CategoryBreakdown;
    summary: CategoryBreakdown;
    technicalSkills: CategoryBreakdown;
    experience: CategoryBreakdown;
    projects: CategoryBreakdown;
    education: CategoryBreakdown;
    certifications: CategoryBreakdown;
    achievements: CategoryBreakdown;
    qualityAndFormatting: CategoryBreakdown;
  };
  deductions: DeductionItem[];
  missingSections: string[];
  suggestions: string[];
  badge: {
    label: string;
    color: string;
    description: string;
  };
}

// Common placeholder patterns to strictly ignore
const PLACEHOLDER_PATTERNS = [
  /lorem\s+ipsum/i,
  /sample\s+text/i,
  /add\s+summary/i,
  /your\s+name/i,
  /your\s+summary/i,
  /your\s+description/i,
  /company\s+name/i,
  /job\s+title/i,
  /project\s+title/i,
  /college\s+name/i,
  /degree\s+name/i,
  /placeholder/i,
  /^n\/a$/i,
  /^none$/i,
  /^test$/i,
  /^abc$/i,
  /^xxx$/i,
  /^temp$/i,
  /^\-+$/,
  /^\.+$/
];

const ACTION_VERBS = [
  "engineered", "developed", "built", "optimized", "spearheaded", "designed",
  "architected", "implemented", "increased", "reduced", "delivered", "launched",
  "managed", "automated", "improved", "created", "deployed", "transformed",
  "scaled", "orchestrated", "refactored", "pioneered", "accelerated", "integrated"
];

function isPlaceholder(text: string | undefined | null): boolean {
  if (!text) return true;
  const trimmed = String(text).trim();
  if (trimmed.length < 2) return true;
  return PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(trimmed));
}

function countRealWords(text: string | undefined | null): number {
  if (!text || isPlaceholder(text)) return 0;
  const words = String(text)
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
  return words.length;
}

function extractMetrics(text: string | undefined | null): string[] {
  if (!text || isPlaceholder(text)) return [];
  const metrics: string[] = [];
  const str = String(text);
  
  const percentMatches = str.match(/\b\d+(\.\d+)?%\b/g);
  if (percentMatches) metrics.push(...percentMatches);

  const currencyMatches = str.match(/\$\d+([,.]\d+)?[kKMbB]?\b/g);
  if (currencyMatches) metrics.push(...currencyMatches);

  const scaleMatches = str.match(/\b\d+x\b|\b\d{2,}\+\b/g);
  if (scaleMatches) metrics.push(...scaleMatches);

  return Array.from(new Set(metrics));
}

function countActionVerbs(text: string | undefined | null): number {
  if (!text || isPlaceholder(text)) return 0;
  const lower = String(text).toLowerCase();
  let count = 0;
  for (const verb of ACTION_VERBS) {
    if (lower.includes(verb)) count++;
  }
  return count;
}

export function calculateATSScoreDetails(resume: ParsedResume): ATSScoreResult {
  const deductions: DeductionItem[] = [];
  const missingSections: string[] = [];
  const suggestions: string[] = [];

  // A. Contact Info (10 Points)
  let contactScore = 0;
  const hasName = !isPlaceholder(resume.fullName) && (resume.fullName?.trim().length ?? 0) >= 3;
  const hasEmail = !isPlaceholder(resume.email) && Boolean(resume.email?.includes("@") && resume.email?.includes("."));
  const hasPhone = !isPlaceholder(resume.phone) && Boolean(resume.phone && resume.phone.replace(/\D/g, "").length >= 7);
  const hasLinkedin = !isPlaceholder(resume.linkedin) && Boolean(resume.linkedin && resume.linkedin.toLowerCase().includes("linkedin"));
  const hasLocation = !isPlaceholder(resume.location) && (resume.location?.trim().length ?? 0) >= 3;

  if (hasName) contactScore += 2;
  else {
    deductions.push({
      id: "contact_name",
      category: "Contact Information",
      pointsDeducted: 2,
      reason: "Full Name is missing or invalid.",
      recommendation: "Provide your complete full name at the top of the resume."
    });
  }

  if (hasEmail) contactScore += 2;
  else {
    deductions.push({
      id: "contact_email",
      category: "Contact Information",
      pointsDeducted: 2,
      reason: "Valid Email Address is missing.",
      recommendation: "Include a professional email address (e.g. name@domain.com)."
    });
  }

  if (hasPhone) contactScore += 2;
  else {
    deductions.push({
      id: "contact_phone",
      category: "Contact Information",
      pointsDeducted: 2,
      reason: "Phone number is missing or incomplete.",
      recommendation: "Add a valid phone number with country code."
    });
  }

  if (hasLinkedin) contactScore += 2;
  else {
    deductions.push({
      id: "contact_linkedin",
      category: "Contact Information",
      pointsDeducted: 2,
      reason: "LinkedIn profile URL is missing.",
      recommendation: "Add your customized LinkedIn profile link for recruiter verification."
    });
  }

  if (hasLocation) contactScore += 2;
  else {
    deductions.push({
      id: "contact_location",
      category: "Contact Information",
      pointsDeducted: 2,
      reason: "Location (City, Country) is missing.",
      recommendation: "Include your current location (e.g., Indore, India) for ATS location matching."
    });
  }

  // B. Summary (10 Points)
  let summaryScore = 0;
  const summaryWords = countRealWords(resume.bio);
  const summaryActionVerbs = countActionVerbs(resume.bio);

  if (summaryWords === 0) {
    missingSections.push("Professional Summary");
    deductions.push({
      id: "summary_empty",
      category: "Professional Summary",
      pointsDeducted: 10,
      reason: "Professional summary is missing or contains placeholder text.",
      recommendation: "Write a compelling 40+ word summary highlighting your technical domain expertise and career objectives."
    });
  } else if (summaryWords < 15) {
    summaryScore = 2;
    deductions.push({
      id: "summary_too_short",
      category: "Professional Summary",
      pointsDeducted: 8,
      reason: `Summary is too brief (${summaryWords} words).`,
      recommendation: "Expand your summary to at least 40 words with key achievements and domain focus."
    });
  } else if (summaryWords < 30) {
    summaryScore = 5;
    deductions.push({
      id: "summary_short",
      category: "Professional Summary",
      pointsDeducted: 5,
      reason: `Summary length (${summaryWords} words) is below recommended 40-word depth.`,
      recommendation: "Add core competencies and career metrics to reach 40+ words."
    });
  } else if (summaryWords < 40) {
    summaryScore = 7;
    deductions.push({
      id: "summary_moderate",
      category: "Professional Summary",
      pointsDeducted: 3,
      reason: `Summary is ${summaryWords} words (target 40+ words for full points).`,
      recommendation: "Include 1-2 additional sentences emphasizing specialized tools or leadership qualities."
    });
  } else {
    summaryScore = 8;
  }

  if (summaryWords >= 15 && summaryActionVerbs > 0) {
    summaryScore = Math.min(10, summaryScore + 2);
  }

  // C. Technical Skills (15 Points)
  let skillsScore = 0;
  const rawSkills = (resume.technicalSkills || [])
    .filter((s) => !isPlaceholder(s))
    .map((s) => String(s).trim());
  const uniqueSkills = Array.from(new Set(rawSkills));

  if (uniqueSkills.length === 0) {
    missingSections.push("Technical Skills");
    deductions.push({
      id: "skills_empty",
      category: "Technical Skills",
      pointsDeducted: 15,
      reason: "No technical skills listed.",
      recommendation: "Add at least 8 relevant technical skills categorized into Languages, Frameworks, and Tools."
    });
  } else if (uniqueSkills.length < 3) {
    skillsScore = 3;
    deductions.push({
      id: "skills_very_few",
      category: "Technical Skills",
      pointsDeducted: 12,
      reason: `Only ${uniqueSkills.length} skills listed (minimum 8 recommended).`,
      recommendation: "List core programming languages, frameworks, databases, and DevOps tools."
    });
  } else if (uniqueSkills.length < 6) {
    skillsScore = 7;
    deductions.push({
      id: "skills_few",
      category: "Technical Skills",
      pointsDeducted: 8,
      reason: `${uniqueSkills.length} skills listed (target 8+ skills for optimal ATS keyword indexing).`,
      recommendation: "Add technical tools and frameworks relevant to your target engineering roles."
    });
  } else if (uniqueSkills.length < 8) {
    skillsScore = 10;
    deductions.push({
      id: "skills_moderate",
      category: "Technical Skills",
      pointsDeducted: 5,
      reason: `${uniqueSkills.length} skills listed (target 8+ for full category score).`,
      recommendation: "Add 2-3 additional relevant technical competencies."
    });
  } else {
    skillsScore = 12;
  }

  // Skill categorization check
  const skillCategories = (resume as any).skillCategories || {};
  const filledCategories = Object.keys(skillCategories).filter((catKey) => {
    const arr = skillCategories[catKey];
    return Array.isArray(arr) && arr.some((item: any) => !isPlaceholder(item));
  });

  if (filledCategories.length >= 2) {
    skillsScore = Math.min(15, skillsScore + 3);
  } else if (uniqueSkills.length >= 8) {
    skillsScore = Math.min(15, skillsScore + 1);
  }

  // D. Experience (20 Points)
  let expScore = 0;
  const validExperiences = (resume.experience || []).filter((e: any) => {
    const company = e.companyName || e.company;
    const role = e.role;
    return !isPlaceholder(company) || !isPlaceholder(role);
  });

  if (validExperiences.length === 0) {
    missingSections.push("Work Experience");
    deductions.push({
      id: "exp_empty",
      category: "Work Experience",
      pointsDeducted: 20,
      reason: "No work experience or internship entries provided.",
      recommendation: "Add internships, freelance work, or university research roles detailing accomplishments."
    });
  } else {
    let expPointsTotal = 0;
    let totalExpMetrics = 0;

    validExperiences.slice(0, 2).forEach((exp: any) => {
      let entryPoints = 0;
      const company = exp.companyName || exp.company;
      const role = exp.role;
      const duration = exp.duration || exp.startDate;
      const desc = exp.responsibilities || exp.description;

      if (!isPlaceholder(company)) entryPoints += 1.5;
      if (!isPlaceholder(role)) entryPoints += 1.5;
      if (!isPlaceholder(duration)) entryPoints += 1;

      const descWords = countRealWords(desc);
      const ach = Array.isArray(exp.achievements) ? exp.achievements.filter((a: any) => !isPlaceholder(a)) : [];
      
      if (descWords >= 20 || ach.length >= 2) {
        entryPoints += 3;
      } else if (descWords > 0) {
        entryPoints += 1;
      }

      // Metric detection
      const metricsInDesc = extractMetrics(desc);
      const metricsInAch = ach.flatMap((a: any) => extractMetrics(a));
      const combinedMetrics = Array.from(new Set([...metricsInDesc, ...metricsInAch]));
      totalExpMetrics += combinedMetrics.length;

      if (combinedMetrics.length >= 2) entryPoints += 3;
      else if (combinedMetrics.length === 1) entryPoints += 1.5;

      expPointsTotal += entryPoints;
    });

    expScore = Math.min(20, Math.round(expPointsTotal * 2));

    if (totalExpMetrics === 0) {
      deductions.push({
        id: "exp_no_metrics",
        category: "Work Experience",
        pointsDeducted: 5,
        reason: "Work experience lacks quantified metrics (e.g. %, $, numbers, scale).",
        recommendation: "Include quantifiable outcomes (e.g. 'Improved API response speed by 40%', 'Managed 500+ users')."
      });
    }
  }

  // E. Projects (15 Points)
  let projScore = 0;
  const validProjects = (resume.projects || []).filter((p: any) => {
    const title = p.projectTitle || p.title;
    const desc = p.description;
    return !isPlaceholder(title) || !isPlaceholder(desc);
  });

  if (validProjects.length === 0) {
    missingSections.push("Projects");
    deductions.push({
      id: "proj_empty",
      category: "Projects",
      pointsDeducted: 15,
      reason: "No project entries provided.",
      recommendation: "Add at least 2 hands-on technical projects showcasing software engineering or analytical skills."
    });
  } else if (validProjects.length === 1) {
    const p1: any = validProjects[0];
    let p1Points = 4;
    const tech = p1.technologiesUsed;
    const hasTech = Array.isArray(tech) ? tech.length > 0 : !isPlaceholder(tech);

    if (hasTech) p1Points += 2.5;
    if (countRealWords(p1.description) >= 20) p1Points += 2.5;
    projScore = Math.min(9, Math.round(p1Points));

    deductions.push({
      id: "proj_only_one",
      category: "Projects",
      pointsDeducted: 6,
      reason: "Only 1 project listed (minimum 2 recommended for full ATS portfolio score).",
      recommendation: "Add a second project with tech stack details and quantifiable results."
    });
  } else {
    let projTotal = 0;
    validProjects.slice(0, 2).forEach((p: any) => {
      let pPoints = 3;
      const tech = p.technologiesUsed;
      const hasTech = Array.isArray(tech) ? tech.length > 0 : !isPlaceholder(tech);

      if (hasTech) pPoints += 2.5;
      if (countRealWords(p.description) >= 20) pPoints += 2;
      projTotal += pPoints;
    });
    projScore = Math.min(15, Math.round(projTotal));
  }

  // F. Education (10 Points)
  let eduScore = 0;
  const validEdu = (resume.education || []).filter((e: any) => {
    const degree = e.degree;
    const inst = e.institution || e.college;
    return !isPlaceholder(degree) || !isPlaceholder(inst);
  });

  if (validEdu.length === 0) {
    missingSections.push("Education");
    deductions.push({
      id: "edu_empty",
      category: "Education",
      pointsDeducted: 10,
      reason: "Education section is missing or empty.",
      recommendation: "List your degree, institution name, graduation year, and CGPA/percentage."
    });
  } else {
    const topEdu: any = validEdu[0];
    const inst = topEdu.institution || topEdu.college;
    const year = topEdu.endYear || topEdu.graduationYear || topEdu.year;
    const grade = topEdu.cgpa || topEdu.grade;

    if (!isPlaceholder(topEdu.degree)) eduScore += 3;
    if (!isPlaceholder(inst)) eduScore += 3;
    if (!isPlaceholder(year)) eduScore += 2;
    if (!isPlaceholder(grade)) eduScore += 2;

    if (eduScore < 10) {
      deductions.push({
        id: "edu_incomplete",
        category: "Education",
        pointsDeducted: 10 - eduScore,
        reason: "Education entry is partially incomplete (missing CGPA or graduation year).",
        recommendation: "Ensure degree title, university, graduation year, and CGPA/grade are explicitly stated."
      });
    }
  }

  // G. Certifications (5 Points)
  let certScore = 0;
  const validCerts = (resume.certifications || []).filter((c: any) => {
    const text = typeof c === "object" ? c.certificationName : c;
    return !isPlaceholder(text);
  });

  if (validCerts.length === 0) {
    deductions.push({
      id: "certs_empty",
      category: "Certifications",
      pointsDeducted: 5,
      reason: "No professional certifications listed.",
      recommendation: "Add verified course certifications (e.g. AWS, Meta, EpitomeTRC Certified)."
    });
  } else if (validCerts.length === 1) {
    certScore = 3;
    deductions.push({
      id: "certs_one",
      category: "Certifications",
      pointsDeducted: 2,
      reason: "1 certification listed.",
      recommendation: "Include additional technical certifications to reach full 5 points."
    });
  } else {
    certScore = 5;
  }

  // H. Achievements (5 Points)
  let achScore = 0;
  const validAch = (resume.achievements || []).filter((a: any) => {
    const text = typeof a === "object" ? a.title || a.description : a;
    return !isPlaceholder(text);
  });

  if (validAch.length === 0) {
    deductions.push({
      id: "ach_empty",
      category: "Achievements",
      pointsDeducted: 5,
      reason: "No honors, awards, or competitive achievements listed.",
      recommendation: "Highlight hackathon wins, academic honors, or organizational awards."
    });
  } else if (validAch.length === 1) {
    achScore = 3;
  } else {
    achScore = 5;
  }

  // I. Quality, Formatting & Originality (10 Points)
  let qualityScore = 10;

  // Penalty for duplicate text content (copy-paste detection)
  const allText = [
    resume.bio || "",
    ...(resume.experience || []).map((e: any) => `${e.role || ""} ${e.responsibilities || e.description || ""}`),
    ...(resume.projects || []).map((p: any) => `${p.projectTitle || p.title || ""} ${p.description || ""}`)
  ].join(" ").toLowerCase();

  const isRepeatedContent = (allText.match(/developed scalable applications/g) || []).length > 2 ||
                            (allText.match(/responsible for/g) || []).length > 3;

  if (isRepeatedContent) {
    qualityScore -= 4;
    deductions.push({
      id: "quality_duplicate_text",
      category: "Resume Quality",
      pointsDeducted: 4,
      reason: "Repetitive or boilerplate sentences detected across multiple sections.",
      recommendation: "Customize descriptions for each experience and project with unique outcomes."
    });
  }

  // Penalty for empty sections
  if (missingSections.length >= 3) {
    qualityScore -= 4;
  } else if (missingSections.length >= 1) {
    qualityScore -= 2;
  }

  qualityScore = Math.max(0, qualityScore);

  // Total Score Calculation
  const totalScore = Math.min(
    100,
    Math.max(
      0,
      contactScore +
        summaryScore +
        skillsScore +
        expScore +
        projScore +
        eduScore +
        certScore +
        achScore +
        qualityScore
    )
  );

  // Suggestions generation
  if (missingSections.length > 0) {
    suggestions.push(`Complete missing resume sections: ${missingSections.join(", ")}.`);
  }
  if (summaryWords < 40) {
    suggestions.push("Expand your Professional Summary to at least 40 words incorporating key action verbs.");
  }
  if (uniqueSkills.length < 8) {
    suggestions.push("Add more technical skills to reach at least 8 relevant technologies.");
  }
  if (validProjects.length < 2) {
    suggestions.push("Add at least 2 structured technical projects with technology stack details.");
  }
  if (validExperiences.length > 0 && expScore < 15) {
    suggestions.push("Include quantified achievements (e.g. percentages, metric gains) in work experience bullet points.");
  }

  // Badge determination
  let badgeLabel = "Needs Work";
  let badgeColor = "bg-rose-500 text-white";
  let badgeDesc = "Resume content is incomplete or lacks technical depth.";

  if (totalScore >= 90) {
    badgeLabel = "Excellent";
    badgeColor = "bg-emerald-500 text-white";
    badgeDesc = "Production-grade, highly optimized ATS resume.";
  } else if (totalScore >= 75) {
    badgeLabel = "Strong";
    badgeColor = "bg-indigo-500 text-white";
    badgeDesc = "Solid ATS compatibility with good content depth.";
  } else if (totalScore >= 60) {
    badgeLabel = "Good";
    badgeColor = "bg-amber-500 text-white";
    badgeDesc = "Fair ATS baseline, but needs additional metrics and skills.";
  } else if (totalScore >= 35) {
    badgeLabel = "Partially Complete";
    badgeColor = "bg-orange-500 text-white";
    badgeDesc = "Missing key sections or depth for recruiter indexing.";
  }

  const helperStatus = (score: number, max: number): "excellent" | "good" | "needs_improvement" | "missing" => {
    const ratio = score / max;
    if (ratio >= 0.9) return "excellent";
    if (ratio >= 0.6) return "good";
    if (ratio > 0) return "needs_improvement";
    return "missing";
  };

  return {
    totalScore,
    breakdown: {
      contactInfo: {
        category: "Contact Information",
        score: contactScore,
        maxScore: 10,
        status: helperStatus(contactScore, 10),
        details: `${contactScore}/10 points (Name, Email, Phone, LinkedIn, Location)`
      },
      summary: {
        category: "Professional Summary",
        score: summaryScore,
        maxScore: 10,
        status: helperStatus(summaryScore, 10),
        details: `${summaryWords} words, ${summaryActionVerbs} action verbs`
      },
      technicalSkills: {
        category: "Technical Skills",
        score: skillsScore,
        maxScore: 15,
        status: helperStatus(skillsScore, 15),
        details: `${uniqueSkills.length} unique skills across ${filledCategories.length} categories`
      },
      experience: {
        category: "Work Experience",
        score: expScore,
        maxScore: 20,
        status: helperStatus(expScore, 20),
        details: `${validExperiences.length} experience entries with quantified metrics`
      },
      projects: {
        category: "Projects",
        score: projScore,
        maxScore: 15,
        status: helperStatus(projScore, 15),
        details: `${validProjects.length} structured projects with technology stacks`
      },
      education: {
        category: "Education",
        score: eduScore,
        maxScore: 10,
        status: helperStatus(eduScore, 10),
        details: `${validEdu.length} education entry with degree & university`
      },
      certifications: {
        category: "Certifications",
        score: certScore,
        maxScore: 5,
        status: helperStatus(certScore, 5),
        details: `${validCerts.length} verified certifications`
      },
      achievements: {
        category: "Achievements",
        score: achScore,
        maxScore: 5,
        status: helperStatus(achScore, 5),
        details: `${validAch.length} awards or honors`
      },
      qualityAndFormatting: {
        category: "Quality & Formatting",
        score: qualityScore,
        maxScore: 10,
        status: helperStatus(qualityScore, 10),
        details: `${qualityScore}/10 points (Formatting, non-duplicate content, ATS safety)`
      }
    },
    deductions,
    missingSections,
    suggestions,
    badge: {
      label: badgeLabel,
      color: badgeColor,
      description: badgeDesc
    }
  };
}
