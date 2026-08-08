import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const maxDuration = 60; // 60s Vercel serverless function timeout

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { verifyToken } = await import("@/lib/jwt");
    const payload = verifyToken(token) as { id: string } | null;
    if (!payload?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      mode, // "optimize-jd" | "improve-section" | "generate-cover-letter" | "generate-full-resume"
      action, // "Make Technical" | "Add Metrics" | "Rewrite" | "Fix Grammar" | "Shorten" | "Expand"
      targetRole,
      companyName,
      jobDescription,
      sectionText,
      bio,
      experience,
      projects,
      skills,
      certifications,
      education,
    } = body;

    // Log RESUME_GENERATION Audit Trail
    const { logAuditAction } = await import("@/lib/audit");
    await logAuditAction(
      user.id,
      user.email,
      "RESUME_GENERATION",
      { mode, action, targetRole, companyName },
      req.headers.get("x-forwarded-for")
    );

    if (!GROQ_API_KEY) {
      // Graceful fallback response when key is unconfigured locally
      return NextResponse.json({
        success: true,
        fallback: true,
        text: mode === "generate-cover-letter"
          ? `Dear Hiring Manager at ${companyName || "Target Company"},\n\nI am writing to express my strong interest in the ${targetRole || "Engineering"} position. With a solid foundation in software development and proven technical problem-solving capabilities, I am eager to contribute to your team's success.\n\nThank you for your time and consideration.\n\nSincerely,\nCandidate`
          : (sectionText ? `Polished: ${sectionText}` : "Professional summary generated based on profile credentials."),
      });
    }

    let systemPrompt = "You are a professional resume writer and ATS optimization specialist.";
    let userPrompt = "";

    if (mode === "generate-cover-letter") {
      systemPrompt = "You are an executive career advisor writing a tailored cover letter.";
      userPrompt = `Write a professional cover letter for the role of "${targetRole || "Software Engineer"}" at "${companyName || "Target Company"}".
Job Description: "${jobDescription || "Not provided"}"
Candidate Resume Details:
- Summary: "${bio || ""}"
- Key Skills: ${JSON.stringify(skills || [])}
- Experience: ${JSON.stringify(experience || [])}

Respond STRICTLY with a valid JSON object matching:
{
  "coverLetter": "Dear Hiring Manager... (full cover letter body)"
}`;
    } else if (mode === "improve-section") {
      systemPrompt = "You are an elite ATS resume editor optimizing specific text sections.";
      userPrompt = `Improve the following text for a resume using the action directive: "${action || "Make Technical & Impactful"}".
Target Role: "${targetRole || "Software Engineer"}"
Current Text:
"${sectionText}"

Guidelines:
- Do NOT invent fake experience or credentials.
- Use strong action verbs and professional recruiter-friendly tone.
- If action is "Add Metrics", frame achievements with metrics or percentages where realistic.
- Respond STRICTLY with a valid JSON object matching:
{
  "improvedText": "The improved, recruiter-friendly text here"
}`;
    } else {
      // Default: Full JD / Resume Optimizer
      const localCourses = await prisma.course.findMany({
        select: { id: true, title: true, description: true, category: true, duration: true }
      });

      systemPrompt = "Act as an expert ATS Resume Optimizer & Professional Career Coach.";
      userPrompt = `Analyze the candidate's current resume sections and provide section-by-section optimizations tailored specifically to the target Job Title, Company, and Job Description.

Target Job Title: "${targetRole || "Software Engineer"}"
Target Company: "${companyName || "Target Company"}"
Target Job Description: "${jobDescription || "Not provided"}"

Current Candidate Details:
- Summary / Bio: "${bio || ""}"
- Work Experience: ${JSON.stringify(experience || [])}
- Technical Projects: ${JSON.stringify(projects || [])}
- Current Skills: ${JSON.stringify(skills || [])}
- Certifications: ${JSON.stringify(certifications || [])}
- Education: ${JSON.stringify(education || [])}

EpitomeTRC Local Courses Catalog:
${JSON.stringify(localCourses)}

Respond STRICTLY with a valid JSON object matching:
{
  "alreadyAvailable": [
    {
      "id": "sug_0",
      "section": "summary",
      "originalText": "current text",
      "suggestedText": "suggested text",
      "explanation": "Why this change helps",
      "confidenceScore": 95,
      "whyExplanation": "Directly matches JD keyword requirements."
    }
  ],
  "betterPresentation": [
    {
      "id": "sug_exp_0",
      "section": "experience",
      "index": 0,
      "originalText": "original bullets",
      "suggestedText": "STAR format bullets with metrics",
      "explanation": "Why this improves impact",
      "confidenceScore": 90,
      "whyExplanation": "Quantifies performance for tech recruiters."
    }
  ],
  "missingRequirements": [
    {
      "skillName": "DOCKER",
      "importance": "HIGH",
      "reason": "Listed under preferred qualifications in JD.",
      "estimatedTime": "12 hours",
      "recommendedCourseId": null,
      "recommendedCourseTitle": null,
      "externalLearningPath": "https://..."
    }
  ]
}`;
    }

    const url = "https://api.groq.com/openai/v1/chat/completions";
    const groqResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
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
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("AI Resume Builder API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process AI Resume request: " + errorMsg },
      { status: 500 }
    );
  }
}
