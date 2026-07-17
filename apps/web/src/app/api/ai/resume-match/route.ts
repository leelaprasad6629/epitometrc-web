import { NextRequest, NextResponse } from "next/server";
import { getAICompletion } from "@/lib/ai/services/aiService";
import { buildResumeMatchPrompt } from "@/lib/ai/services/promptBuilder";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { selectedJobRole, resumeText, jobTitle, jobDescription } = body;

    // Format A: Client sent pre-calculated matching results and wants insights (from AIResumeMatchWidget)
    if (selectedJobRole) {
      const prompt = `
Act as an expert technical career mentor. Evaluate the matching results for candidate ${body.fullName || "Student"}:
Target Role: ${selectedJobRole}
ATS Score: ${body.atsScore}%
Match Score: ${body.matchScore}%
Skill Match Percentage: ${body.skillMatchPercentage}%
Matched Skills: ${JSON.stringify(body.matchedSkills)}
Missing Skills: ${JSON.stringify(body.missingSkills)}

Generate constructive feedback detailing candidate strengths, weaknesses, resume rewrite suggestions, specific certification recommendations, and technical project recommendations.
Return strictly JSON with no comments:
{
  "strengths": ["Clear React frontend experience", "Active GitHub project list"],
  "weaknesses": ["Gaps in cloud containerization systems", "No unit testing libraries in the stack"],
  "suggestions": ["Incorporate Jest/Cypress testing projects", "Highlight PostgreSQL database optimization experiences"],
  "certRecommendations": ["AWS Certified Developer Associate", "PostgreSQL Admin Certification"],
  "techRecommendations": ["Build a containerized multi-stage Docker deployment repo"]
}
      `.trim();

      const aiResponse = await getAICompletion(prompt);

      if (!aiResponse.success || !aiResponse.text) {
        return NextResponse.json(aiResponse);
      }

      const cleanJson = aiResponse.text.replace(/```json|```/g, "").trim();
      const parsedResult = JSON.parse(cleanJson);
      return NextResponse.json({
        success: true,
        result: parsedResult
      });
    }

    // Format B: Standard raw text comparison match
    if (!resumeText || !jobTitle || !jobDescription) {
      return NextResponse.json(
        { success: false, error: "Missing required resumeText, jobTitle, or jobDescription parameters." },
        { status: 400 }
      );
    }

    const prompt = buildResumeMatchPrompt(resumeText, jobTitle, jobDescription);
    const aiResponse = await getAICompletion(prompt);

    if (!aiResponse.success || !aiResponse.text) {
      return NextResponse.json(aiResponse);
    }

    const cleanJson = aiResponse.text.replace(/```json|```/g, "").trim();
    const parsedResult = JSON.parse(cleanJson);
    return NextResponse.json({
      success: true,
      result: parsedResult,
      provider: aiResponse.provider
    });

  } catch (error: any) {
    console.error("AI Resume Match API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process resume match analysis." },
      { status: 500 }
    );
  }
}
