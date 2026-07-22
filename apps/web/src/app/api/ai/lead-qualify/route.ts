import { NextRequest, NextResponse } from "next/server";
import { buildLeadQualifyPrompt } from "@/lib/ai/services/promptBuilder";
import { getAICompletion } from "@/lib/ai/services/aiService";
import { parseMarkdownJson } from "@/lib/ai/utils";
import { prisma } from "@/lib/prisma";
import { createRecordVersion } from "@/lib/ai/services/versionHelper";
import { verifyToken } from "@/lib/jwt";

export const maxDuration = 60; // 60s Vercel serverless function timeout extension

// Helper to verify user ID from cookie token
function getUserId(req: NextRequest): string | null {
  try {
    const token = req.cookies.get("token")?.value;
    if (token) {
      const payload = verifyToken(token) as { id: string } | null;
      return payload?.id || "System/Public";
    }
  } catch {}
  return "System/Public";
}

// GET: List all qualified leads
export async function GET(req: NextRequest) {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    console.error("List leads error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Qualify a new lead
export async function POST(req: NextRequest) {
  try {
    const { leadName, email, requirements } = await req.json();

    if (!leadName || !email || !requirements) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters." },
        { status: 400 }
      );
    }

    const userId = getUserId(req);

    // Check if lead already exists in DB
    const existing = await prisma.lead.findFirst({
      where: { name: leadName },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        result: {
          leadScore: existing.leadScore,
          priority: existing.priority,
          industry: existing.industry,
          companySize: existing.companySize,
          businessNeed: existing.businessNeed,
          conversionProbability: existing.conversionProbability,
          explanation: existing.explanation,
          painPoints: existing.painPoints ? JSON.parse(existing.painPoints) : [],
          opportunities: existing.opportunities ? JSON.parse(existing.opportunities) : [],
          risks: existing.risks ? JSON.parse(existing.risks) : [],
          recommendedServices: existing.recommendedServices ? JSON.parse(existing.recommendedServices) : [],
          recommendedNextAction: existing.recommendedNextAction,
        },
      });
    }

    // Call LLM parser
    const prompt = buildLeadQualifyPrompt(leadName, email, requirements);
    const aiResponse = await getAICompletion(prompt);

    if (!aiResponse.success || !aiResponse.text) {
      return NextResponse.json(aiResponse);
    }

    const parsedResult = parseMarkdownJson<any>(aiResponse.text);

    // Write new lead to database
    const savedLead = await prisma.lead.create({
      data: {
        name: leadName,
        email,
        requirements,
        leadScore: parsedResult.leadScore || 50,
        priority: parsedResult.priority || "Warm",
        industry: parsedResult.industry || "General",
        companySize: parsedResult.companySize || "Mid-Market",
        businessNeed: parsedResult.businessNeed || requirements,
        conversionProbability: parsedResult.conversionProbability || 50,
        explanation: parsedResult.explanation || "",
        painPoints: JSON.stringify(parsedResult.painPoints || []),
        opportunities: JSON.stringify(parsedResult.opportunities || []),
        risks: JSON.stringify(parsedResult.risks || []),
        recommendedServices: JSON.stringify(parsedResult.recommendedServices || []),
        recommendedNextAction: parsedResult.recommendedNextAction || "Follow-up",
      },
    });

    // Write initial version v1.0
    await createRecordVersion(
      savedLead.id,
      "Lead",
      userId,
      "Initial lead qualification draft created by AI.",
      savedLead
    );

    return NextResponse.json({
      success: true,
      result: parsedResult,
      provider: aiResponse.provider,
    });
  } catch (error: any) {
    console.error("AI Lead Qualify API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse structured lead qualification: " + error.message },
      { status: 500 }
    );
  }
}

// PATCH: Override lead details (manager override)
export async function PATCH(req: NextRequest) {
  try {
    const { leadName, leadScore, priority } = await req.json();

    if (!leadName || leadScore === undefined || !priority) {
      return NextResponse.json(
        { success: false, error: "Missing required override params." },
        { status: 400 }
      );
    }

    const userId = getUserId(req);

    // Find the lead in DB
    const lead = await prisma.lead.findFirst({
      where: { name: leadName },
    });

    if (!lead) {
      return NextResponse.json(
        { success: false, error: "Lead record not found in database." },
        { status: 404 }
      );
    }

    // Save previous snapshot for log reference before updating
    const previousSnapshot = { ...lead };

    // Update lead record
    const updatedLead = await prisma.lead.update({
      where: { id: lead.id },
      data: {
        leadScore: Number(leadScore),
        priority,
        status: "Override",
        explanation: `[Manager Override Applied] Score adjusted to ${leadScore} and Priority changed to ${priority}.`,
      },
    });

    // Log the override version increment (v1.1, v1.2, etc.)
    await createRecordVersion(
      lead.id,
      "Lead",
      userId,
      `Manager override applied. Adjusted score to ${leadScore} and priority to ${priority}.`,
      previousSnapshot
    );

    return NextResponse.json({
      success: true,
      lead: updatedLead,
    });
  } catch (error: any) {
    console.error("Lead override API error:", error);
    return NextResponse.json(
      { success: false, error: "Override persistent write failed: " + error.message },
      { status: 500 }
    );
  }
}
