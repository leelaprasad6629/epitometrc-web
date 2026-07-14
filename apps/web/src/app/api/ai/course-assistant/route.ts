import { NextRequest, NextResponse } from "next/server";
import { buildCourseAssistantPrompt } from "@/lib/ai/services/promptBuilder";
import { getAICompletion } from "@/lib/ai/services/aiService";
import { parseMarkdownJson } from "@/lib/ai/utils";

export async function POST(req: NextRequest) {
  try {
    const { courseTitle, studentQuestion } = await req.json();

    if (!courseTitle || !studentQuestion) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters." },
        { status: 400 }
      );
    }

    const prompt = buildCourseAssistantPrompt(courseTitle, studentQuestion);
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
    console.error("AI Course Assistant API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse structured course assistant feedback." },
      { status: 500 }
    );
  }
}
