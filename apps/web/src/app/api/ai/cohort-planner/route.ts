import { NextRequest, NextResponse } from "next/server";
import { buildCohortPlannerPrompt } from "@/lib/ai/services/promptBuilder";
import { getAICompletion } from "@/lib/ai/services/aiService";
import { parseMarkdownJson } from "@/lib/ai/utils";
import { TrainingPlannerResult } from "@/lib/ai/types";

export async function POST(req: NextRequest) {
  try {
    const { objectives, departments, skills } = await req.json();

    if (!objectives || !departments || !skills) {
      return NextResponse.json(
        { success: false, error: "Missing training planner objectives, departments or skills parameters." },
        { status: 400 }
      );
    }

    const prompt = buildCohortPlannerPrompt(objectives, departments, skills);
    const aiResponse = await getAICompletion(prompt);

    if (!aiResponse.success || !aiResponse.text) {
      return NextResponse.json(aiResponse);
    }

    const parsedResult = parseMarkdownJson<TrainingPlannerResult>(aiResponse.text);
    return NextResponse.json({
      success: true,
      result: parsedResult,
      provider: aiResponse.provider,
    });
  } catch (error: any) {
    console.error("AI Cohort Planner API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate cohort training plan." },
      { status: 500 }
    );
  }
}
