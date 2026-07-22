import { NextRequest, NextResponse } from "next/server";
import { buildEmailGeneratorPrompt } from "@/lib/ai/services/promptBuilder";
import { getAICompletion } from "@/lib/ai/services/aiService";
import { parseMarkdownJson } from "@/lib/ai/utils";

export const maxDuration = 60; // 60s Vercel serverless function timeout extension

export async function POST(req: NextRequest) {
  try {
    const { recipientName, targetRoleOrJob, emailTone, templateType, additionalContext } = await req.json();

    if (!recipientName || !targetRoleOrJob || !emailTone || !templateType) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters." },
        { status: 400 }
      );
    }

    const prompt = buildEmailGeneratorPrompt(
      recipientName,
      targetRoleOrJob,
      emailTone,
      templateType,
      additionalContext || "No extra context provided."
    );
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
    console.error("AI Email Generator API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse structured email layout: " + error.message },
      { status: 500 }
    );
  }
}
