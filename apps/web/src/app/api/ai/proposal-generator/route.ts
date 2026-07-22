import { NextRequest, NextResponse } from "next/server";
import { buildProposalPrompt } from "@/lib/ai/services/promptBuilder";
import { getAICompletion } from "@/lib/ai/services/aiService";
import { parseMarkdownJson } from "@/lib/ai/utils";

export const maxDuration = 60; // 60s Vercel serverless function timeout extension

export async function POST(req: NextRequest) {
  try {
    const { clientName, requirements } = await req.json();

    if (!clientName || !requirements) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters." },
        { status: 400 }
      );
    }

    const prompt = buildProposalPrompt(clientName, requirements);
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
    console.error("AI Proposal Generator API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse business proposal: " + error.message },
      { status: 500 }
    );
  }
}
