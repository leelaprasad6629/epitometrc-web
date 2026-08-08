import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import { PdfReader } from "pdfreader";
import mammoth from "mammoth";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { validateFileContent } from "@/lib/fileValidation";
import { startPerformanceMeasure } from "@/lib/performance";

export const maxDuration = 60; // 60s Vercel serverless function timeout

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = "llama-3.3-70b-versatile";

// PDF Parser using pdfreader buffer reader (layout-preserving)
async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve) => {
    let rows: Record<number, any[]> = {};
    try {
      new PdfReader().parseBuffer(buffer, (err: any, item: any) => {
        if (err) {
          console.warn("pdfreader failed, fallback to raw string decoding:", err);
          resolve(buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " "));
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
    } catch (e) {
      console.warn("pdfreader parsing crashed, falling back:", e);
      resolve(buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " "));
    }
  });
}

// DOCX Parser using mammoth
async function parseDocxBuffer(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (err) {
    console.error("Docx parser failed:", err);
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

// Skills Aliases database to normalize extracted skills into 17 groups
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
  "c++": { name: "C++", category: "programmingLanguages" },
  "go": { name: "Go", category: "programmingLanguages" },
  "golang": { name: "Go", category: "programmingLanguages" },
  "rust": { name: "Rust", category: "programmingLanguages" },
  "ruby": { name: "Ruby", category: "programmingLanguages" },
  "php": { name: "PHP", category: "programmingLanguages" },
  "kotlin": { name: "Kotlin", category: "programmingLanguages" },
  "swift": { name: "Swift", category: "programmingLanguages" },

  // Frameworks
  "react": { name: "React", category: "frameworks" },
  "nextjs": { name: "Next.js", category: "frameworks" },
  "next.js": { name: "Next.js", category: "frameworks" },
  "django": { name: "Django", category: "frameworks" },
  "fastapi": { name: "FastAPI", category: "frameworks" },
  "flask": { name: "Flask", category: "frameworks" },
  "springboot": { name: "Spring Boot", category: "frameworks" },
  "spring boot": { name: "Spring Boot", category: "frameworks" },
  "vue": { name: "Vue.js", category: "frameworks" },
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
  "redux": { name: "Redux", category: "frontend" },
  "zustand": { name: "Zustand", category: "frontend" },

  // Backend
  "node": { name: "Node.js", category: "backend" },
  "nodejs": { name: "Node.js", category: "backend" },
  "express": { name: "Express.js", category: "backend" },
  "expressjs": { name: "Express.js", category: "backend" },
  "graphql": { name: "GraphQL", category: "backend" },
  "rest api": { name: "REST APIs", category: "backend" },

  // Databases
  "postgres": { name: "PostgreSQL", category: "databases" },
  "postgresql": { name: "PostgreSQL", category: "databases" },
  "mongodb": { name: "MongoDB", category: "databases" },
  "mysql": { name: "MySQL", category: "databases" },
  "redis": { name: "Redis", category: "databases" },
  "prisma": { name: "Prisma", category: "databases" },

  // Cloud
  "aws": { name: "AWS", category: "cloud" },
  "supabase": { name: "Supabase", category: "cloud" },
  "azure": { name: "Azure", category: "cloud" },
  "gcp": { name: "Google Cloud", category: "cloud" },
  "google cloud": { name: "Google Cloud", category: "cloud" },
  "vercel": { name: "Vercel", category: "cloud" },

  // DevOps
  "docker": { name: "Docker", category: "devops" },
  "kubernetes": { name: "Kubernetes", category: "devops" },
  "git": { name: "Git", category: "devops" },
  "github": { name: "Git", category: "devops" },
  "ci/cd": { name: "CI/CD", category: "devops" }
};

export async function POST(req: NextRequest) {
  const perf = startPerformanceMeasure("POST /api/ai/parse-resume");
  try {
    const { fileName, fileBase64, fileMimeType, purpose } = await req.json();

    // Enforce membership limits only for resume optimizer / tailorer
    if (purpose === "optimization") {
      const token = req.cookies.get("token")?.value;
      if (token) {
        const payload = verifyToken(token) as { id: string } | null;
        if (payload) {
          let planName = "Free Plan";
          let resumesOptimizedUsed = 0;
          let isOffline = false;

          try {
            let membership = await prisma.userMembership.findUnique({
              where: { userId: payload.id }
            });
            if (!membership) {
              membership = await prisma.userMembership.create({
                data: { userId: payload.id, planName: "Free Plan" }
              });
            }
            planName = membership.planName;
            resumesOptimizedUsed = membership.resumesOptimizedUsed;
          } catch (dbError) {
            isOffline = true;
            planName = req.cookies.get("mock_membership_plan")?.value || "Free Plan";
            resumesOptimizedUsed = planName === "Free Plan" ? 1 : 0;
          }

          if (planName === "Free Plan" && resumesOptimizedUsed >= 1) {
            return NextResponse.json(
              { success: false, error: "LimitExceeded", limitType: "resume" },
              { status: 403 }
            );
          }

          // Write RESUME_GENERATION audit trail
          let userEmail = "unknown";
          try {
            const user = await prisma.user.findUnique({
              where: { id: payload.id },
              select: { email: true }
            });
            if (user) userEmail = user.email;
          } catch {}

          const { logAuditAction } = await import("@/lib/audit");
          await logAuditAction(
            payload.id,
            userEmail,
            "RESUME_GENERATION",
            { fileName, purpose },
            req.headers.get("x-forwarded-for")
          );

          // Increment usage
          if (!isOffline) {
            try {
              await prisma.userMembership.update({
                where: { userId: payload.id },
                data: { resumesOptimizedUsed: { increment: 1 } }
              });
            } catch (dbError) {
              console.warn("Could not increment count due to offline database:", dbError);
            }
          }
        }
      }
    }

    if (!fileName || !fileBase64) {
      return NextResponse.json({ success: false, error: "Missing file payload." }, { status: 400 });
    }

    const buffer = Buffer.from(fileBase64, "base64");

    // Secure Data Protection Validation
    const validation = validateFileContent(
      buffer,
      fileName,
      fileMimeType,
      [".pdf", ".doc", ".docx"],
      5 * 1024 * 1024 // 5 MB for resumes
    );

    if (!validation.isValid) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }

    const lowerName = fileName.toLowerCase();
    const isValidExtension = true;
    const isValidMime = true;
    
    if (!isValidExtension && !isValidMime) {
      return NextResponse.json({
        success: false,
        error: "Resume must be a PDF, DOC, or DOCX file and cannot exceed 25 MB."
      }, { status: 400 });
    }

    let rawText = "";

    if (fileMimeType === "application/pdf" || lowerName.endsWith(".pdf")) {
      rawText = await parsePdfBuffer(buffer);
    } else if (
      fileMimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
      lowerName.endsWith(".docx") || lowerName.endsWith(".doc")
    ) {
      rawText = await parseDocxBuffer(buffer);
    } else {
      rawText = buffer.toString("utf-8");
    }

    const cleanedText = cleanText(rawText);
    console.log("Raw text length:", rawText.length);
    console.log("Cleaned text preview:", cleanedText.substring(0, 500));

    if (!GROQ_API_KEY) {
      return NextResponse.json({ success: false, error: "Groq API Key is not configured." }, { status: 500 });
    }

    // Production prompt for Groq Llama-3.3-70b-versatile
    const systemPrompt = `You are a production-grade Resume Intelligence Engine.
Your job is to parse the raw text of a candidate's resume and extract ONLY the text content, ignoring any visual layout, design, formatting, or font styles.
Ensure all candidate details are accurately extracted into plain data strings without any summary omissions.

CRITICAL INSTRUCTIONS FOR WEB & SOCIAL LINKS:
1. Thoroughly scan the raw text for links, URLs, shorthand paths, or plain usernames/handles.
2. Even if links are listed in shorthand (e.g. "github.com/username", "linkedin.com/in/username"), resolve and output them as full absolute URLs with "https://".
3. LinkedIn URL Normalization: Convert handle to kebab-case and format as "https://www.linkedin.com/in/username/".

Output ONLY a valid JSON object matching this exact structure:
{
  "fullName": "Full Name",
  "headline": "Professional Title / Target Role",
  "email": "email@example.com",
  "phone": "Phone number",
  "location": "City, State or Address",
  "linkedin": "LinkedIn profile URL",
  "github": "GitHub profile URL",
  "portfolioWebsite": "Portfolio URL",
  "personalWebsite": "Personal Website URL",
  "leetcode": "LeetCode profile URL",
  "hackerrank": "HackerRank profile URL",
  "codechef": "CodeChef profile URL",
  "codeforces": "Codeforces profile URL",
  "kaggle": "Kaggle profile URL",
  "bio": "Professional Summary",
  "education": [
    {
      "degree": "Degree (e.g. B.Tech)",
      "branch": "Branch/Major (e.g. Computer Science)",
      "institution": "College Name",
      "university": "University Name",
      "startYear": "YYYY",
      "endYear": "YYYY",
      "cgpa": "GPA or Grade"
    }
  ],
  "experience": [
    {
      "companyName": "Company Name",
      "role": "Job Role / Title",
      "employmentType": "Full-Time / Part-Time / Internship",
      "startDate": "Month YYYY",
      "endDate": "Month YYYY or Present",
      "duration": "Duration",
      "responsibilities": "Bullet point achievements",
      "technologiesUsed": ["React", "Node"]
    }
  ],
  "projects": [
    {
      "projectTitle": "Project Name",
      "description": "Short description of project",
      "technologiesUsed": ["HTML", "CSS"],
      "githubLink": "GitHub Repo URL",
      "liveUrl": "Live deployment URL",
      "duration": "Duration"
    }
  ],
  "certifications": [
    {
      "certificationName": "Certification Name",
      "organization": "Issuing Org",
      "date": "Month YYYY",
      "credentialId": "ID"
    }
  ],
  "achievements": [
    {
      "title": "Achievement Title",
      "description": "Short description"
    }
  ],
  "awards": [
    {
      "title": "Award Title",
      "description": "Issuer and description"
    }
  ],
  "publications": [
    {
      "title": "Paper Title",
      "publisher": "Journal or Publisher",
      "date": "YYYY",
      "url": "Link URL"
    }
  ],
  "volunteerExperience": [
    {
      "role": "Volunteer Role",
      "organization": "Organization",
      "description": "Activities"
    }
  ],
  "workshops": [],
  "hackathons": [],
  "leadershipRoles": [],
  "languagesKnown": ["English", "Spanish"],
  "interests": ["Open Source Contributing", "Tech Writing"],
  "technicalSkills": ["React", "Node.js", "Java", "Docker"],
  "softSkills": ["Communication", "Problem Solving", "Leadership"],
  "candidateProfile": "Paragraph summary of candidate profile",
  "careerDomain": "General Domain",
  "experienceLevel": "Fresher / Junior / Mid / Senior"
}`;

    const url = "https://api.groq.com/openai/v1/chat/completions";
    const groqResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        response_format: { type: "json_object" }, // Request structured JSON mode
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here is the resume raw text to parse:\n\n${cleanedText.substring(0, 15000)}` }
        ],
        temperature: 0.1,
      })
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      return NextResponse.json({ success: false, error: `Groq error: ${errText}` }, { status: 500 });
    }

    const groqData = await groqResponse.json();
    const generatedText = groqData.choices?.[0]?.message?.content;

    if (!generatedText) {
      return NextResponse.json({ success: false, error: "Empty response from Groq." }, { status: 500 });
    }

    let parsedObj: any = {};
    try {
      console.log("Raw generated JSON text from Groq:", generatedText);
      parsedObj = JSON.parse(generatedText);
      
      // Clean up placeholders in string values (e.g. "Not specified", "N/A")
      const cleanPlaceholders = (val: any): any => {
        if (typeof val === "string") {
          const trimmed = val.trim();
          const lower = trimmed.toLowerCase();
          if (
            lower === "not specified" ||
            lower === "not-specified" ||
            lower === "n/a" ||
            lower === "none" ||
            lower === "null" ||
            lower === "undefined" ||
            lower === "not specified." ||
            lower === "n/a."
          ) {
            return "";
          }
          return trimmed;
        }
        if (Array.isArray(val)) {
          return val.map(cleanPlaceholders);
        }
        if (val && typeof val === "object") {
          const res: any = {};
          for (const key of Object.keys(val)) {
            res[key] = cleanPlaceholders(val[key]);
          }
          return res;
        }
        return val;
      };
      parsedObj = cleanPlaceholders(parsedObj);
      console.log("Parsed JSON object (after cleaning placeholders):", parsedObj);
    } catch (e: any) {
      console.error("Failed to parse JSON from Groq:", e);
      return NextResponse.json({ success: false, error: "Failed to parse structured JSON from LLM: " + e.message }, { status: 500 });
    }

    // Categorize Technical Skills
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

    const techSkills: string[] = Array.isArray(parsedObj.technicalSkills) ? parsedObj.technicalSkills : [];
    const normalizedTechSet = new Set<string>();

    for (const skill of techSkills) {
      if (!skill) continue;
      const cleanSkill = skill.trim();
      const lower = cleanSkill.toLowerCase();
      if (SKILL_ALIASES[lower]) {
        const alias = SKILL_ALIASES[lower];
        normalizedTechSet.add(alias.name);
        if (!categorizedSkills[alias.category].includes(alias.name)) {
          categorizedSkills[alias.category].push(alias.name);
        }
      } else {
        normalizedTechSet.add(cleanSkill);
        // Default uncategorized to tools group
        if (!categorizedSkills.tools.includes(cleanSkill)) {
          categorizedSkills.tools.push(cleanSkill);
        }
      }
    }

    // Compute Confidence Scores (0 - 100)
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    const phoneRegex = /\\+?\\d[\\d\\s.-]{8,15}\\d/;

    const emailOk = parsedObj.email && emailRegex.test(parsedObj.email);
    const phoneOk = parsedObj.phone && phoneRegex.test(parsedObj.phone);

    const confidenceScores: Record<string, number> = {
      fullName: parsedObj.fullName && !parsedObj.fullName.toLowerCase().includes("resume") ? 100 : 0,
      email: emailOk ? 100 : parsedObj.email ? 50 : 0,
      phone: phoneOk ? 100 : parsedObj.phone ? 50 : 0,
      location: parsedObj.location ? 100 : 0,
      links: (parsedObj.linkedin || parsedObj.github || parsedObj.portfolioWebsite) ? 100 : 0,
      education: Array.isArray(parsedObj.education) && parsedObj.education.length > 0 ? 100 : 0,
      experience: Array.isArray(parsedObj.experience) && parsedObj.experience.length > 0 ? 100 : 0,
      projects: Array.isArray(parsedObj.projects) && parsedObj.projects.length > 0 ? 100 : 0,
      skills: normalizedTechSet.size > 0 ? 100 : 0,
      certifications: Array.isArray(parsedObj.certifications) && parsedObj.certifications.length > 0 ? 100 : 0
    };

    // Calculate Overall Completeness Score
    const completenessMetrics: Record<string, number> = {
      personal: (parsedObj.fullName ? 25 : 0) + (emailOk ? 25 : 0) + (phoneOk ? 25 : 0) + (parsedObj.location ? 25 : 0),
      education: confidenceScores.education,
      experience: confidenceScores.experience,
      projects: confidenceScores.projects,
      skills: confidenceScores.skills,
      certifications: confidenceScores.certifications,
      achievements: Array.isArray(parsedObj.achievements) && parsedObj.achievements.length > 0 ? 100 : 0
    };

    const overallCompleteness = Math.round(
      Object.values(completenessMetrics).reduce((a, b) => a + b, 0) / Object.values(completenessMetrics).length
    );

    return NextResponse.json({
      success: true,
      result: {
        ...parsedObj,
        technicalSkills: Array.from(normalizedTechSet),
        ...categorizedSkills,
        overallCompleteness,
        completenessMetrics
      },
      confidenceScores
    });

  } catch (error: any) {
    console.error("Resume Parser error:", error);
    return NextResponse.json({ success: false, error: "Failed to parse: " + error.message }, { status: 500 });
  } finally {
    perf.end();
  }
}
