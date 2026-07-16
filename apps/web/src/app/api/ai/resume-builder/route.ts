import { NextRequest, NextResponse } from "next/server";
import { getAICompletion } from "@/lib/ai/services/aiService";

export async function POST(req: NextRequest) {
  try {
    const { bio, experience, projects, skills, role } = await req.json();

    const prompt = `
Act as an expert ATS Resume Builder Optimizer. Refactor and optimize this candidate's resume for target role: "${role || "Frontend Developer"}".
Candidate Summary: "${bio}"
Work Experience Details: ${JSON.stringify(experience)}
Projects Portfolio Details: ${JSON.stringify(projects)}
Technical Skills List: ${JSON.stringify(skills)}

Optimize summaries, rewrite experiences utilizing high-impact action verbs (e.g. 'orchestrated', 'streamlined', 'architected'), suggest missing skills/keywords, and optimize descriptions for ATS systems.
Return strictly JSON with no comments:
{
  "optimizedBio": "Optimized biography professional summary text...",
  "optimizedExperience": [
    { "companyName": "Company", "role": "Role", "responsibilities": "Optimized high-impact responsibilities string utilizing action verbs..." }
  ],
  "optimizedProjects": [
    { "projectTitle": "Title", "description": "Optimized project description details highlighting system metrics..." }
  ],
  "missingSkills": ["Docker", "Kubernetes", "Next.js"],
  "suggestedKeywords": ["Microfrontends", "CI/CD Orchestration", "Zustand Global State Sync"]
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
    console.error("AI Resume Builder API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate optimized resume recommendations." },
      { status: 500 }
    );
  }
}
