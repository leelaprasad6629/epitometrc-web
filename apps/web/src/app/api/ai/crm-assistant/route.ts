import { NextRequest, NextResponse } from "next/server";
import { buildCRMAssistantPrompt } from "@/lib/ai/services/promptBuilder";
import { getAICompletion } from "@/lib/ai/services/aiService";
import { parseMarkdownJson } from "@/lib/ai/utils";

export const maxDuration = 60; // 60s Vercel serverless function timeout extension

export async function POST(req: NextRequest) {
  try {
    const { clientName, interactionHistory } = await req.json();

    if (!clientName || !interactionHistory) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters." },
        { status: 400 }
      );
    }

    const prompt = buildCRMAssistantPrompt(clientName, interactionHistory);
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
    console.error("AI CRM Assistant API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse CRM assistant insights: " + error.message },
      { status: 500 }
    );
  }
}
