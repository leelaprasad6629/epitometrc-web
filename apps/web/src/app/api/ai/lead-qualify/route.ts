import { NextRequest, NextResponse } from "next/server";
import { buildLeadQualifyPrompt } from "@/lib/ai/services/promptBuilder";
import { getAICompletion } from "@/lib/ai/services/aiService";
import { parseMarkdownJson } from "@/lib/ai/utils";

export async function POST(req: NextRequest) {
  try {
    const { leadName, email, requirements } = await req.json();

    if (!leadName || !email || !requirements) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters." },
        { status: 400 }
      );
    }

    const prompt = buildLeadQualifyPrompt(leadName, email, requirements);
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
    console.error("AI Lead Qualify API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse structured lead qualification." },
      { status: 500 }
    );
  }
}
