import { NextRequest, NextResponse } from "next/server";
import { getAICompletion } from "@/lib/ai/services/aiService";

export async function POST(req: NextRequest) {
  try {
    const { skills, goal, targetRole, weakAreas, interviewReports } = await req.json();

    const prompt = `
Act as a senior technical curriculum designer. Generate a personalized weekly learning roadmap for this student:
Current Skills: ${JSON.stringify(skills)}
Career Goal: ${goal || "Full Stack Engineer"}
Target Job Role: ${targetRole || "Software Developer"}
Weak Areas: ${JSON.stringify(weakAreas)}
Previous Interview Reports: ${JSON.stringify(interviewReports)}

Return a structured 4-week learning roadmap with practice questions, certifications, and projects.
Return strictly JSON with no comments:
{
  "weeks": [
    {
      "weekNumber": 1,
      "topic": "Frontend Core State Management & Optimization",
      "details": "Study hooks lifecycle, context optimization, and global state libraries like Zustand.",
      "practiceQuestions": [
        "Explain the difference between useMemo and useCallback hooks with code examples.",
        "How does Zustand trigger renders and how is it optimized compared to React Context?"
      ],
      "projects": ["Build a state-synced shopping cart page layout with offline localStorage capabilities"]
    },
    {
      "weekNumber": 2,
      "topic": "Backend REST APIs, Express & Schema Design",
      "details": "Create robust route controllers, validate payloads, and write relational prisma schemas.",
      "practiceQuestions": [
        "Explain SQL transaction isolation levels and how to prevent concurrent race conditions.",
        "Design a schema for an online recruitment portal using proper relational references."
      ],
      "projects": ["Build a modular blog index server matching backend authentication controllers"]
    },
    {
      "weekNumber": 3,
      "topic": "Cloud Deployment, CI/CD & Docker Containerization",
      "details": "Configure GitHub Actions workflows, build Docker files, and deploy to Vercel/AWS EC2.",
      "practiceQuestions": [
        "How do you configure secrets securely in GitHub Actions build workflows?",
        "Explain multi-stage Docker builds and how they reduce production container sizes."
      ],
      "projects": ["Containerize a Next.js monorepo and run deployment checks in staging actions"]
    },
    {
      "weekNumber": 4,
      "topic": "System Design, Mock Interviews & ATS Optimization",
      "details": "Practice verbal coding screens, mock interviews, and refine ATS resume keywords.",
      "practiceQuestions": [
        "Describe a complex system latency challenge you resolved using caching strategies.",
        "What are best practices in designing API gateway rate limiting systems?"
      ],
      "projects": ["Conduct 2 speech mock interviews and audit resume completeness scores"]
    }
  ],
  "recommendedCerts": ["AWS Certified Cloud Practitioner", "PostgreSQL Database Administration Cert"],
  "mockInterviewSchedule": "Week 2: Verbal mock coding screen, Week 4: Final full-stack mock interview panel."
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
    console.error("AI Learning Path API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate structured learning path roadmap." },
      { status: 500 }
    );
  }
}
