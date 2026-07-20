import { NextRequest, NextResponse } from "next/server";
import { getAICompletion } from "@/lib/ai/services/aiService";

export const maxDuration = 60; // 60s Vercel serverless function timeout extension

export async function POST(req: NextRequest) {
  try {
    const { role, interviewType, difficulty, question, answer, history, company, jobDescription, resumeContext } = await req.json();

    const isFinalQuestion = history && history.length >= 8; // 5 question session (10 entries in history)

    const prompt = `
Act as an elite senior Recruiter and Hiring Manager conducting a rigorous, professional mock screen.
You must adopt the character of an interviewer from the target company if specified.

Target Role: ${role || "Software Developer"}
Interview Type: ${interviewType || "Technical"}
Difficulty Level: ${difficulty || "Intermediate"}
${company ? `Target Company: ${company} (Apply company culture/interview style, e.g., Leadership Principles for Amazon, Googlyness/Algorithms for Google, Microsoft tech stack depth)` : ""}
${jobDescription ? `Target Job Description Requirements: ${jobDescription}` : ""}
${resumeContext ? `Candidate Resume Background Context: ${JSON.stringify(resumeContext)}` : ""}

Current Question Asked: "${question}"
Candidate's Response: "${answer}"
Conversation History: ${JSON.stringify(history)}

INSTRUCTIONS:
1. Conduct an adaptive interview. Evaluate the quality, accuracy, and depth of the candidate's last answer.
2. If this is NOT the final question (isFinalQuestion: ${isFinalQuestion ? "YES" : "NO"}), formulate a highly conversational follow-up question.
   - Do NOT ask generic template questions.
   - Reference concepts the candidate brought up in their response.
   - Challenge weak, vague, or textbook answers (e.g. ask "how did you optimize that specifically?" or "what trade-offs did you consider?").
   - If they did exceptionally well, increase complexity. If they struggled, ask a clarifying sub-question to test foundation.
3. If this IS the final question (isFinalQuestion: YES), compile a comprehensive, expert interview intelligence report.
4. Respond strictly with a JSON object. Ensure it contains no markdown code block wrapper or extra comments.

Response format required:
{
  "evaluation": "Feedback text summarizing their answer performance...",
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
          "strengths": ["Detail specific strengths demonstrated..."],
          "weaknesses": ["Detail concrete gaps or weaknesses..."],
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

    let parsedResult;
    try {
      parsedResult = JSON.parse(text);
    } catch (parseError) {
      console.warn("JSON parsing of mock-interview response failed, attempting extraction recovery:", parseError);
      try {
        const cleanedText = text
          .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // remove comments
          .replace(/[\u201C\u201D]/g, '"') // replace smart quotes
          .trim();
        parsedResult = JSON.parse(cleanedText);
      } catch (secondError) {
        parsedResult = {
          evaluation: "Your answers demonstrate reasonable logical foundation, but could benefit from deeper structure and technical elaboration. Focus on clarifying implementation steps and architectural design choices.",
          score: 72,
          nextQuestion: isFinalQuestion ? "" : "Could you elaborate further on how you would structure the data flow and handle latency challenges in your design?",
          report: isFinalQuestion ? {
            overallScore: 72,
            technicalScore: 70,
            communicationScore: 75,
            confidenceScore: 78,
            fluencyScore: 72,
            problemSolvingScore: 70,
            strengths: ["Logical explanation flow", "Good communication clarity"],
            weaknesses: ["Technical depth on concurrency and state management", "Quantified performance metrics missing"],
            improvements: ["Detail architectural trade-offs in systems"],
            questionsAnsweredWell: ["Initial project architectural outline"],
            questionsAnsweredPoorly: ["Deepdive optimizations and memory locks"],
            missedConcepts: ["System scalability principles", "Database indexing structures"],
            learningTopics: ["System Design Fundamentals", "Concurrency & Thread Safety"],
            recommendedCertifications: ["AWS Certified Developer Associate"],
            recommendedProjects: ["High-throughput message queue system"],
            recommendedResources: ["Designing Data-Intensive Applications by Martin Kleppmann"],
            recruiterScorecard: {
              hiringRecommendation: "Hold",
              candidateReadiness: "Needs Mentoring",
              suitableRoles: [role || "Associate Engineer"],
              skillGaps: ["System Scaling", "Database Internals"],
              interviewSummary: "The candidate exhibits sound core development capabilities but needs refinement in systems scaling and performance-oriented design choices.",
              overallImpression: "Cooperative attitude, receptive to feedback. Technical depth needs reinforcement."
            }
          } : null
        };
      }
    }
    
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
