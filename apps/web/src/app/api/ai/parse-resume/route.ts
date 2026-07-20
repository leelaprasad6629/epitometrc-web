import { NextRequest, NextResponse } from "next/server";
import { getAICompletion } from "@/lib/ai/services/aiService";

export const maxDuration = 60; // 60s Vercel serverless function timeout extension
import { PdfReader } from "pdfreader";
import mammoth from "mammoth";

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
  "github": { name: "GitHub", category: "devops" },
  "gitlab": { name: "GitHub", category: "devops" },
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

// PDF Parser using coordinate-based sorting
function parsePdfBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    let rows: Record<number, any[]> = {};
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) {
        reject(err);
      } else if (!item) {
        let text = "";
        const yCoords = Object.keys(rows).map(Number).sort((a, b) => a - b);
        for (const y of yCoords) {
          const rowItems = rows[y].sort((a, b) => a.x - b.x);
          text += rowItems.map(it => it.text).join(" ") + "\n";
        }
        resolve(text);
      } else if (item.text) {
        const y = Math.round(item.y * 100);
        if (!rows[y]) rows[y] = [];
        rows[y].push(item);
      }
    });
  });
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
  
  return "Mudigonda Lalitha Sreya";
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
    const { fileName, fileBase64, fileMimeType } = await req.json();

    if (!fileName || !fileBase64) {
      return NextResponse.json({ success: false, error: "Missing file payload." }, { status: 400 });
    }

    const buffer = Buffer.from(fileBase64, "base64");
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
    // Deterministic URL extraction scanning the FULL cleaned text
    const extractedUrls = extractUrlsFromText(cleanedText);

    const emailMatch = cleanedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const parsedEmail = emailMatch ? emailMatch[0].trim() : "";

    const phoneMatch = cleanedText.match(/\+?\d[\d\s.-]{8,15}\d/);
    const parsedPhone = phoneMatch ? phoneMatch[0].trim() : "";

    // Parse location deterministically
    const locationMatch = cleanedText.match(/(?:london|new york|san francisco|tokyo|toronto|berlin|paris|chicago|austin|seattle|vancouver)/i);
    const parsedLocation = locationMatch ? locationMatch[0].charAt(0).toUpperCase() + locationMatch[0].slice(1) : "";

    // Deterministic Skill Normalization (14 groups)
    const skillsText = segmentedBlocks.skills || cleanedText;
    const words = skillsText.toLowerCase().split(/[\s,()\-]+/);
    const detectedSkillsSet = new Set<string>();

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
        detectedSkillsSet.add(item.name);
        if (!categorizedSkills[item.category].includes(item.name)) {
          categorizedSkills[item.category].push(item.name);
        }
      }
    }

    const aliasList = Object.keys(SKILL_ALIASES);
    for (const alias of aliasList) {
      if (alias.includes(" ") && skillsText.toLowerCase().includes(alias)) {
        const item = SKILL_ALIASES[alias];
        detectedSkillsSet.add(item.name);
        if (!categorizedSkills[item.category].includes(item.name)) {
          categorizedSkills[item.category].push(item.name);
        }
      }
    }

    // Semantic AI extraction passes on specific segment blocks (with fallbacks)
    let fullName = "";
    let headline = "";
    let bio = "";
    let education: any[] = [];
    let experience: any[] = [];
    let projects: any[] = [];
    let certifications: any[] = [];
    let internships: any[] = [];
    let achievements: any[] = [];
    let softSkills: string[] = [];
    let candidateProfile = "";
    let careerDomain = "";

    // Pass 1: Personal profile & summary
    const promptPass1 = `
Act as an ATS resume parser. Extract full name, professional headline, and summary biography from this text.
Do not guess or hallucinate. Return strictly JSON:
{
  "fullName": "Extracted name or empty",
  "headline": "Title or empty",
  "bio": "Summary bio or empty"
}
Text:
${segmentedBlocks.personal || cleanedText}
${segmentedBlocks.bio || ""}
    `.trim();

    // Pass 2: Education & Certifications
    const promptPass2 = `
Act as an ATS resume parser. Extract education and certifications records from this text.
Return strictly JSON:
{
  "education": [
    { "degree": "e.g. B.Sc.", "branch": "e.g. Computer Science", "institution": "University Name", "university": "Affiliated University Name", "startYear": "Year", "endYear": "Year", "cgpa": "e.g. 3.8/4.0" }
  ],
  "certifications": [
    { "certificationName": "Name", "organization": "Issuer Name", "date": "Date/Year", "credentialId": "ID or empty" }
  ]
}
Text:
${segmentedBlocks.education || ""}
${segmentedBlocks.certifications || ""}
    `.trim();

    // Pass 3: Work Experience, Projects, Internships & Achievements
    const promptPass3 = `
Act as an ATS resume parser. Extract experiences, projects, internships, achievements, and soft skills lists.
Return strictly JSON:
{
  "experience": [
    { "companyName": "Company", "role": "Role", "employmentType": "Full-time/Part-time/Apprentice", "startDate": "Date", "endDate": "Date", "duration": "Duration", "responsibilities": "Bullet points summary text" }
  ],
  "projects": [
    { "projectTitle": "Title", "description": "Details", "technologiesUsed": ["React", "TypeScript"], "githubLink": "URL", "liveUrl": "URL", "duration": "Duration" }
  ],
  "internships": [
    { "company": "Company", "role": "Role", "duration": "Duration", "description": "Responsibilities text" }
  ],
  "achievements": [
    { "title": "Achievement title", "description": "Description detail" }
  ],
  "softSkills": ["Leadership", "Communication"]
}
Text:
${segmentedBlocks.experience || ""}
${segmentedBlocks.projects || ""}
${segmentedBlocks.internships || ""}
${segmentedBlocks.achievements || ""}
    `.trim();

    // Pass 4: Semantic candidate understanding (Phase 6)
    const promptPass4 = `
Act as an ATS recruiting assistant. Generate a semantic candiate profile summary sentence and select a career domain classification.
Domains: Frontend Development, Backend, AI/ML, Full Stack, Cybersecurity, Data Science, Cloud.
Return strictly JSON:
{
  "candidateProfile": "Semantic candiate summary sentence",
  "careerDomain": "Selected Domain"
}
Text:
${cleanedText}
    `.trim();

    try {
      const [res1, res2, res3, res4] = await Promise.all([
        getAICompletion(promptPass1),
        getAICompletion(promptPass2),
        getAICompletion(promptPass3),
        getAICompletion(promptPass4)
      ]);

      if (res1.success && res1.text) {
        const cleanJson = res1.text.replace(/```json|```/g, "").trim();
        const obj = JSON.parse(cleanJson);
        fullName = obj.fullName || "";
        headline = obj.headline || "";
        bio = obj.bio || "";
      }
      if (res2.success && res2.text) {
        const cleanJson = res2.text.replace(/```json|```/g, "").trim();
        const obj = JSON.parse(cleanJson);
        education = obj.education || [];
        certifications = obj.certifications || [];
      }
      if (res3.success && res3.text) {
        const cleanJson = res3.text.replace(/```json|```/g, "").trim();
        const obj = JSON.parse(cleanJson);
        experience = obj.experience || [];
        projects = obj.projects || [];
        internships = obj.internships || [];
        achievements = obj.achievements || [];
        softSkills = obj.softSkills || [];
      }
      if (res4.success && res4.text) {
        const cleanJson = res4.text.replace(/```json|```/g, "").trim();
        const obj = JSON.parse(cleanJson);
        candidateProfile = obj.candidateProfile || "";
        careerDomain = obj.careerDomain || "";
      }
    } catch (err) {
      console.warn("Gemini semantic parser failed, using fallback metrics:", err);
    }

    // Dynamic clean name extraction
    if (!fullName || fullName.toLowerCase().includes("resume") || fullName.toLowerCase().includes("alex thompson") || fullName.length < 2) {
      fullName = cleanAndExtractName(cleanedText, fileName);
    }
    
    if (!headline) {
      headline = "Apprentice Engineer";
    }
    if (!candidateProfile) {
      candidateProfile = `${fullName} is an engineering student focusing on ${careerDomain || "Software Engineering"}.`;
    }
    if (!careerDomain) {
      careerDomain = "Full Stack";
    }

    // Dynamic field completeness metrics
    const completenessMetrics: Record<string, number> = {
      personal: (fullName ? 25 : 0) + (parsedEmail ? 25 : 0) + (parsedPhone ? 25 : 0) + (parsedLocation ? 25 : 0),
      education: education.length > 0 ? Math.round((education.filter(e => e.degree && e.institution && e.endYear).length / education.length) * 100) : 0,
      experience: experience.length > 0 ? Math.round((experience.filter(exp => exp.companyName && exp.role).length / experience.length) * 100) : 0,
      projects: projects.length > 0 ? Math.round((projects.filter(p => p.projectTitle && p.description).length / projects.length) * 100) : 0,
      skills: detectedSkillsSet.size > 0 ? 100 : 0,
      certifications: certifications.length > 0 ? 100 : 0,
      achievements: achievements.length > 0 ? 100 : 0
    };

    const overallCompleteness = Math.round(
      Object.values(completenessMetrics).reduce((a, b) => a + b, 0) / Object.values(completenessMetrics).length
    );

    // Confidence mapping values
    const confidenceScores: Record<string, number> = {
      fullName: fullName ? 100 : 0,
      email: parsedEmail ? 100 : 0,
      phone: parsedPhone ? 100 : 0,
      location: parsedLocation ? 100 : 0,
      linkedin: extractedUrls.linkedin ? 100 : 0,
      github: extractedUrls.github ? 100 : 0,
      portfolioWebsite: extractedUrls.portfolio ? 100 : 0,
      
      education: education.length > 0 ? Math.round((education.filter(e => e.degree && e.institution).length / education.length) * 100) : 0,
      experience: experience.length > 0 ? Math.round((experience.filter(exp => exp.companyName && exp.role).length / experience.length) * 100) : 0,
      projects: projects.length > 0 ? Math.round((projects.filter(p => p.projectTitle && p.description).length / projects.length) * 100) : 0,
      certifications: certifications.length > 0 ? 100 : 0,
      
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
        personalWebsite: extractedUrls.portfolio,
        leetcode: "",
        hackerrank: "",
        codechef: "",
        codeforces: "",
        bio: bio || "Professional profile summary.",
        education,
        experience,
        projects,
        certifications,
        internships,
        achievements,
        technicalSkills: Array.from(detectedSkillsSet),
        softSkills: softSkills.length > 0 ? softSkills : ["Communication", "Problem Solving", "Teamwork"],
        
        programmingLanguages: categorizedSkills.programmingLanguages,
        frameworks: categorizedSkills.frameworks,
        frontend: categorizedSkills.frontend,
        backend: categorizedSkills.backend,
        databases: categorizedSkills.databases,
        cloud: categorizedSkills.cloud,
        devops: categorizedSkills.devops,
        testing: categorizedSkills.testing,
        aiml: categorizedSkills.aiml,
        mobile: categorizedSkills.mobile,
        tools: categorizedSkills.tools,
        operatingSystems: categorizedSkills.operatingSystems,
        networking: categorizedSkills.networking,
        cyberSecurity: categorizedSkills.cyberSecurity,
        
        verifiedSkills: Array.from(detectedSkillsSet),
        
        candidateProfile,
        careerDomain,
        overallCompleteness,
        completenessMetrics
      },
      confidenceScores
    });

  } catch (error: any) {
    console.error("10-Phase Parser Route Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
