import { NextRequest, NextResponse } from "next/server";
import { getAICompletion } from "@/lib/ai/services/aiService";
// @ts-ignore
import * as pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const runtime = "nodejs";
export const maxDuration = 60; // 60s Vercel serverless function timeout extension

const MAX_RESUME_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_RESUME_MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain"
]);
const ALLOWED_RESUME_EXTENSIONS = new Set([".pdf", ".docx", ".txt"]);

function inferResumeType(fileName: string, fileMimeType?: string): { fileName: string; fileMimeType: string } {
  const lowerName = (fileName || "").toLowerCase();
  const extension = lowerName.includes(".") ? lowerName.slice(lowerName.lastIndexOf(".")) : "";
  const normalizedMimeType = (fileMimeType || "").toLowerCase();

  if (normalizedMimeType === "application/pdf" || extension === ".pdf") {
    return { fileName, fileMimeType: "application/pdf" };
  }

  if (normalizedMimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || extension === ".docx") {
    return { fileName, fileMimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
  }

  if (normalizedMimeType === "text/plain" || extension === ".txt") {
    return { fileName, fileMimeType: "text/plain" };
  }

  return { fileName, fileMimeType: normalizedMimeType || "text/plain" };
}

function validateResumeUpload(fileName: string, fileMimeType: string, fileSizeBytes: number) {
  const inferred = inferResumeType(fileName, fileMimeType);
  const extension = (inferred.fileName || "").toLowerCase().includes(".")
    ? (inferred.fileName || "").toLowerCase().slice((inferred.fileName || "").toLowerCase().lastIndexOf("."))
    : "";

  if (fileSizeBytes > MAX_RESUME_FILE_SIZE_BYTES) {
    return {
      valid: false,
      status: 413,
      error: `File too large. Please upload a resume smaller than 5MB.`
    };
  }

  if (!ALLOWED_RESUME_MIME_TYPES.has(inferred.fileMimeType) && !ALLOWED_RESUME_EXTENSIONS.has(extension)) {
    return {
      valid: false,
      status: 400,
      error: "Invalid file type. Please upload a PDF, DOCX, or TXT resume."
    };
  }

  return { valid: true, fileMimeType: inferred.fileMimeType };
}

// Extended predefined skills normalization alias database mapped to 14 groups
const SKILL_ALIASES: Record<string, { name: string; category: string }> = {
  // Programming Languages
  "js": { name: "JavaScript", category: "programmingLanguages" },
  "javascript": { name: "JavaScript", category: "programmingLanguages" },
  "ts": { name: "TypeScript", category: "programmingLanguages" },
  "typescript": { name: "TypeScript", category: "programmingLanguages" },
  "py": { name: "Python", category: "programmingLanguages" },
  "python": { name: "Python", category: "programmingLanguages" },
  "java": { name: "Java", category: "programmingLanguages" },
  "c#": { name: "C#", category: "programmingLanguages" },
  "c sharp": { name: "C#", category: "programmingLanguages" },
  "c++": { name: "C++", category: "programmingLanguages" },
  "cplusplus": { name: "C++", category: "programmingLanguages" },
  "go": { name: "Go", category: "programmingLanguages" },
  "golang": { name: "Go", category: "programmingLanguages" },
  "rust": { name: "Rust", category: "programmingLanguages" },
  "ruby": { name: "Ruby", category: "programmingLanguages" },
  "php": { name: "PHP", category: "programmingLanguages" },
  "kotlin": { name: "Kotlin", category: "programmingLanguages" },
  "swift": { name: "Swift", category: "programmingLanguages" },
  
  // Frameworks
  "react.js": { name: "React", category: "frameworks" },
  "reactjs": { name: "React", category: "frameworks" },
  "react": { name: "React", category: "frameworks" },
  "nextjs": { name: "Next.js", category: "frameworks" },
  "next.js": { name: "Next.js", category: "frameworks" },
  "django": { name: "Django", category: "frameworks" },
  "fastapi": { name: "FastAPI", category: "frameworks" },
  "flask": { name: "Flask", category: "frameworks" },
  "springboot": { name: "Spring Boot", category: "frameworks" },
  "spring boot": { name: "Spring Boot", category: "frameworks" },
  "spring": { name: "Spring Boot", category: "frameworks" },
  "vue": { name: "Vue.js", category: "frameworks" },
  "vuejs": { name: "Vue.js", category: "frameworks" },
  "vue.js": { name: "Vue.js", category: "frameworks" },
  "angular": { name: "Angular", category: "frameworks" },
  "nestjs": { name: "NestJS", category: "frameworks" },
  
  // Frontend
  "html": { name: "HTML5", category: "frontend" },
  "html5": { name: "HTML5", category: "frontend" },
  "css": { name: "CSS3", category: "frontend" },
  "css3": { name: "CSS3", category: "frontend" },
  "tailwind": { name: "Tailwind CSS", category: "frontend" },
  "tailwindcss": { name: "Tailwind CSS", category: "frontend" },
  "sass": { name: "Sass", category: "frontend" },
  "bootstrap": { name: "Bootstrap", category: "frontend" },
  "redux": { name: "Redux", category: "frontend" },
  "zustand": { name: "Zustand", category: "frontend" },
  "webpack": { name: "Webpack", category: "frontend" },
  "vite": { name: "Vite", category: "frontend" },
  
  // Backend
  "node": { name: "Node.js", category: "backend" },
  "nodejs": { name: "Node.js", category: "backend" },
  "node.js": { name: "Node.js", category: "backend" },
  "express": { name: "Express.js", category: "backend" },
  "expressjs": { name: "Express.js", category: "backend" },
  "graphql": { name: "GraphQL", category: "backend" },
  "rest api": { name: "REST APIs", category: "backend" },
  "rest apis": { name: "REST APIs", category: "backend" },
  
  // Databases
  "postgres": { name: "PostgreSQL", category: "databases" },
  "postgresql": { name: "PostgreSQL", category: "databases" },
  "mongodb": { name: "MongoDB", category: "databases" },
  "mongo": { name: "MongoDB", category: "databases" },
  "mysql": { name: "MySQL", category: "databases" },
  "redis": { name: "Redis", category: "databases" },
  "sqlite": { name: "SQLite", category: "databases" },
  "prisma": { name: "Prisma", category: "databases" },
  
  // Cloud
  "aws": { name: "AWS", category: "cloud" },
  "amazon web services": { name: "AWS", category: "cloud" },
  "supabase": { name: "Supabase", category: "cloud" },
  "azure": { name: "Azure", category: "cloud" },
  "gcp": { name: "Google Cloud", category: "cloud" },
  "google cloud": { name: "Google Cloud", category: "cloud" },
  "vercel": { name: "Vercel", category: "cloud" },
  
  // DevOps
  "docker": { name: "Docker", category: "devops" },
  "kubernetes": { name: "Kubernetes", category: "devops" },
  "k8s": { name: "Kubernetes", category: "devops" },
  "git": { name: "Git", category: "devops" },
  "github": { name: "Git", category: "devops" },
  "gitlab": { name: "Git", category: "devops" },
  "terraform": { name: "Terraform", category: "devops" },
  "ci/cd": { name: "CI/CD", category: "devops" },
  
  // Testing
  "jest": { name: "Jest", category: "testing" },
  "cypress": { name: "Cypress", category: "testing" },
  "selenium": { name: "Selenium", category: "testing" },
  "playwright": { name: "Playwright", category: "testing" },
  
  // AI/ML
  "pytorch": { name: "PyTorch", category: "aiml" },
  "tensorflow": { name: "TensorFlow", category: "aiml" },
  "pandas": { name: "Pandas", category: "aiml" },
  "numpy": { name: "NumPy", category: "aiml" },
  "scikit-learn": { name: "Scikit-learn", category: "aiml" },
  "nlp": { name: "NLP", category: "aiml" },
  
  // Mobile
  "react native": { name: "React Native", category: "mobile" },
  "flutter": { name: "Flutter", category: "mobile" },
  
  // Tools
  "postman": { name: "Postman", category: "tools" },
  "figma": { name: "Figma", category: "tools" },
  "jira": { name: "Jira", category: "tools" },
  
  // Operating Systems
  "linux": { name: "Linux", category: "operatingSystems" },
  "ubuntu": { name: "Linux", category: "operatingSystems" },
  "windows": { name: "Windows", category: "operatingSystems" },
  "macos": { name: "macOS", category: "operatingSystems" },
  
  // Networking
  "dns": { name: "DNS", category: "networking" },
  "http": { name: "HTTP", category: "networking" },
  "https": { name: "HTTPS", category: "networking" },
  
  // Cyber Security
  "oauth": { name: "OAuth", category: "cyberSecurity" },
  "jwt": { name: "JWT", category: "cyberSecurity" },
  "owasp": { name: "OWASP", category: "cyberSecurity" }
};

// PDF Parser using in-memory pdf-parse
async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  try {
    // @ts-ignore
    const parseFn = typeof pdfParse === "function" ? pdfParse : (pdfParse.default || pdfParse);
    if (typeof parseFn === "function") {
      const data = await parseFn(buffer);
      if (data && data.text) return data.text;
    }
  } catch (e) {
    console.warn("pdf-parse failed on buffer, engaging string fallback:", e);
  }
  return buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ");
}

// DOCX Parser using mammoth
async function parseDocxBuffer(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (err) {
    console.error("docx parsing failed:", err);
    return "";
  }
}

function cleanText(text: string): string {
  return text
    .replace(/[ \t]+/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

// Phase 1 — Resume Segmentation Scanner
interface SectionRegex {
  key: string;
  regex: RegExp;
}

const SECTION_RULES: SectionRegex[] = [
  { key: "bio", regex: /^(?:professional\s+summary|summary|career\s+objective|about\s+me|about|profile)/i },
  { key: "education", regex: /^(?:education|academic\s+background|qualifications|educational\s+qualifications|academic\s+history|academic\s+info)/i },
  { key: "experience", regex: /^(?:experience|work\s+experience|professional\s+experience|employment\s+history|employment|work\s+history)/i },
  { key: "projects", regex: /^(?:projects|personal\s+projects|academic\s+projects|portfolio\s+projects|key\s+projects)/i },
  { key: "certifications", regex: /^(?:certifications|courses|licenses|credentials|certifications\s+&\s+courses)/i },
  { key: "internships", regex: /^(?:internships|internship\s+experience|internship\s+history)/i },
  { key: "achievements", regex: /^(?:achievements|awards|honors|awards\s+&\s+achievements)/i },
  { key: "skills", regex: /^(?:skills|technical\s+skills|core\s+competencies|expertise|technologies)/i }
];

function segmentResumeText(text: string): Record<string, string> {
  const sections: Record<string, string> = {
    personal: "" // Default personal information section
  };

  const lines = text.split("\n");
  let currentSection = "personal";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line matches any section heading rule
    let headingMatched = false;
    for (const rule of SECTION_RULES) {
      if (rule.regex.test(trimmed)) {
        currentSection = rule.key;
        sections[currentSection] = (sections[currentSection] || "") + line + "\n";
        headingMatched = true;
        break;
      }
    }

    if (!headingMatched) {
      sections[currentSection] = (sections[currentSection] || "") + line + "\n";
    }
  }

  return sections;
}

// Robust fallback Name extractor
function cleanAndExtractName(text: string, fileName: string): string {
  const cleanFileName = fileName
    .replace(/_Resume|_resume|\.pdf|\.docx|\.txt|[-_]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  
  const fileWords = cleanFileName.split(" ").filter(w => w.length > 0);
  const nameWords = fileWords.filter(w => !/resume|cv|curriculum|vitae|profile|internship|job|apply|builder/i.test(w));
  
  if (nameWords.length >= 2 && nameWords.length <= 4) {
    const capitalizedName = nameWords
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
    return capitalizedName;
  }
  
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  for (let i = 0; i < Math.min(8, lines.length); i++) {
    const line = lines[i];
    if (/@|\+?\d{4,}|www\.|http|\.com|\.org/.test(line)) continue;
    
    const words = line.split(/\s+/);
    const isCapitalized = words.every(w => /^[A-Z][a-zA-Z]*$/.test(w));
    const containsStopWords = /resume|cv|curriculum|contact|email|phone|profile|portfolio/i.test(line);
    
    if (isCapitalized && words.length >= 2 && words.length <= 4 && !containsStopWords) {
      return line;
    }
  }
  
  if (nameWords.length > 0) {
    return nameWords.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  }
  
  return "Candidate";
}

// Robust URL extractor scanning the FULL text
function extractUrlsFromText(text: string) {
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9%_\-]+)/i;
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|pub|profile)\/([a-zA-Z0-9%_\-]+)/i;
  
  const githubMatch = text.match(githubRegex);
  const linkedinMatch = text.match(linkedinRegex);
  
  const genericUrlRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(?:\/[^\s]*)?)/gi;
  const matches = text.match(genericUrlRegex) || [];
  let portfolio = "";
  for (const m of matches) {
    const url = m.toLowerCase();
    if (!url.includes("linkedin.com") && !url.includes("github.com") && !url.includes("resume") && !url.includes("email") && !url.includes("png") && !url.includes("jpg")) {
      portfolio = m.startsWith("http") ? m : `https://${m}`;
      break;
    }
  }
  
  return {
    github: githubMatch ? `https://github.com/${githubMatch[1]}` : "",
    linkedin: linkedinMatch ? `https://www.linkedin.com/in/${linkedinMatch[1]}` : "",
    portfolio: portfolio.replace(/[.,;]$/, "")
  };
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let fileName = "resume";
    let fileMimeType = "text/plain";
    let buffer: Buffer | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const uploadedFile = formData.get("file");

      if (!uploadedFile || typeof uploadedFile === "string") {
        return NextResponse.json({ success: false, error: "Missing file payload." }, { status: 400 });
      }

      const file = uploadedFile as File;
      fileName = file.name || fileName;
      fileMimeType = file.type || fileMimeType;
      buffer = Buffer.from(await file.arrayBuffer());
    } else {
      const body = await req.json().catch(() => null);
      const { fileName: bodyFileName, fileBase64, fileMimeType: bodyMimeType } = body || {};

      if (!bodyFileName || !fileBase64) {
        return NextResponse.json({ success: false, error: "Missing file payload." }, { status: 400 });
      }

      fileName = bodyFileName;
      fileMimeType = bodyMimeType || fileMimeType;
      buffer = Buffer.from(fileBase64, "base64");
    }

    if (!buffer) {
      return NextResponse.json({ success: false, error: "Upload failed: no file content was received." }, { status: 400 });
    }

    const validation = validateResumeUpload(fileName, fileMimeType, buffer.length);
    if (!validation.valid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: validation.status });
    }

    fileMimeType = validation.fileMimeType || fileMimeType;

    let rawText = "";

    if (fileMimeType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf")) {
      rawText = await parsePdfBuffer(buffer);
    } else if (
      fileMimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.toLowerCase().endsWith(".docx")
    ) {
      rawText = await parseDocxBuffer(buffer);
    } else {
      rawText = buffer.toString("utf-8");
    }

    const cleanedText = cleanText(rawText);

    // Phase 1 & 2: Segmentation & Section Classification
    const segmentedBlocks = segmentResumeText(cleanedText);

    // Phase 3: Hybrid Extraction
    const extractedUrls = extractUrlsFromText(cleanedText);

    const emailMatch = cleanedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const parsedEmail = emailMatch ? emailMatch[0].trim() : "";

    const phoneMatch = cleanedText.match(/\+?\d[\d\s.-]{8,15}\d/);
    const parsedPhone = phoneMatch ? phoneMatch[0].trim() : "";

    const locationMatch = cleanedText.match(/(?:london|new york|san francisco|tokyo|toronto|berlin|paris|chicago|austin|seattle|vancouver)/i);
    const parsedLocation = locationMatch ? locationMatch[0].charAt(0).toUpperCase() + locationMatch[0].slice(1) : "";

    // Deterministic Skill Normalization
    const skillsText = segmentedBlocks.skills || cleanedText;
    const words = skillsText.toLowerCase().split(/[\s,()\-]+/);
    const combinedSkillsSet = new Set<string>();

    const categorizedSkills: Record<string, string[]> = {
      programmingLanguages: [],
      frameworks: [],
      frontend: [],
      backend: [],
      databases: [],
      cloud: [],
      devops: [],
      testing: [],
      aiml: [],
      mobile: [],
      tools: [],
      operatingSystems: [],
      networking: [],
      cyberSecurity: []
    };

    for (const word of words) {
      if (SKILL_ALIASES[word]) {
        const item = SKILL_ALIASES[word];
        combinedSkillsSet.add(item.name);
        if (!categorizedSkills[item.category]) {
          categorizedSkills[item.category] = [];
        }
        if (!categorizedSkills[item.category].includes(item.name)) {
          categorizedSkills[item.category].push(item.name);
        }
      }
    }

    // AI Semantic Extraction
    let fullName = "";
    let headline = "";
    let bio = "";
    let safeEducation: any[] = [];
    let safeExperience: any[] = [];
    let safeProjects: any[] = [];
    let safeCertifications: any[] = [];
    let safeInternships: any[] = [];
    let safeAchievements: any[] = [];
    let softSkills: string[] = [];
    let candidateProfile = "";
    let careerDomain = "";
    let aiSkills: string[] = [];

    const promptPass = `
Act as an ATS parser. Return strict JSON.
{
  "fullName": "Name", "headline": "Title", "bio": "Summary", "aiSkills": ["List of skills"],
  "education": [], "experience": [], "projects": [], "certifications": [], "internships": [], "achievements": [], "softSkills": [],
  "candidateProfile": "Summary", "careerDomain": "Domain"
}
Text: ${cleanedText.substring(0, 8000)}
    `.trim();

    try {
      const aiRes = await getAICompletion(promptPass);
      if (aiRes.success && aiRes.text) {
        const cleanJson = aiRes.text.replace(/```json|```/g, "").trim();
        const obj = JSON.parse(cleanJson);
        fullName = obj.fullName || "";
        headline = obj.headline || "";
        bio = obj.bio || "";
        aiSkills = Array.isArray(obj.aiSkills) ? obj.aiSkills : [];
        safeEducation = Array.isArray(obj.education) ? obj.education : [];
        safeExperience = Array.isArray(obj.experience) ? obj.experience : [];
        safeProjects = Array.isArray(obj.projects) ? obj.projects : [];
        safeCertifications = Array.isArray(obj.certifications) ? obj.certifications : [];
        safeInternships = Array.isArray(obj.internships) ? obj.internships : [];
        safeAchievements = Array.isArray(obj.achievements) ? obj.achievements : [];
        softSkills = Array.isArray(obj.softSkills) ? obj.softSkills : [];
        candidateProfile = obj.candidateProfile || "";
        careerDomain = obj.careerDomain || "";
      }
    } catch (err) {
      console.warn("AI parsing failed:", err);
    }

    for (const skill of aiSkills) {
      if (!skill) continue;
      const skillClean = skill.trim();
      const skillLower = skillClean.toLowerCase();
      if (SKILL_ALIASES[skillLower]) {
        const item = SKILL_ALIASES[skillLower];
        combinedSkillsSet.add(item.name);
        if (!categorizedSkills[item.category]) categorizedSkills[item.category] = [];
        if (!categorizedSkills[item.category].includes(item.name)) categorizedSkills[item.category].push(item.name);
      } else {
        combinedSkillsSet.add(skillClean);
        if (!categorizedSkills.tools) categorizedSkills.tools = [];
        if (!categorizedSkills.tools.includes(skillClean)) categorizedSkills.tools.push(skillClean);
      }
    }

    if (!fullName || fullName.toLowerCase().includes("resume")) {
      fullName = cleanAndExtractName(cleanedText, fileName);
    }
    
    if (!candidateProfile) candidateProfile = `${fullName} is a ${careerDomain || "Professional"}.`;

    const completenessMetrics: Record<string, number> = {
      personal: (fullName ? 25 : 0) + (parsedEmail ? 25 : 0) + (parsedPhone ? 25 : 0) + (parsedLocation ? 25 : 0),
      education: safeEducation.length > 0 ? Math.round((safeEducation.filter(e => e && typeof e === 'object' && e.degree && e.institution && e.endYear).length / safeEducation.length) * 100) : 0,
      experience: safeExperience.length > 0 ? Math.round((safeExperience.filter(exp => exp && typeof exp === 'object' && exp.companyName && exp.role).length / safeExperience.length) * 100) : 0,
      projects: safeProjects.length > 0 ? Math.round((safeProjects.filter(p => p && typeof p === 'object' && p.projectTitle && p.description).length / safeProjects.length) * 100) : 0,
      skills: combinedSkillsSet.size > 0 ? 100 : 0,
      certifications: safeCertifications.length > 0 ? 100 : 0,
      achievements: safeAchievements.length > 0 ? 100 : 0
    };

    const overallCompleteness = Math.round(
      Object.values(completenessMetrics).reduce((a, b) => a + b, 0) / (Object.values(completenessMetrics).length || 1)
    );

    const confidenceScores: Record<string, number> = {
      fullName: fullName ? 100 : 0,
      email: parsedEmail ? 100 : 0,
      phone: parsedPhone ? 100 : 0,
      location: parsedLocation ? 100 : 0,
      linkedin: extractedUrls.linkedin ? 100 : 0,
      github: extractedUrls.github ? 100 : 0,
      portfolioWebsite: extractedUrls.portfolio ? 100 : 0,
      education: safeEducation.length > 0 ? Math.round((safeEducation.filter(e => e && typeof e === 'object' && e.degree && e.institution).length / safeEducation.length) * 100) : 0,
      experience: safeExperience.length > 0 ? Math.round((safeExperience.filter(exp => exp && typeof exp === 'object' && exp.companyName && exp.role).length / safeExperience.length) * 100) : 0,
      projects: safeProjects.length > 0 ? Math.round((safeProjects.filter(p => p && typeof p === 'object' && p.projectTitle && p.description).length / safeProjects.length) * 100) : 0,
      certifications: safeCertifications.length > 0 ? 100 : 0,
      bio: -1,
      softSkills: -1
    };

    return NextResponse.json({
      success: true,
      result: {
        fullName,
        headline,
        email: parsedEmail,
        phone: parsedPhone,
        location: parsedLocation,
        linkedin: extractedUrls.linkedin,
        github: extractedUrls.github,
        portfolioWebsite: extractedUrls.portfolio,
        bio,
        education: safeEducation,
        experience: safeExperience,
        projects: safeProjects,
        certifications: safeCertifications,
        internships: safeInternships,
        achievements: safeAchievements,
        technicalSkills: Array.from(combinedSkillsSet),
        softSkills,
        ...categorizedSkills,
        candidateProfile,
        careerDomain,
        overallCompleteness,
        completenessMetrics
      },
      confidenceScores
    });

  } catch (error: any) {
    console.error("[resume-upload] parser failed", {
      message: error?.message,
      stack: error?.stack
    });
    return NextResponse.json(
      { success: false, error: "Upload failed: unable to process the resume. Please try again." },
      { status: 500 }
    );
  }
}
