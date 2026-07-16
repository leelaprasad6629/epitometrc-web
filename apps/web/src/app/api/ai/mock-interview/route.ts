import { NextRequest, NextResponse } from "next/server";
import { getAICompletion } from "@/lib/ai/services/aiService";

export async function POST(req: NextRequest) {
  try {
    const { role, interviewType, difficulty, question, answer, history } = await req.json();

    const isFinalQuestion = history && history.length >= 4; // 5 question session

    const prompt = `
Act as an expert technical recruiter conducting a mock screen.
Target Role: ${role || "Software Developer"}
Interview Type: ${interviewType || "Technical"}
Difficulty Level: ${difficulty || "Intermediate"}
Current Question: "${question}"
Candidate Answer: "${answer}"
Chat History: ${JSON.stringify(history)}

If this is the final question (${isFinalQuestion ? "YES" : "NO"}), compile the detailed mock interview evaluation report.
Return strictly JSON with no comments:
{
  "evaluation": "Recruiter score feedback summary text...",
  "score": 85,
  "nextQuestion": "${isFinalQuestion ? "" : "Next personalized mock interview question..."}",
  "report": ${
    isFinalQuestion
      ? `{
          "overallScore": 86,
          "technicalScore": 88,
          "communicationScore": 85,
          "confidenceScore": 90,
          "fluencyScore": 82,
          "strengths": ["Clear explanation of component lifecycles and state synchronization hooks", "Demonstrates logical debugging workflow"],
          "weaknesses": ["Minor gaps in containerization orchestration details", "Did not quantify system optimization impacts"],
          "improvements": ["Practice detailing Docker multi-stage build files", "Quantify rendering improvements with percentages"],
          "learningTopics": ["Docker & Kubernetes Orchestration", "React Render Profiler Optimization"]
        }`
      : "null"
  }
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
  } catch (error: any) {
    console.error("AI Mock Interview API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate structured mock interview response." },
      { status: 500 }
    );
  }
}
