import { NextRequest, NextResponse } from "next/server";
import { buildCRMAssistantPrompt } from "@/lib/ai/services/promptBuilder";
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

// POST: Retrieve CRM account details or compile summary from log
export async function POST(req: NextRequest) {
  try {
    const { clientName, interactionHistory } = await req.json();

    if (!clientName) {
      return NextResponse.json(
        { success: false, error: "Missing required clientName parameter." },
        { status: 400 }
      );
    }

    const userId = getUserId(req);

    // 1. Look for existing CRM Client in database
    let client = await prisma.cRMClient.findFirst({
      where: { name: clientName },
      include: {
        interactions: { orderBy: { date: "desc" } },
        actionItems: true,
      },
    });

    // 2. If it does not exist, seed it into the DB
    if (!client) {
      // Calculate/extract details using LLM or fallback
      let parsedResult = {
        clientHealth: "Active",
        relationshipSummary: `The client accounts show high engagement. They are motivated to initiate cloud development with EpitomeTRC.`,
        timelineSummary: [
          { date: "2026-07-20", type: "Meeting", description: "Discovery call completed. Defined AWS cloud budget and React components scope.", participant: "Lead Account Manager" }
        ],
        pendingActions: [
          { description: "Prepare and transmit structured pricing proposal.", priority: "High" }
        ],
        reminders: ["Schedule 2-week check-in meeting regarding AWS migration budget."],
        upsellingOpportunities: ["Propose Next.js & Tailwind training bootcamp for their frontend engineering team."]
      };

      if (interactionHistory && interactionHistory.trim().length > 10) {
        const prompt = buildCRMAssistantPrompt(clientName, interactionHistory);
        const aiResponse = await getAICompletion(prompt);
        if (aiResponse.success && aiResponse.text) {
          try {
            parsedResult = parseMarkdownJson<any>(aiResponse.text);
          } catch {}
        }
      }

      // Create new client record in DB
      client = await prisma.cRMClient.create({
        data: {
          name: clientName,
          email: `${clientName.toLowerCase().replace(/\s+/g, "")}@example.com`,
          company: clientName,
          health: parsedResult.clientHealth || "Active",
          summary: parsedResult.relationshipSummary || "",
          interactions: {
            create: parsedResult.timelineSummary?.map(t => ({
              date: t.date,
              type: t.type,
              description: t.description,
              participant: t.participant
            })) || []
          },
          actionItems: {
            create: parsedResult.pendingActions?.map(a => ({
              description: a.description,
              priority: a.priority,
              status: "Pending"
            })) || []
          }
        },
        include: {
          interactions: { orderBy: { date: "desc" } },
          actionItems: true,
        }
      });

      // Write initial version history v1.0
      await createRecordVersion(
        client.id,
        "CRMClient",
        userId,
        "CRM Client account created and AI summary parsed.",
        client
      );
    }

    // Format output matching CRM widget props
    return NextResponse.json({
      success: true,
      result: {
        clientHealth: client.health,
        relationshipSummary: client.summary,
        timelineSummary: client.interactions.map(t => ({
          date: t.date,
          type: t.type,
          description: t.description,
          participant: t.participant
        })),
        pendingActions: client.actionItems.map(a => ({
          description: a.description,
          priority: a.priority,
          status: a.status
        })),
        reminders: [
          `Schedule follow-up check-in meeting for ${client.name}.`
        ],
        upsellingOpportunities: [
          "Propose custom staff technical bootcamp or security audit advisory packages."
        ]
      }
    });
  } catch (error: any) {
    console.error("AI CRM Assistant API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to parse CRM assistant insights: " + error.message },
      { status: 500 }
    );
  }
}
