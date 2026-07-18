import { NextRequest, NextResponse } from "next/server";
import { getAICompletion } from "@/lib/ai/services/aiService";

export async function POST(req: NextRequest) {
  try {
    const { 
      role, 
      interviewType, 
      difficulty, 
      company, 
      jobDescription, 
      resumeContext, 
      question, 
      answer, 
      history 
    } = await req.json();

    const isFinalQuestion = history && history.length >= 8; // 5 question session (10 entries in history)

    const prompt = `
Act as an expert technical recruiter and interviewer conducting a professional mock screen.
Target Role: ${role || "Software Developer"}
Interview Type: ${interviewType || "Technical"}
Difficulty Level: ${difficulty || "Intermediate"}
${company ? `Target Company: ${company}` : ""}
${jobDescription ? `Target Job Description: ${jobDescription}` : ""}
${resumeContext ? `Candidate Resume Context: ${JSON.stringify(resumeContext)}` : ""}

Current Question Asked: "${question}"
Candidate's Response: "${answer}"
Conversation History: ${JSON.stringify(history)}

INSTRUCTIONS:
1. Conduct an adaptive interview. Evaluate the candidate's response.
2. If this is NOT the final question (isFinalQuestion: ${isFinalQuestion ? "YES" : "NO"}), formulate a conversational follow-up question. Challenge weak answers, ask "why" or "how" details, adapt difficulty to candidate performance, and transition topics naturally.
3. If this IS the final question (isFinalQuestion: YES), compile a comprehensive interview intelligence evaluation report.
4. Respond strictly with a JSON object. Ensure it contains no formatting errors, comments, or extra text.

Response format required:
{
  "evaluation": "Recruiter score feedback summary text...",
  "score": 85,
  "nextQuestion": "${isFinalQuestion ? "" : "Conversational follow-up question..."}",
  "report": ${
    isFinalQuestion
      ? `{
          "overallScore": 86,
          "technicalScore": 88,
          "communicationScore": 85,
          "confidenceScore": 90,
          "fluencyScore": 82,
          "problemSolvingScore": 84,
          "strengths": ["Strengths list..."],
          "weaknesses": ["Weaknesses list..."],
          "improvements": ["Areas requiring improvement..."],
          "questionsAnsweredWell": ["List of questions they did well on..."],
          "questionsAnsweredPoorly": ["List of questions answered weakly..."],
          "missedConcepts": ["Core concepts or topics missed..."],
          "learningTopics": ["Suggested technologies/concepts to study..."],
          "recommendedCertifications": ["Certifications recommendations..."],
          "recommendedProjects": ["Specific projects to build..."],
          "recommendedResources": ["Learning links/resources..."],
          "recruiterScorecard": {
            "hiringRecommendation": "Strong Hire / Hire / Hold / No Hire",
            "candidateReadiness": "Job Ready / Needs Mentoring / Unprepared",
            "suitableRoles": ["Suggested role titles..."],
            "skillGaps": ["Skills gaps detected..."],
            "interviewSummary": "Summary of overall interview performance",
            "overallImpression": "Personal assessment impression..."
          }
        }`
      : "null"
  }
}
    `.trim();

    const aiResponse = await getAICompletion(prompt);

    if (!aiResponse.success || !aiResponse.text) {
      return NextResponse.json(aiResponse);
    }

    let text = aiResponse.text.trim();
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    const parsedResult = JSON.parse(text);
    
    return NextResponse.json({
      success: true,
      result: parsedResult
    });
  } catch (error: any) {
    console.error("AI Mock Interview API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate structured mock interview response: " + error.message },
      { status: 500 }
    );
  }
}
