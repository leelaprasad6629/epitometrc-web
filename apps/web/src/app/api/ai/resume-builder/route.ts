import { NextRequest, NextResponse } from "next/server";
import { buildResumeBuilderPrompt } from "@/lib/ai/services/promptBuilder";
import { getAICompletion } from "@/lib/ai/services/aiService";
import { parseMarkdownJson } from "@/lib/ai/utils";

export async function POST(req: NextRequest) {
  try {
    const { jobRole, rawExperience } = await req.json();

    if (!jobRole || !rawExperience) {
      return NextResponse.json(
        { success: false, error: "Missing jobRole or rawExperience." },
        { status: 400 }
      );
    }

    const prompt = buildResumeBuilderPrompt(jobRole, rawExperience);
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
    console.error("AI Resume Builder API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse structured resume builders output." },
      { status: 500 }
    );
  }
}
