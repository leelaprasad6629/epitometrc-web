import { NextRequest, NextResponse } from "next/server";
import { buildResumeMatchPrompt } from "@/lib/ai/services/promptBuilder";
import { getAICompletion } from "@/lib/ai/services/aiService";
import { parseMarkdownJson } from "@/lib/ai/utils";
import { ResumeMatchResult } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobTitle, jobDescription } = await req.json();

    if (!resumeText || !jobTitle || !jobDescription) {
      return NextResponse.json(
        { success: false, error: "Missing resumeText, jobTitle or jobDescription." },
        { status: 400 }
      );
    }

    const prompt = buildResumeMatchPrompt(resumeText, jobTitle, jobDescription);
    const aiResponse = await getAICompletion(prompt);

    if (!aiResponse.success || !aiResponse.text) {
      return NextResponse.json(aiResponse);
    }

    const parsedResult = parseMarkdownJson<ResumeMatchResult>(aiResponse.text);
    return NextResponse.json({
      success: true,
      result: parsedResult,
      provider: aiResponse.provider,
    });
  } catch (error: any) {
    console.error("AI Resume Match API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse resume match keywords details." },
      { status: 500 }
    );
  }
}
