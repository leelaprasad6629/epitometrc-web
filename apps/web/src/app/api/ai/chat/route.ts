import { NextRequest, NextResponse } from "next/server";
import { buildChatPrompt } from "@/lib/ai/services/promptBuilder";
import { getAICompletion } from "@/lib/ai/services/aiService";

// Intent classifier & department routing map
function detectIntentAndDepartment(userMessage: string): { intent: string; department: string } {
  const text = userMessage.toLowerCase();

  if (text.match(/job|hire|hiring|placement|recruit|vacancy|sourcing/)) {
    return { intent: "Recruitment", department: "Recruitment & Staffing" };
  }
  if (text.match(/resume|ats|cv|bullet|template|summary|formatting/)) {
    return { intent: "Resume", department: "AI Resume Builder Support" };
  }
  if (text.match(/course|certification|workshop|learn|cohort|training|bootcamp/)) {
    return { intent: "Training", department: "Corporate Training" };
  }
  if (text.match(/login|bug|error|issue|payment|failed|website|broken|glitch/)) {
    return { intent: "Technical", department: "Technical Support" };
  }
  if (text.match(/price|pricing|enterprise|partnership|contract|quote|consulting/)) {
    return { intent: "Sales", department: "Sales" };
  }
  if (text.match(/mentor|guidance|advisory|session|career|advice|1-on-1/)) {
    return { intent: "Mentorship", department: "Career Mentorship" };
  }

  return { intent: "General", department: "General Enquiries" };
}

// Calculate confidence score (0.0 to 1.0)
function calculateConfidence(userMessage: string, aiText: string): number {
  const text = userMessage.toLowerCase();
  const lowerAi = aiText.toLowerCase();

  // Low confidence triggers
  if (
    lowerAi.includes("i'm sorry") ||
    lowerAi.includes("don't have enough information") ||
    lowerAi.includes("not sure") ||
    lowerAi.includes("cannot assist with") ||
    text.includes("human") ||
    text.includes("agent") ||
    text.includes("speak with") ||
    text.includes("escalate")
  ) {
    return 0.55;
  }

  // Normal confidence
  if (aiText.length > 80 && !lowerAi.includes("error")) {
    return 0.88;
  }

  return 0.72;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, context } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing messages array." },
        { status: 400 }
      );
    }

    const lastUserMsg = [...messages].reverse().find((m: { role: string }) => m.role === "user")?.content || "";
    const { intent, department } = detectIntentAndDepartment(lastUserMsg);

    const pageContext = context || { pathname: "/" };
    const prompt = buildChatPrompt(messages, pageContext);
    const aiResponse = await getAICompletion(prompt);

    if (!aiResponse.success) {
      return NextResponse.json({
        success: true,
        text: `I couldn't fully resolve your request. I can connect you with our ${department} team for further assistance.`,
        confidence: 0.5,
        shouldEscalate: true,
        detectedDepartment: department,
        intent,
        conversationSummary: `User asked: "${lastUserMsg}". AI service fallback triggered.`,
      });
    }

    const aiText = aiResponse.text || "";
    const confidence = calculateConfidence(lastUserMsg, aiText);
    const shouldEscalate = confidence < 0.75;

    let responseText = aiText;
    if (shouldEscalate) {
      responseText = `I couldn't fully resolve your request. I can connect you with our ${department} team for further assistance.`;
    }

    const conversationSummary = `User inquired about ${intent.toLowerCase()} topics ("${lastUserMsg.substring(0, 80)}..."). AI Confidence score: ${confidence}.`;

    return NextResponse.json({
      success: true,
      text: responseText,
      confidence,
      shouldEscalate,
      detectedDepartment: department,
      intent,
      conversationSummary,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("AI Chat API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error in Chat API: " + errorMsg },
      { status: 500 }
    );
  }
}
