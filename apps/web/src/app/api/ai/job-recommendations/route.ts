import { NextRequest, NextResponse } from "next/server";
import { getAICompletion } from "@/lib/ai/services/aiService";

export async function POST(req: NextRequest) {
  try {
    const { skills, preferredRole, location, experience, goal } = await req.json();

    const prompt = `
Act as an ATS Job Recommendation Engine. Analyze the candidate parameters:
Skills: ${JSON.stringify(skills)}
Preferred Role: ${preferredRole || "Frontend Engineer"}
Preferred Location: ${location || "Remote / London"}
Experience Level: ${JSON.stringify(experience)}
Career Goal: ${goal || "Full Stack developer"}

Return a ranked array of 3 recommended job roles matching these attributes. Do not do simple keyword search.
Return strictly JSON with no comments:
{
  "jobs": [
    {
      "title": "Junior Full Stack Engineer",
      "company": "Epitome Tech Labs",
      "location": "London, UK (Hybrid)",
      "matchScore": 92,
      "matchedSkills": ["React", "JavaScript", "TypeScript"],
      "missingSkills": ["Node.js", "PostgreSQL"],
      "matchExplanation": "Matches your target career goal and location parameters. Your front-end skills align with their stack.",
      "eligibilitySuggestions": "Add Node.js/Express.js backend projects to your portfolio to increase matching alignment."
    },
    {
      "title": "React Frontend Developer",
      "company": "Design Systems Inc",
      "location": "Remote",
      "matchScore": 88,
      "matchedSkills": ["React", "JavaScript", "HTML5", "CSS3"],
      "missingSkills": ["Zustand", "Framer Motion"],
      "matchExplanation": "Strong alignment with your core frontend libraries. Fits preferred remote environment setup.",
      "eligibilitySuggestions": "Build interactive animation screens with Framer Motion and publish details on GitHub."
    },
    {
      "title": "Software Engineering Apprentice",
      "company": "Cloud Innovators",
      "location": "London, UK (On-site)",
      "matchScore": 82,
      "matchedSkills": ["TypeScript", "Java", "Python"],
      "missingSkills": ["AWS", "Docker"],
      "matchExplanation": "Great fit for your apprentice experience level. Offers cloud systems training program.",
      "eligibilitySuggestions": "Acquire AWS Certified Developer Associate certification to meet entry eligibility criteria."
    }
  ]
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
    console.error("AI Job Recommendations API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse structured job recommendations." },
      { status: 500 }
    );
  }
}
