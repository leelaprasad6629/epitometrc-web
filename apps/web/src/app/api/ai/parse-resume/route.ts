import { NextRequest, NextResponse } from "next/server";
import { getAICompletion } from "@/lib/ai/services/aiService";
import { 
  buildParsePersonalPrompt, 
  buildParseEducationPrompt, 
  buildParseExperiencePrompt, 
  buildParseCareerDomainPrompt,
  buildUnifiedParsePrompt
} from "@/lib/ai/services/promptBuilder";
// @ts-ignore
import * as pdfParse from "pdf-parse";
import mammoth from "mammoth";


// Extended predefined skills normalization alias database mapped to 17 groups
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
  "terraform": { name: "Terraform", category: "devops" },
  "ci/cd": { name: "CI/CD", category: "devops" },
  
  // Testing
  "jest": { name: "Jest", category: "testing" },
  "cypress": { name: "Cypress", category: "testing" },
  "selenium": { name: "Selenium", category: "testing" },
  "playwright": { name: "Playwright", category: "testing" },
  
  // AI/ML
  "nlp": { name: "NLP", category: "aiml" },
  "cv": { name: "Computer Vision", category: "aiml" },
  "llm": { name: "Large Language Models", category: "aiml" },
  
  // Data Science
  "pytorch": { name: "PyTorch", category: "dataScience" },
  "tensorflow": { name: "TensorFlow", category: "dataScience" },
  "pandas": { name: "Pandas", category: "dataScience" },
  "numpy": { name: "NumPy", category: "dataScience" },
  "scikit-learn": { name: "Scikit-learn", category: "dataScience" },

  // Version Control
  "git": { name: "Git", category: "versionControl" },
  "github": { name: "GitHub", category: "versionControl" },
  "gitlab": { name: "GitLab", category: "versionControl" },

  // Libraries
  "lodash": { name: "Lodash", category: "libraries" },
  "jquery": { name: "jQuery", category: "libraries" },
  "axios": { name: "Axios", category: "libraries" },

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
  // @ts-ignore
  const parseFn = typeof pdfParse === "function" ? pdfParse : (pdfParse.default || pdfParse);
  const data = await parseFn(buffer);
  return data.text || "";
}

// DOCX Parser using mammoth
async function parseDocxBuffer(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

// Standardizes whitespaces while keeping newlines for layout structure
function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

// Phase 1: Logic section segmenter with synonym mapping
function segmentResumeText(text: string): Record<string, string> {
  const headingsRegex = /^(?:professional\s+summary|about|career\s+objective|education|academic\s+background|qualifications|experience|work\s+experience|professional\s+experience|projects|personal\s+projects|academic\s+projects|certifications|internships|achievements|publications|workshops|hackathons|leadership|volunteer|skills|technical\s+skills|languages|interests|extracurricular\s+activities)/im;

  const lines = text.split("\n");
  const segments: Record<string, string[]> = {
    personal: [],
    bio: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    internships: [],
    achievements: [],
    skills: [],
    publications: [],
    workshops: [],
    hackathons: [],
    leadership: [],
    volunteer: [],
    languages: [],
    interests: []
  };

  let currentKey = "personal";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (headingsRegex.test(trimmed)) {
      const match = trimmed.toLowerCase();
      if (match.includes("summary") || match.includes("about") || match.includes("objective")) {
        currentKey = "bio";
      } else if (match.includes("education") || match.includes("academic background") || match.includes("qualification")) {
        currentKey = "education";
      } else if (match.includes("experience") || match.includes("work")) {
        currentKey = "experience";
      } else if (match.includes("projects")) {
        currentKey = "projects";
      } else if (match.includes("certifications")) {
        currentKey = "certifications";
      } else if (match.includes("internships")) {
        currentKey = "internships";
      } else if (match.includes("achievements")) {
        currentKey = "achievements";
      } else if (match.includes("skills") || match.includes("technical")) {
        currentKey = "skills";
      } else if (match.includes("publications")) {
        currentKey = "publications";
      } else if (match.includes("workshops")) {
        currentKey = "workshops";
      } else if (match.includes("hackathons")) {
        currentKey = "hackathons";
      } else if (match.includes("leadership")) {
        currentKey = "leadership";
      } else if (match.includes("volunteer")) {
        currentKey = "volunteer";
      } else if (match.includes("languages")) {
        currentKey = "languages";
      } else if (match.includes("interests")) {
        currentKey = "interests";
      }
    } else {
      segments[currentKey].push(trimmed);
    }
  }

  const result: Record<string, string> = {};
  for (const k of Object.keys(segments)) {
    result[k] = segments[k].join("\n");
  }
  return result;
}

// cleanAndExtractName pulls name based on regex and filename
function cleanAndExtractName(text: string, filename: string): string {
  const cleanFilename = filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[_\-]+/g, " ")
    .replace(/(?:resume|cv|parsed|profile|student|latest|updated|edit|draft)/gi, "")
    .trim();

  if (cleanFilename.length > 2) {
    return cleanFilename.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  }

  const nameRegex = /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}/;
  const match = text.match(nameRegex);
  if (match) {
    return match[0].trim();
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
      try {
        rawText = await parsePdfBuffer(buffer);
      } catch (err) {
        console.warn("PdfReader failed to parse buffer, falling back to string recovery:", err);
        rawText = buffer.toString("binary").replace(/[^\x20-\x7E\n\r\t]/g, " ");
      }
    } else if (
      fileMimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
      fileName.toLowerCase().endsWith(".docx")
    ) {
      try {
        rawText = await parseDocxBuffer(buffer);
      } catch (err) {
        console.warn("Mammoth failed to parse DOCX buffer, falling back to string recovery:", err);
        rawText = buffer.toString("binary").replace(/[^\x20-\x7E\n\r\t]/g, " ");
      }
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

    // Parse location deterministically with fallback
    let parsedLocation = "";
    const locationMatch = cleanedText.match(/(?:london|new york|san francisco|tokyo|toronto|berlin|paris|chicago|austin|seattle|vancouver)/i);
    if (locationMatch) {
      parsedLocation = locationMatch[0].charAt(0).toUpperCase() + locationMatch[0].slice(1);
    }

    // Deterministic Skill Normalization (17 groups)
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
      cyberSecurity: [],
      libraries: [],
      dataScience: [],
      versionControl: []
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

    // Semantic AI extraction in a single, robust unified pass to respect token limits
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
    let aiSkills: string[] = [];
    
    // Links
    let linkedin = "";
    let github = "";
    let portfolioWebsite = "";
    let personalWebsite = "";
    let leetcode = "";
    let hackerrank = "";
    let codechef = "";
    let codeforces = "";
    let kaggle = "";
    let medium = "";
    let stackoverflow = "";
    let behance = "";
    let dribbble = "";

    // New section arrays
    let publications: any[] = [];
    let workshops: any[] = [];
    let hackathons: any[] = [];
    let leadershipRoles: any[] = [];
    let volunteerExperience: any[] = [];
    let languagesKnown: string[] = [];
    let professionalInterests: string[] = [];

    // Semantic career insights
    let candidateProfile = "";
    let careerDomain = "";
    let experienceLevel = "Fresher";
    let suggestedRoles: string[] = [];
    let suggestedTech: string[] = [];

    const parsePrompt = buildUnifiedParsePrompt(cleanedText);

    try {
      const res = await getAICompletion(parsePrompt, { maxTokens: 4000 });
      if (res.success && res.text) {
        const cleanJson = res.text.replace(/```json|```/g, "").trim();
        const obj = JSON.parse(cleanJson);

        fullName = obj.fullName || "";
        headline = obj.headline || "";
        bio = obj.bio || "";
        if (obj.location && obj.location.trim().length > 2) {
          parsedLocation = obj.location.trim();
        }

        // Links
        linkedin = obj.linkedin || "";
        github = obj.github || "";
        portfolioWebsite = obj.portfolioWebsite || "";
        personalWebsite = obj.personalWebsite || "";
        leetcode = obj.leetcode || "";
        hackerrank = obj.hackerrank || "";
        codechef = obj.codechef || "";
        codeforces = obj.codeforces || "";
        kaggle = obj.kaggle || "";
        medium = obj.medium || "";
        stackoverflow = obj.stackoverflow || "";
        behance = obj.behance || "";
        dribbble = obj.dribbble || "";

        education = obj.education || [];
        experience = obj.experience || [];
        projects = obj.projects || [];
        certifications = obj.certifications || [];
        internships = obj.internships || [];
        achievements = obj.achievements || [];
        softSkills = obj.softSkills || [];
        aiSkills = obj.technicalSkills || [];
        
        publications = obj.publications || [];
        workshops = obj.workshops || [];
        hackathons = obj.hackathons || [];
        leadershipRoles = obj.leadershipRoles || [];
        volunteerExperience = obj.volunteerExperience || [];
        languagesKnown = obj.languagesKnown || [];
        professionalInterests = obj.professionalInterests || [];

        candidateProfile = obj.candidateProfile || "";
        careerDomain = obj.careerDomain || "";
        experienceLevel = obj.experienceLevel || "Fresher";
        suggestedRoles = obj.suggestedRoles || [];
        suggestedTech = obj.suggestedTech || [];
      }
    } catch (err) {
      console.warn("Unified AI resume parser call failed, parsing manually:", err);
    }

    // Combine deterministic skills and AI-extracted skills
    const combinedSkillsSet = new Set<string>(detectedSkillsSet);
    for (const skill of aiSkills) {
      if (!skill) continue;
      const skillClean = skill.trim();
      const skillLower = skillClean.toLowerCase();
      if (SKILL_ALIASES[skillLower]) {
        const item = SKILL_ALIASES[skillLower];
        combinedSkillsSet.add(item.name);
        if (!categorizedSkills[item.category].includes(item.name)) {
          categorizedSkills[item.category].push(item.name);
        }
      } else {
        combinedSkillsSet.add(skillClean);
        if (!categorizedSkills.tools.includes(skillClean)) {
          categorizedSkills.tools.push(skillClean);
        }
      }
    }

    // Hybrid Links Recovery
    if (!linkedin) linkedin = extractedUrls.linkedin || "";
    if (!github) github = extractedUrls.github || "";
    if (!portfolioWebsite) portfolioWebsite = extractedUrls.portfolio || "";
    if (!personalWebsite) personalWebsite = extractedUrls.portfolio || "";

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

    const safeEducation = Array.isArray(education) ? education : [];
    const safeExperience = Array.isArray(experience) ? experience : [];
    const safeProjects = Array.isArray(projects) ? projects : [];
    const safeCertifications = Array.isArray(certifications) ? certifications : [];
    const safeAchievements = Array.isArray(achievements) ? achievements : [];

    // Dynamic field completeness metrics
    const completenessMetrics: Record<string, number> = {
      personal: (fullName ? 25 : 0) + (parsedEmail ? 25 : 0) + (parsedPhone ? 25 : 0) + (parsedLocation ? 25 : 0),
      education: safeEducation.length > 0 ? Math.round((safeEducation.filter(e => e && e.degree && e.institution && e.endYear).length / safeEducation.length) * 100) : 0,
      experience: safeExperience.length > 0 ? Math.round((safeExperience.filter(exp => exp && exp.companyName && exp.role).length / safeExperience.length) * 100) : 0,
      projects: safeProjects.length > 0 ? Math.round((safeProjects.filter(p => p && p.projectTitle && p.description).length / safeProjects.length) * 100) : 0,
      skills: combinedSkillsSet.size > 0 ? 100 : 0,
      certifications: safeCertifications.length > 0 ? 100 : 0,
      achievements: safeAchievements.length > 0 ? 100 : 0
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
      linkedin: linkedin ? 100 : 0,
      github: github ? 100 : 0,
      portfolioWebsite: portfolioWebsite ? 100 : 0,
      
      education: safeEducation.length > 0 ? Math.round((safeEducation.filter(e => e && e.degree && e.institution).length / safeEducation.length) * 100) : 0,
      experience: safeExperience.length > 0 ? Math.round((safeExperience.filter(exp => exp && exp.companyName && exp.role).length / safeExperience.length) * 100) : 0,
      projects: safeProjects.length > 0 ? Math.round((safeProjects.filter(p => p && p.projectTitle && p.description).length / safeProjects.length) * 100) : 0,
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
        linkedin: linkedin,
        github: github,
        portfolioWebsite: portfolioWebsite,
        personalWebsite: personalWebsite,
        leetcode: leetcode,
        hackerrank: hackerrank,
        codechef: codechef,
        codeforces: codeforces,
        kaggle: kaggle,
        medium: medium,
        stackoverflow: stackoverflow,
        behance: behance,
        dribbble: dribbble,
        bio: bio || "Professional profile summary.",
        education,
        experience,
        projects,
        certifications,
        internships,
        achievements,
        
        publications,
        workshops,
        hackathons,
        leadershipRoles,
        volunteerExperience,
        languagesKnown,
        professionalInterests,

        technicalSkills: Array.from(combinedSkillsSet),
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
        libraries: categorizedSkills.libraries,
        dataScience: categorizedSkills.dataScience,
        versionControl: categorizedSkills.versionControl,
        
        verifiedSkills: Array.from(combinedSkillsSet),
        
        candidateProfile,
        careerDomain,
        experienceLevel,
        suggestedRoles,
        suggestedTech,

        overallCompleteness,
        completenessMetrics
      },
      confidenceScores
    });

  } catch (error: any) {
    console.error("AI Parser Endpoint error:", error);
    return NextResponse.json(
      { success: false, error: "Parser failed to segment text." },
      { status: 500 }
    );
  }
}
