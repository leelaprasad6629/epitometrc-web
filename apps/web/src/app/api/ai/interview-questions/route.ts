import { NextRequest, NextResponse } from "next/server";
import { buildInterviewQuestionsPrompt } from "@/lib/ai/services/promptBuilder";
import { getAICompletion } from "@/lib/ai/services/aiService";
import { parseMarkdownJson } from "@/lib/ai/utils";

export async function POST(req: NextRequest) {
  try {
    const { courseTitle } = await req.json();

    if (!courseTitle || typeof courseTitle !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid courseTitle." },
        { status: 400 }
      );
    }

    const prompt = buildInterviewQuestionsPrompt(courseTitle);
    const aiResponse = await getAICompletion(prompt);

    if (!aiResponse.success || !aiResponse.text) {
      return NextResponse.json(aiResponse);
    }

    const parsedResult = parseMarkdownJson<any>(aiResponse.text);
    return NextResponse.json({
      success: true,
      result: parsedResult,
      provider: aiResponse.provider,
    });
  } catch (error: any) {
    console.error("AI Interview Questions API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse structured interview questions." },
      { status: 500 }
    );
  }
}
