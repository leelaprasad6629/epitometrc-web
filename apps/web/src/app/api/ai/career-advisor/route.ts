import { NextRequest, NextResponse } from "next/server";
import { getAICompletion } from "@/lib/ai/services/aiService";

export async function POST(req: NextRequest) {
  try {
    const { skills, projects, courses, goal, interviewScores, academicInfo } = await req.json();

    const prompt = `
Act as a professional ATS Career Advisor and mentor. Provide personalized career guidance based on this candidate profile:
Skills: ${JSON.stringify(skills)}
Projects: ${JSON.stringify(projects)}
Courses: ${JSON.stringify(courses)}
Target Career Goal: ${goal || "Software Engineer"}
Previous Interview Scores: ${JSON.stringify(interviewScores)}
Academic Information: ${JSON.stringify(academicInfo)}

Analyze the profile, calculate a career readiness score (0-100), and recommend career roadmaps.
Return strictly JSON with no comments:
{
  "careerReadinessScore": 78,
  "recommendedCareerPaths": ["Frontend Development", "Full Stack Development"],
  "missingSkills": ["Docker", "Kubernetes", "Next.js"],
  "suggestedCertifications": ["AWS Certified Developer Associate", "Prisma ORM Specialist Certificate"],
  "recommendedProjects": ["Build a multi-tenant microfrontend dashboard with state-synced sidebar navigation"],
  "suggestedInternships": ["Associate Developer Intern at Cloud Systems", "Frontend apprentice roles"],
  "roadmap30": ["Day 1-10: Learn Next.js App Router", "Day 11-20: Configure serverless database schemas in Supabase", "Day 21-30: Build a modular portfolio page"],
  "roadmap60": ["Day 31-45: Set up CI/CD workflows using GitHub Actions", "Day 46-60: Deploy project to Vercel and check performance metrics"],
  "roadmap90": ["Day 61-75: Apply for junior full-stack internship positions", "Day 76-90: Practice mock verbal and coding interview screens"],
  "strengths": ["Strong core JavaScript/React programming skills", "Completed relevant strategy & management coursework"],
  "weaknesses": ["Lack of deployment/cloud systems containerization experience", "No production database configurations portfolio project"]
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
    console.error("AI Career Advisor API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate structured career advisor guidance." },
      { status: 500 }
    );
  }
}
