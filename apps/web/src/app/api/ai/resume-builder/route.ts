import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const maxDuration = 60; // 60s Vercel serverless function timeout

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export async function POST(req: NextRequest) {
  try {
    const { 
      jobTitle, 
      companyName, 
      jobDescription, 
      bio, 
      experience, 
      projects, 
      skills, 
      certifications, 
      education 
    } = await req.json();

    if (!GROQ_API_KEY) {
      return NextResponse.json({ success: false, error: "Groq API Key is not configured." }, { status: 500 });
    }

    // Query local course catalog for semantic matching
    const localCourses = await prisma.course.findMany({
      select: { id: true, title: true, description: true, category: true, duration: true }
    });

    const prompt = `Act as an expert ATS Resume Optimizer & Professional Career Coach. Your goal is to analyze the candidate's current resume sections and provide section-by-section optimizations tailored specifically to the target Job Title, Company, and Job Description.

Target Job Title: "${jobTitle || "Software Engineer"}"
Target Company: "${companyName || "Target Company"}"
Target Job Description:
"${jobDescription || "Not provided"}"

Current Candidate Details:
- Professional Summary / Bio: "${bio || ""}"
- Work Experience: ${JSON.stringify(experience || [])}
- Technical Projects: ${JSON.stringify(projects || [])}
- Current Skills: ${JSON.stringify(skills || [])}
- Certifications: ${JSON.stringify(certifications || [])}
- Education: ${JSON.stringify(education || [])}

EpitomeTRC Local Courses Catalog:
${JSON.stringify(localCourses)}

Instructions:
1. Generate specific, context-aware optimizations. 
2. NEVER invent fake credentials, qualifications, degrees, skills, or employment history. Keep optimizations factually grounded.
3. Classify suggestions strictly into three arrays:
   - "alreadyAvailable": Suggestions for skills or experiences the user already possesses but are weakly worded. Includes summary improvements, keyword updates, grammar corrections, layout fixes.
   - "betterPresentation": Bullet-point rewrites for Experience or Projects using the STAR format (Situation, Task, Action, Result) with metrics where possible.
   - "missingRequirements": Essential skills or certs required in the JD that are NOT present in the candidate's resume. Mapped to local courses or external learning paths.
4. For every suggestion in "alreadyAvailable" and "betterPresentation", provide an "confidenceScore" (0-100) and a "whyExplanation" (e.g. "Matches 5 required keywords in the Microsoft JD" or "Appears 18 times in preferred qualifications").
5. For "missingRequirements", map each missing skill to the local courses above. If no local course matches, set recommendedCourseId and recommendedCourseTitle to null and provide an externalLearningPath.

You must respond STRICTLY with a valid JSON object matching the following structure:
{
  "alreadyAvailable": [
    {
      "id": "sug_summary_0",
      "section": "summary", // "summary", "skills", "certifications", "experience", "projects"
      "originalText": "current summary text",
      "suggestedText": "suggested optimized summary text",
      "explanation": "Why this change is suggested",
      "confidenceScore": 95,
      "whyExplanation": "Found directly in the core responsibilities section of the JD."
    }
  ],
  "betterPresentation": [
    {
      "id": "sug_exp_0",
      "section": "experience", // "experience", "projects"
      "index": 0, // index of the experience/project entry in the candidate's details array
      "originalText": "current responsibilities bullet list",
      "suggestedText": "suggested optimized responsibilities bullet list in STAR format",
      "explanation": "Why this rewrite improves presentation",
      "confidenceScore": 90,
      "whyExplanation": "Quantifies business results to appeal to Microsoft recruiters."
    }
  ],
  "missingRequirements": [
    {
      "skillName": "DOCKER",
      "importance": "HIGH", // "HIGH", "MEDIUM", "LOW"
      "reason": "Docker is listed under preferred qualifications in the JD.",
      "estimatedTime": "12 hours",
      "recommendedCourseId": "uuid-here-or-null",
      "recommendedCourseTitle": "Course Title here or null",
      "externalLearningPath": "https://..."
    }
  ]
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
          { role: "system", content: "You are a professional resume writer and ATS optimizer." },
          { role: "user", content: prompt }
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

    const parsedResult = JSON.parse(generatedText);
    
    return NextResponse.json({
      success: true,
      result: parsedResult
    });
  } catch (error: any) {
    console.error("AI Resume Optimizer API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate tailored resume suggestions: " + error.message },
      { status: 500 }
    );
  }
}
