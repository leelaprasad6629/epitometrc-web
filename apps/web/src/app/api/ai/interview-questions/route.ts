import { NextRequest, NextResponse } from "next/server";
import { getAICompletion } from "@/lib/ai/services/aiService";

export async function POST(req: NextRequest) {
  try {
    const { role, difficulty, skills, experience, interviewType } = await req.json();

    const prompt = `
Act as an ATS Interview Question Generator. Generate a list of targeted interview questions matching:
Target Job Role: ${role || "Software Developer"}
Difficulty Level: ${difficulty || "Intermediate"}
Verified Candidate Skills: ${JSON.stringify(skills)}
Experience Level: ${experience || "Apprentice"}
Preferred Interview Type: ${interviewType || "Technical"}

Generate dynamic interview questions categorized into the following structure.
Return strictly JSON with no comments:
{
  "technical": ["...", "..."],
  "hr": ["...", "..."],
  "behavioral": ["...", "..."],
  "scenario": ["...", "..."],
  "coding": ["...", "..."],
  "project": ["...", "..."]
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
    console.error("AI Interview Questions API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate structured interview questions." },
      { status: 500 }
    );
  }
}
