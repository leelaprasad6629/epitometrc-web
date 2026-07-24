import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const maxDuration = 60; // 60s Vercel serverless function timeout

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { success: false, error: "Missing required resumeText or jobDescription parameters." },
        { status: 400 }
      );
    }

    if (!GROQ_API_KEY) {
      return NextResponse.json({ success: false, error: "Groq API Key is not configured." }, { status: 500 });
    }

    // Query local course catalog for semantic matching
    const courses = await prisma.course.findMany({
      select: { id: true, title: true, description: true, category: true, duration: true }
    });

    const systemPrompt = `You are a real-world ATS (Applicant Tracking System) parser and evaluator.
Your job is to match a candidate's resume text against a Job Description (JD) and perform a comprehensive ATS compatibility analysis.

There are two primary scores you MUST calculate:
1. overallAtsScore (0-100): General ATS compatibility. Evaluates layout, section presence (Education, Experience, Skills, Projects), readability, formatting, and general structure. Unrelated to the specific job description.
2. jobMatchPercentage (0-100): Job Match Score. Evaluates the candidate's experience relevance, skill overlap, and keyword matches strictly against the target Job Description (JD).

Here is the list of local courses available on the EpitomeTRC platform:
${JSON.stringify(courses)}

For each missing skill, semantically map it to the most relevant local course from the catalog above. If no local course is a close semantic match (e.g. course description/title is not relevant), set recommendedCourseId and recommendedCourseTitle to null and suggest a high-quality, trusted externalLearningPath URL (e.g. documentation link or free tutorial website).

Return strictly a JSON object matching this exact structure:
{
  "overallAtsScore": 85,
  "jobMatchPercentage": 80,
  "keywordMatchPercentage": 75,
  "skillMatchPercentage": 85,
  "experienceMatchPercentage": 80,
  "matchedSkills": ["REACT", "TYPESCRIPT"],
  "missingSkills": [
    {
      "name": "DOCKER",
      "importance": "HIGH", // HIGH, MEDIUM, or LOW
      "reason": "The JD lists containerization and deployment as a core responsibility, which is missing from the resume.",
      "estimatedTime": "12 hours",
      "recommendedCourseId": "uuid-here-or-null",
      "recommendedCourseTitle": "Course Title here or null",
      "externalLearningPath": "https://..." // external URL if no local course matches
    }
  ],
  "missingKeywords": ["CONTAINERIZATION", "MICROSERVICES"],
  "strengths": ["Clear React frontend experience", "Active GitHub project list"],
  "weaknesses": ["Gaps in cloud containerization systems", "No unit testing libraries in the stack"],
  "suggestions": ["Incorporate Jest/Cypress testing projects", "Highlight PostgreSQL database optimization experiences"],
  "certRecommendations": ["AWS Certified Developer Associate", "PostgreSQL Admin Certification"],
  "techRecommendations": ["Build a containerized multi-stage Docker deployment repo"]
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
          { 
            role: "user", 
            content: `Candidate Resume Text:\n\n${resumeText.substring(0, 12000)}\n\n---\n\nJob Description:\n\n${jobDescription.substring(0, 10000)}` 
          }
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

    let parsedResult = {};
    try {
      parsedResult = JSON.parse(generatedText);
    } catch (e: any) {
      return NextResponse.json({ success: false, error: "Failed to parse structured JSON from LLM: " + e.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      result: parsedResult
    });

  } catch (error: any) {
    console.error("AI Resume Match API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process resume match analysis: " + error.message },
      { status: 500 }
    );
  }
}
