import { NextRequest, NextResponse } from "next/server";
import { buildTalentMatchPrompt } from "@/lib/ai/services/promptBuilder";
import { getAICompletion } from "@/lib/ai/services/aiService";
import { parseMarkdownJson } from "@/lib/ai/utils";
import { TalentMatchResult } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  try {
    const { jobRequirements, candidates } = await req.json();

    if (!jobRequirements || !candidates || !Array.isArray(candidates)) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid jobRequirements or candidates list." },
        { status: 400 }
      );
    }

    const prompt = buildTalentMatchPrompt(jobRequirements, candidates);
    const aiResponse = await getAICompletion(prompt);

    if (!aiResponse.success || !aiResponse.text) {
      return NextResponse.json(aiResponse);
    }

    const parsedResult = parseMarkdownJson<TalentMatchResult>(aiResponse.text);
    return NextResponse.json({
      success: true,
      result: parsedResult,
      provider: aiResponse.provider,
    });
  } catch (error: any) {
    console.error("AI Talent Match API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to compile AI talent match evaluations." },
      { status: 500 }
    );
  }
}
