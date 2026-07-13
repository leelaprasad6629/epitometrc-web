import { NextRequest, NextResponse } from "next/server";
import { buildChatPrompt } from "@/lib/ai/services/promptBuilder";
import { getAICompletion } from "@/lib/ai/services/aiService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, context } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing messages array." },
        { status: 400 }
      );
    }

    const pageContext = context || { pathname: "/" };
    const prompt = buildChatPrompt(messages, pageContext);
    const aiResponse = await getAICompletion(prompt);

    return NextResponse.json(aiResponse);
  } catch (error: any) {
    console.error("AI Chat API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error in Chat API." },
      { status: 500 }
    );
  }
}
