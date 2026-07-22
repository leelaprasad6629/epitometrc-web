import { NextRequest, NextResponse } from "next/server";
import { buildProposalPrompt } from "@/lib/ai/services/promptBuilder";
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

// POST: Generate a new proposal
export async function POST(req: NextRequest) {
  try {
    const { clientName, requirements } = await req.json();

    if (!clientName || !requirements) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters." },
        { status: 400 }
      );
    }

    const userId = getUserId(req);

    // Look for existing proposal in DB
    const existing = await prisma.proposal.findFirst({
      where: { clientName },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        result: {
          companyOverview: existing.companyOverview,
          projectScope: existing.projectScope,
          services: JSON.parse(existing.services),
          timeline: JSON.parse(existing.timeline),
          deliverables: JSON.parse(existing.deliverables),
          estimatedPricing: {
            total: existing.totalPrice,
            breakdown: JSON.parse(existing.priceBreakdown),
          },
          termsAndConditions: existing.termsAndConditions,
        },
      });
    }

    // Call LLM
    const prompt = buildProposalPrompt(clientName, requirements);
    const aiResponse = await getAICompletion(prompt);

    if (!aiResponse.success || !aiResponse.text) {
      return NextResponse.json(aiResponse);
    }

    const parsedResult = parseMarkdownJson<any>(aiResponse.text);

    // Write to database
    const savedProposal = await prisma.proposal.create({
      data: {
        clientName,
        requirements,
        companyOverview: parsedResult.companyOverview || "",
        projectScope: parsedResult.projectScope || "",
        services: JSON.stringify(parsedResult.services || []),
        timeline: JSON.stringify(parsedResult.timeline || []),
        deliverables: JSON.stringify(parsedResult.deliverables || []),
        totalPrice: parsedResult.estimatedPricing?.total || "$0",
        priceBreakdown: JSON.stringify(parsedResult.estimatedPricing?.breakdown || []),
        termsAndConditions: parsedResult.termsAndConditions || "",
      },
    });

    // Write initial version history v1.0
    await createRecordVersion(
      savedProposal.id,
      "Proposal",
      userId,
      "Initial business proposal drafted by AI.",
      savedProposal
    );

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

// PUT: Save custom updates to an existing proposal
export async function PUT(req: NextRequest) {
  try {
    const { clientName, requirements, proposalData } = await req.json();

    if (!clientName || !proposalData) {
      return NextResponse.json(
        { success: false, error: "Missing proposal update payload." },
        { status: 400 }
      );
    }

    const userId = getUserId(req);

    // Find the proposal
    const proposal = await prisma.proposal.findFirst({
      where: { clientName },
    });

    if (!proposal) {
      return NextResponse.json(
        { success: false, error: "Proposal record not found." },
        { status: 404 }
      );
    }

    const previousSnapshot = { ...proposal };

    // Update proposal record
    const updated = await prisma.proposal.update({
      where: { id: proposal.id },
      data: {
        companyOverview: proposalData.companyOverview || "",
        projectScope: proposalData.projectScope || "",
        services: JSON.stringify(proposalData.services || []),
        timeline: JSON.stringify(proposalData.timeline || []),
        deliverables: JSON.stringify(proposalData.deliverables || []),
        totalPrice: proposalData.estimatedPricing?.total || proposal.totalPrice,
        priceBreakdown: JSON.stringify(proposalData.estimatedPricing?.breakdown || []),
        termsAndConditions: proposalData.termsAndConditions || "",
      },
    });

    // Log the edit version increment (v1.1, v1.2, etc.)
    await createRecordVersion(
      proposal.id,
      "Proposal",
      userId,
      "Manual edits saved by manager.",
      previousSnapshot
    );

    return NextResponse.json({
      success: true,
      proposal: updated,
    });
  } catch (error: any) {
    console.error("AI Proposal Generator PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to persist proposal updates: " + error.message },
      { status: 500 }
    );
  }
}
