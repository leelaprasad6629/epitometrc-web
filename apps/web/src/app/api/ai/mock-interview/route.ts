import { NextRequest, NextResponse } from "next/server";
import { buildMockInterviewPrompt } from "@/lib/ai/services/promptBuilder";
import { getAICompletion } from "@/lib/ai/services/aiService";
import { parseMarkdownJson } from "@/lib/ai/utils";

export async function POST(req: NextRequest) {
  try {
    const { jobTitle, chatHistory, studentAnswer } = await req.json();

    if (!jobTitle || !chatHistory || studentAnswer === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters." },
        { status: 400 }
      );
    }

    const prompt = buildMockInterviewPrompt(jobTitle, chatHistory, studentAnswer);
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
    console.error("AI Mock Interview API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse structured interview response." },
      { status: 500 }
    );
  }
}
