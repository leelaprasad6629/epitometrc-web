import { NextRequest, NextResponse } from "next/server";
import { buildBusinessConsultantPrompt } from "@/lib/ai/services/promptBuilder";
import { getAICompletion } from "@/lib/ai/services/aiService";
import { parseMarkdownJson } from "@/lib/ai/utils";
import { BusinessConsultantResult } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  try {
    const { requirements } = await req.json();

    if (!requirements || typeof requirements !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid requirements text." },
        { status: 400 }
      );
    }

    const prompt = buildBusinessConsultantPrompt(requirements);
    const aiResponse = await getAICompletion(prompt);

    if (!aiResponse.success || !aiResponse.text) {
      return NextResponse.json(aiResponse);
    }

    const parsedResult = parseMarkdownJson<BusinessConsultantResult>(aiResponse.text);
    return NextResponse.json({
      success: true,
      result: parsedResult,
      provider: aiResponse.provider,
    });
  } catch (error: any) {
    console.error("AI Business Consultant API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse structured consultant feedback." },
      { status: 500 }
    );
  }
}
