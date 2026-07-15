import { NextRequest, NextResponse } from "next/server";
import { getAICompletion } from "@/lib/ai/services/aiService";
import { PdfReader } from "pdfreader";
import mammoth from "mammoth";

<<<<<<< Updated upstream
// Predefined Skills Alias Knowledge Base Map
const SKILL_ALIASES: Record<string, string> = {
  "js": "JavaScript",
  "javascript": "JavaScript",
  "ts": "TypeScript",
  "typescript": "TypeScript",
  "react.js": "React",
  "reactjs": "React",
  "react": "React",
  "react native": "React Native",
  "redux": "Redux",
  "nextjs": "Next.js",
  "next.js": "Next.js",
  "node": "Node.js",
  "nodejs": "Node.js",
  "node.js": "Node.js",
  "c sharp": "C#",
  "c#": "C#",
  "cplusplus": "C++",
  "c++": "C++",
  "py": "Python",
  "python": "Python",
  "pytorch": "PyTorch",
  "aws": "AWS",
  "amazon web services": "AWS",
  "docker": "Docker",
  "kubernetes": "Kubernetes",
  "k8s": "Kubernetes",
  "postgres": "PostgreSQL",
  "postgresql": "PostgreSQL",
  "mongodb": "MongoDB",
  "mongo": "MongoDB",
  "mysql": "MySQL",
  "git": "Git",
  "github": "GitHub",
  "terraform": "Terraform",
  "graphql": "GraphQL",
  "tailwind": "Tailwind CSS",
  "tailwindcss": "Tailwind CSS",
  "express": "Express.js",
  "expressjs": "Express.js",
  "spring": "Spring Boot",
  "springboot": "Spring Boot",
  "spring boot": "Spring Boot",
  "java": "Java",
  "django": "Django",
  "fastapi": "FastAPI",
  "flask": "Flask",
  "html": "HTML5",
  "html5": "HTML5",
  "css": "CSS3",
  "css3": "CSS3",
  "sass": "Sass",
  "prisma": "Prisma",
  "supabase": "Supabase"
};

// 1. PDF Parser using coordinate-based sorting (PdfReader)
=======
// Predefined Skills Alias Knowledge Base Map with Categories
const SKILL_ALIASES: Record<string, { name: string; category: string }> = {
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
  
  "html": { name: "HTML5", category: "frontend" },
  "html5": { name: "HTML5", category: "frontend" },
  "css": { name: "CSS3", category: "frontend" },
  "css3": { name: "CSS3", category: "frontend" },
  "tailwind": { name: "Tailwind CSS", category: "frontend" },
  "tailwindcss": { name: "Tailwind CSS", category: "frontend" },
  "sass": { name: "Sass", category: "frontend" },
  "bootstrap": { name: "Bootstrap", category: "frontend" },
  
  "node": { name: "Node.js", category: "backend" },
  "nodejs": { name: "Node.js", category: "backend" },
  "node.js": { name: "Node.js", category: "backend" },
  "express": { name: "Express.js", category: "backend" },
  "expressjs": { name: "Express.js", category: "backend" },
  
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
  
  "postgres": { name: "PostgreSQL", category: "databases" },
  "postgresql": { name: "PostgreSQL", category: "databases" },
  "mongodb": { name: "MongoDB", category: "databases" },
  "mongo": { name: "MongoDB", category: "databases" },
  "mysql": { name: "MySQL", category: "databases" },
  "redis": { name: "Redis", category: "databases" },
  "sqlite": { name: "SQLite", category: "databases" },
  
  "aws": { name: "AWS", category: "cloud" },
  "amazon web services": { name: "AWS", category: "cloud" },
  "supabase": { name: "Supabase", category: "cloud" },
  
  "docker": { name: "Docker", category: "devops" },
  "kubernetes": { name: "Kubernetes", category: "devops" },
  "k8s": { name: "Kubernetes", category: "devops" },
  "git": { name: "Git", category: "devops" },
  "github": { name: "GitHub", category: "devops" },
  "terraform": { name: "Terraform", category: "devops" },
  "graphql": { name: "GraphQL", category: "devops" },
  
  "jest": { name: "Jest", category: "testing" },
  "cypress": { name: "Cypress", category: "testing" },
  "selenium": { name: "Selenium", category: "testing" },
  
  "react native": { name: "React Native", category: "mobile" },
  "flutter": { name: "Flutter", category: "mobile" },
  
  "pytorch": { name: "PyTorch", category: "aiml" },
  "tensorflow": { name: "TensorFlow", category: "aiml" },
  "pandas": { name: "Pandas", category: "aiml" },
  "numpy": { name: "NumPy", category: "aiml" }
};

// PDF Parser using coordinate-based sorting
>>>>>>> Stashed changes
function parsePdfBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    let rows: Record<number, any[]> = {};
    
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) {
        reject(err);
      } else if (!item) {
<<<<<<< Updated upstream
        // End of file: reconstruct lines by sorting y-coordinates then x-coordinates
=======
>>>>>>> Stashed changes
        let text = "";
        const yCoords = Object.keys(rows).map(Number).sort((a, b) => a - b);
        for (const y of yCoords) {
          const rowItems = rows[y].sort((a, b) => a.x - b.x);
          text += rowItems.map(it => it.text).join(" ") + "\n";
        }
        resolve(text);
      } else if (item.text) {
<<<<<<< Updated upstream
        // Group items on the same line (rounding y to group nearby coordinates)
=======
>>>>>>> Stashed changes
        const y = Math.round(item.y * 100);
        if (!rows[y]) {
          rows[y] = [];
        }
        rows[y].push(item);
      }
    });
  });
}

<<<<<<< Updated upstream
// 2. DOCX Parser using mammoth
=======
// DOCX Parser using mammoth
>>>>>>> Stashed changes
async function parseDocxBuffer(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (err) {
    console.error("docx parsing failed:", err);
    return "";
  }
}

<<<<<<< Updated upstream
// Simple Helper to clean and segment text
=======
>>>>>>> Stashed changes
function cleanText(text: string): string {
  return text
    .replace(/[ \t]+/g, " ")
    .replace(/\r\n/g, "\n")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

// Deterministically scans the first few lines of the resume to find the candidate's real name
function extractNameDeterministically(text: string): string {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 4) {
      const hasEmailOrPhone = /@|\+?\d{4,}/.test(line);
      const containsForbidden = /resume|cv|curriculum|page|contact|email|phone|profile|summary|experience|education|projects/i.test(line);
      const isAllCapitalized = words.every(w => /^[A-Z][a-zA-Z]*$/.test(w));
      if (isAllCapitalized && !hasEmailOrPhone && !containsForbidden) {
        return line;
      }
    }
  }
  return "";
}

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileBase64, fileMimeType } = await req.json();

    if (!fileName || !fileBase64) {
      return NextResponse.json({ success: false, error: "Missing file payload." }, { status: 400 });
    }

    const buffer = Buffer.from(fileBase64, "base64");
    let rawText = "";

    // Step 1: Professional Document Parsing
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

<<<<<<< Updated upstream
    // Step 2: Text Cleaning & Normalization
    const cleanedText = cleanText(rawText);

    // Step 3: Deterministic Extraction Scanner
    const emailMatch = cleanedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const parsedEmail = emailMatch ? emailMatch[0].trim() : "";

    const phoneMatch = cleanedText.match(/\+?\d[\d\s.-]{8,15}\d/);
    const parsedPhone = phoneMatch ? phoneMatch[0].trim() : "";

    // Robust web links scanner - handles various schemes and subdomains
    const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9%_-]+)/i;
    const githubMatch = cleanedText.match(githubRegex);
    const parsedGithub = githubMatch ? `https://github.com/${githubMatch[1]}` : "";

    const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|pub)\/([a-zA-Z0-9%_-]+)/i;
    const linkedinMatch = cleanedText.match(linkedinRegex);
    const parsedLinkedin = linkedinMatch ? `https://www.linkedin.com/in/${linkedinMatch[1]}` : "";

    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const allUrls = cleanedText.match(urlRegex) || [];
    const portfolioUrl = allUrls.find(u => !u.includes("linkedin.com") && !u.includes("github.com")) || "";
    const parsedPortfolio = portfolioUrl ? portfolioUrl.replace(/[.,;]$/, "") : "";

    const locationMatch = cleanedText.match(/(?:london|new york|san francisco|tokyo|toronto|berlin|paris|chicago|austin|seattle|vancouver)/i);
    const parsedLocation = locationMatch ? locationMatch[0].charAt(0).toUpperCase() + locationMatch[0].slice(1) : "";

    // Step 4: Skill Detection Engine using Dictionary & Aliases
    const words = cleanedText.toLowerCase().split(/[\s,()\-]+/);
    const detectedSkillsSet = new Set<string>();
    const detectedLanguages: string[] = [];
    const detectedFrameworks: string[] = [];
    const detectedLibraries: string[] = [];
    const detectedDatabases: string[] = [];
    const detectedClouds: string[] = [];
    const detectedTools: string[] = [];

    // Scan text using skill aliases knowledge base
    for (const word of words) {
      if (SKILL_ALIASES[word]) {
        detectedSkillsSet.add(SKILL_ALIASES[word]);
      }
    }

    // Also check multi-word skills like "spring boot" or "react native"
    const skillList = Object.keys(SKILL_ALIASES);
    for (const key of skillList) {
      if (key.includes(" ") && cleanedText.toLowerCase().includes(key)) {
        detectedSkillsSet.add(SKILL_ALIASES[key]);
      }
    }

    // Segment detected skills into subcategories
    const technicalSkills = Array.from(detectedSkillsSet);
    technicalSkills.forEach(s => {
      const lower = s.toLowerCase();
      if (["javascript", "typescript", "python", "java", "c#", "c++", "html5", "css3"].includes(lower)) {
        detectedLanguages.push(s);
      } else if (["next.js", "django", "fastapi", "flask", "spring boot", "express.js"].includes(lower)) {
        detectedFrameworks.push(s);
      } else if (["react", "redux", "zustand", "framer motion", "pandas", "numpy"].includes(lower)) {
        detectedLibraries.push(s);
      } else if (["postgresql", "mongodb", "mysql", "redis", "sqlite", "prisma"].includes(lower)) {
        detectedDatabases.push(s);
      } else if (["aws", "supabase", "docker", "kubernetes"].includes(lower)) {
        detectedClouds.push(s);
      } else {
        detectedTools.push(s);
      }
    });

    // Step 5 & 6: Parallel Multi-Pass Gemini structured extractions
    let fullName = "";
    let headline = "";
    let experience = "";
    let education = "";
    let projects = "";
    let achievements = "";
    let internships = "";
    let certifications = "";
    let softSkills: string[] = [];

    // Pass 1: Personal Profile & Summary Bio
    const promptPass1 = `
Act as an ATS resume parser. Extract the full name, professional headline, and summary biography from this text.
Do not hallucinate or guess values. Return strictly JSON with no comments:
{
  "fullName": "Extracted Name or empty string",
  "headline": "Extracted professional title or empty string",
  "bio": "Extracted professional biography or summary text or empty string"
}
Text:
${cleanedText}
    `.trim();

    // Pass 2: Academic background, achievements & internships
    const promptPass2 = `
Act as an ATS resume parser. Extract the education history details, achievements sentences, and internships lists.
Do not guess. Return strictly JSON with no comments:
{
  "education": "Extracted university and degree details or empty",
  "achievements": "Extracted achievements or empty",
  "internships": "Extracted internships or empty"
}
Text:
${cleanedText}
    `.trim();

    // Pass 3: Projects, professional experience details, certifications & soft skills
    const promptPass3 = `
Act as an ATS resume parser. Extract the project accomplishments, experience history, certifications, and soft skills list.
Do not guess. Return strictly JSON with no comments:
{
  "projects": "Extracted projects details or empty",
  "experience": "Extracted experience history or empty",
  "certifications": "Extracted certifications list or empty",
=======
    const cleanedText = cleanText(rawText);

    // Step 3: Deterministic Extraction Scanner
    const emailMatch = cleanedText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const parsedEmail = emailMatch ? emailMatch[0].trim() : "";

    const phoneMatch = cleanedText.match(/\+?\d[\d\s.-]{8,15}\d/);
    const parsedPhone = phoneMatch ? phoneMatch[0].trim() : "";

    const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9%_-]+)/i;
    const githubMatch = cleanedText.match(githubRegex);
    const parsedGithub = githubMatch ? `https://github.com/${githubMatch[1]}` : "";

    const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|pub)\/([a-zA-Z0-9%_-]+)/i;
    const linkedinMatch = cleanedText.match(linkedinRegex);
    const parsedLinkedin = linkedinMatch ? `https://www.linkedin.com/in/${linkedinMatch[1]}` : "";

    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const allUrls = cleanedText.match(urlRegex) || [];
    const portfolioUrl = allUrls.find(u => !u.includes("linkedin.com") && !u.includes("github.com")) || "";
    const parsedPortfolio = portfolioUrl ? portfolioUrl.replace(/[.,;]$/, "") : "";

    const locationMatch = cleanedText.match(/(?:london|new york|san francisco|tokyo|toronto|berlin|paris|chicago|austin|seattle|vancouver)/i);
    const parsedLocation = locationMatch ? locationMatch[0].charAt(0).toUpperCase() + locationMatch[0].slice(1) : "";

    // Step 4: Skill Detection Engine & Aliases Categorization
    const words = cleanedText.toLowerCase().split(/[\s,()\-]+/);
    const detectedSkillsSet = new Set<string>();

    const categorizedSkills: Record<string, string[]> = {
      programmingLanguages: [],
      frontend: [],
      backend: [],
      frameworks: [],
      databases: [],
      cloud: [],
      devops: [],
      testing: [],
      mobile: [],
      aiml: []
    };

    // Scan text using skill aliases knowledge base
    for (const word of words) {
      if (SKILL_ALIASES[word]) {
        const item = SKILL_ALIASES[word];
        detectedSkillsSet.add(item.name);
        if (!categorizedSkills[item.category].includes(item.name)) {
          categorizedSkills[item.category].push(item.name);
        }
      }
    }

    const skillList = Object.keys(SKILL_ALIASES);
    for (const key of skillList) {
      if (key.includes(" ") && cleanedText.toLowerCase().includes(key)) {
        const item = SKILL_ALIASES[key];
        detectedSkillsSet.add(item.name);
        if (!categorizedSkills[item.category].includes(item.name)) {
          categorizedSkills[item.category].push(item.name);
        }
      }
    }

    const technicalSkills = Array.from(detectedSkillsSet);

    // Step 5 & 6: Parallel Multi-Pass Gemini structured extractions
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

    // Pass 1: Personal Profile & Summary Bio
    const promptPass1 = `
Act as an ATS resume parser. Extract the full name, professional headline, and summary biography from this text.
Do not hallucinate or guess values. Return strictly JSON with no comments:
{
  "fullName": "Extracted Name or empty string",
  "headline": "Extracted professional title or empty string",
  "bio": "Extracted professional biography or summary text or empty string"
}
Text:
${cleanedText}
    `.trim();

    // Pass 2: Academic background, achievements & internships
    const promptPass2 = `
Act as an ATS resume parser. Extract the education history details, achievements, and internships lists.
Return strictly JSON with no comments, matching this layout:
{
  "education": [
    { "institution": "University Name", "degree": "Degree Title", "year": "Graduation Year", "location": "Location" }
  ],
  "achievements": [
    { "title": "Achievement name", "description": "Accompanying description" }
  ],
  "internships": [
    { "company": "Company Name", "role": "Internship Role", "duration": "Duration length", "description": "Responsibilities description" }
  ]
}
Text:
${cleanedText}
    `.trim();

    // Pass 3: Projects, professional experience details, certifications & soft skills
    const promptPass3 = `
Act as an ATS resume parser. Extract the project accomplishments, experience history, certifications, and soft skills list.
Return strictly JSON with no comments, matching this layout:
{
  "projects": [
    { "name": "Project Name", "description": "Project Description details", "technologies": ["React", "TypeScript"] }
  ],
  "experience": [
    { "company": "Company Name", "role": "Job Role", "duration": "Duration (e.g. 2022 - 2024)", "description": "Accomplishments", "location": "Location" }
  ],
  "certifications": [
    { "name": "Certification Name", "issuer": "Issuer Organization", "year": "Year Issued" }
  ],
>>>>>>> Stashed changes
  "softSkills": ["Communication", "Agile"]
}
Text:
${cleanedText}
    `.trim();

    try {
<<<<<<< Updated upstream
      // Execute LLM passes in parallel for optimal production speed
=======
>>>>>>> Stashed changes
      const [res1, res2, res3] = await Promise.all([
        getAICompletion(promptPass1),
        getAICompletion(promptPass2),
        getAICompletion(promptPass3)
      ]);

      if (res1.success && res1.text) {
        const cleanJson = res1.text.replace(/```json|```/g, "").trim();
        const obj = JSON.parse(cleanJson);
        fullName = obj.fullName || "";
        headline = obj.headline || "";
<<<<<<< Updated upstream
        experience = obj.bio || "";
=======
        bio = obj.bio || "";
>>>>>>> Stashed changes
      }

      if (res2.success && res2.text) {
        const cleanJson = res2.text.replace(/```json|```/g, "").trim();
        const obj = JSON.parse(cleanJson);
<<<<<<< Updated upstream
        education = obj.education || "";
        achievements = obj.achievements || "";
        internships = obj.internships || "";
=======
        education = obj.education || [];
        achievements = obj.achievements || [];
        internships = obj.internships || [];
>>>>>>> Stashed changes
      }

      if (res3.success && res3.text) {
        const cleanJson = res3.text.replace(/```json|```/g, "").trim();
        const obj = JSON.parse(cleanJson);
<<<<<<< Updated upstream
        projects = obj.projects || "";
        certifications = obj.certifications || "";
        softSkills = obj.softSkills || [];
      }
    } catch (err) {
      console.warn("LLM parallel passes failed, using dynamic text fallback parser:", err);
    }

    // Fallback names from clean filename or deterministic scanner if LLM failed
=======
        projects = obj.projects || [];
        experience = obj.experience || [];
        certifications = obj.certifications || [];
        softSkills = obj.softSkills || [];
      }
    } catch (err) {
      console.warn("LLM parallel passes failed, using fallbacks:", err);
    }

    // Fallback name logic if LLM failed to extract a valid name
>>>>>>> Stashed changes
    if (!fullName || fullName.toLowerCase().includes("resume")) {
      const deterministicName = extractNameDeterministically(cleanedText);
      if (deterministicName) {
        fullName = deterministicName;
      } else {
        const cleanFileName = fileName.replace(/_Resume|_resume|\.pdf|\.docx|\.txt/gi, "").replace(/[_-]/g, " ").trim();
        fullName = cleanFileName.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "Alex Thompson";
      }
    }
    if (!headline) {
      headline = "Apprentice Engineer";
    }

<<<<<<< Updated upstream
    // Step 8: Confidence Scoring System
    const confidenceScores: Record<string, number> = {
      fullName: fullName.length > 3 ? 98 : 0,
      email: parsedEmail ? 100 : 0,
      phone: parsedPhone ? 100 : 0,
      location: parsedLocation ? 95 : 0,
      linkedin: parsedLinkedin ? 100 : 0,
      github: parsedGithub ? 100 : 0,
      portfolioWebsite: parsedPortfolio ? 100 : 0,
      education: education.length > 5 ? 88 : 0,
      experience: experience.length > 10 ? 85 : 0,
      projects: projects.length > 10 ? 85 : 0,
      certifications: certifications.length > 5 ? 85 : 0,
      technicalSkills: technicalSkills.length > 0 ? 90 : 0
=======
    // Step 8: Dynamic Component-Level Completeness Scoring
    const calculateListConfidence = (arr: any[], requiredKeys: string[]): number => {
      if (!arr || arr.length === 0) return 0;
      let totalFields = arr.length * requiredKeys.length;
      let filledFields = 0;
      arr.forEach(item => {
        requiredKeys.forEach(k => {
          if (item[k] && String(item[k]).trim().length > 0) {
            filledFields++;
          }
        });
      });
      return Math.round((filledFields / totalFields) * 100);
    };

    const confidenceScores: Record<string, number> = {
      // Deterministic fields (Valid: 100%, Invalid/Empty: 0%)
      fullName: fullName.length > 2 ? 100 : 0,
      email: parsedEmail ? 100 : 0,
      phone: parsedPhone ? 100 : 0,
      location: parsedLocation ? 100 : 0,
      linkedin: parsedLinkedin ? 100 : 0,
      github: parsedGithub ? 100 : 0,
      portfolioWebsite: parsedPortfolio ? 100 : 0,
      
      // Structured fields (Dynamic completeness calculation)
      education: calculateListConfidence(education, ["institution", "degree", "year"]),
      experience: calculateListConfidence(experience, ["company", "role", "duration", "description"]),
      projects: calculateListConfidence(projects, ["name", "description"]),
      certifications: calculateListConfidence(certifications, ["name", "issuer", "year"]),
      internships: calculateListConfidence(internships, ["company", "role", "duration", "description"]),
      achievements: calculateListConfidence(achievements, ["title", "description"]),
      technicalSkills: technicalSkills.length > 0 ? 100 : 0,

      // AI-Generated descriptive fields (flagged with -1 to render as AI Generated in UI)
      bio: -1,
      softSkills: -1
>>>>>>> Stashed changes
    };

    return NextResponse.json({
      success: true,
      result: {
        fullName,
        headline,
        email: parsedEmail,
        phone: parsedPhone,
        location: parsedLocation,
        linkedin: parsedLinkedin,
        github: parsedGithub,
        portfolioWebsite: parsedPortfolio,
        personalWebsite: parsedPortfolio,
        leetcode: "",
        hackerrank: "",
        codechef: "",
        codeforces: "",
<<<<<<< Updated upstream
=======
        bio: bio || "AI Generated Professional Summary Bio",
>>>>>>> Stashed changes
        education,
        experience,
        projects,
        certifications,
<<<<<<< Updated upstream
        technicalSkills,
        softSkills: softSkills.length > 0 ? softSkills : ["Problem Solving", "Collaboration", "Critical Thinking"],
        programmingLanguages: detectedLanguages,
        frameworks: detectedFrameworks,
        libraries: detectedLibraries,
        databases: detectedDatabases,
        cloudTechnologies: detectedClouds,
        developerTools: detectedTools,
        achievements,
        internships,
=======
        internships,
        achievements,
        technicalSkills,
        softSkills: softSkills.length > 0 ? softSkills : ["Problem Solving", "Collaboration", "Critical Thinking"],
        
        // Categorized skills groups
        programmingLanguages: categorizedSkills.programmingLanguages,
        frontend: categorizedSkills.frontend,
        backend: categorizedSkills.backend,
        frameworks: categorizedSkills.frameworks,
        databases: categorizedSkills.databases,
        cloud: categorizedSkills.cloud,
        devops: categorizedSkills.devops,
        testing: categorizedSkills.testing,
        mobile: categorizedSkills.mobile,
        aiml: categorizedSkills.aiml,
        
>>>>>>> Stashed changes
        verifiedSkills: technicalSkills
      },
      confidenceScores
    });

  } catch (error: any) {
    console.error("Parser Route Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
