import { NextRequest, NextResponse } from "next/server";

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

    const systemPrompt = `You are a real-world ATS (Applicant Tracking System) parser and evaluator.
Your job is to match a candidate's resume text against a Job Description (JD) and perform a comprehensive ATS compatibility analysis.

Evaluate the resume across:
1. Keyword match rate (common terms, frameworks, tools mentioned in the JD that are present in the resume).
2. Required vs missing skills (categorized as matched and missing).
3. Experience relevance (does the candidate's experience align with the responsibilities and year requirements of the JD?).
4. Education fit (does the candidate's degree match the education requirements of the JD?).
5. Resume structure & formatting (is the resume structured cleanly with clear headings: Education, Experience, Skills, Projects?).
6. Measurable achievements (does the candidate use metrics, percentages, numbers, or business outcomes in their work history?).
7. Readability & general ATS compatibility.

Compute these specific metrics (strictly calculated dynamically based on semantic overlap):
- overallAtsScore (0-100)
- jobMatchPercentage (0-100)
- keywordMatchPercentage (0-100)
- skillMatchPercentage (0-100)
- experienceMatchPercentage (0-100)

Provide lists of:
- matchedSkills (skills from JD present in resume, formatted in UPPERCASE)
- missingSkills (essential skills from JD missing in resume, formatted in UPPERCASE)
- missingKeywords (important words/terms from JD missing in resume, formatted in UPPERCASE)
- strengths (specific highlights of the resume matching the JD)
- weaknesses (gaps between resume and JD)
- suggestions (actionable resume rewrite advice)
- certRecommendations (certifications that would help match the JD)
- techRecommendations (technologies or projects to build to match the JD)

Return strictly a JSON object matching this exact structure:
{
  "overallAtsScore": 85,
  "jobMatchPercentage": 80,
  "keywordMatchPercentage": 75,
  "skillMatchPercentage": 85,
  "experienceMatchPercentage": 80,
  "matchedSkills": ["REACT", "TYPESCRIPT"],
  "missingSkills": ["DOCKER", "AWS"],
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
