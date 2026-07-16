import { NextRequest, NextResponse } from "next/server";
import { buildCandidateSummaryPrompt } from "@/lib/ai/services/promptBuilder";
import { getAICompletion } from "@/lib/ai/services/aiService";
import { parseMarkdownJson } from "@/lib/ai/utils";
import { SuitabilityResult } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  try {
    const { candidateData } = await req.json();

    if (!candidateData) {
      return NextResponse.json(
        { success: false, error: "Missing candidate data profile." },
        { status: 400 }
      );
    }

    const prompt = buildCandidateSummaryPrompt(candidateData);
    const aiResponse = await getAICompletion(prompt);

    if (!aiResponse.success || !aiResponse.text) {
      return NextResponse.json(aiResponse);
    }

    const parsedResult = parseMarkdownJson<SuitabilityResult>(aiResponse.text);
    return NextResponse.json({
      success: true,
      result: parsedResult,
      provider: aiResponse.provider,
    });
  } catch (error: any) {
    console.error("AI Candidate Summary API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate suitability assessment review." },
      { status: 500 }
    );
  }
}
