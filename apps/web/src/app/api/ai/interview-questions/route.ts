import { NextRequest, NextResponse } from "next/server";
import { getAICompletion } from "@/lib/ai/services/aiService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, difficulty, skills, experience, interviewType, courseTitle } = body;

    let prompt = "";

    if (courseTitle) {
      prompt = `
You are an expert technical instructor. Generate 4 high-quality, targeted interview questions with answers for a candidate who has completed the course: "${courseTitle}".
Format the response strictly as a JSON block with no markdown wrappers or comments. Match this structure exactly:
{
  "questions": [
    {
      "id": 1,
      "question": "The technical interview question text",
      "answer": "The expected answer outline or explanation"
    },
    {
      "id": 2,
      "question": "Another technical interview question",
      "answer": "Answer guide details"
    },
    {
      "id": 3,
      "question": "A third interview question",
      "answer": "Answer guide details"
    },
    {
      "id": 4,
      "question": "A fourth interview question",
      "answer": "Answer guide details"
    }
  ]
}
      `.trim();
    } else {
      prompt = `
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
    }

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
