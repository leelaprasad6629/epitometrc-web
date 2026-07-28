import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import crypto from "crypto";

function getUserIdFromRequest(req: NextRequest): string | null {
  const token = req.cookies.get("token")?.value;
  if (token) {
    const payload = verifyToken(token) as { id: string } | null;
    if (payload?.id) return payload.id;
  }
  return null;
}

// Hash IP using SHA-256 for privacy compliance
function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip + "EPITOME_SALT").digest("hex").substring(0, 32);
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    const body = await req.json();

    const {
      sessionId,
      name,
      email,
      phone,
      messages,
      escalated,
      escalationReason,
      assignedDepartment,
      conversationSummary,
      confidenceScore,
      intent,
      clientMetadata,
    } = body;

    const rawIp = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
    const hashedIp = hashIp(rawIp);

    const activeSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const targetDept = assignedDepartment || "General Enquiries";

    // 1. Create or update ChatSession
    const session = await prisma.chatSession.upsert({
      where: { sessionId: activeSessionId },
      update: {
        conversationStatus: escalated ? "Escalated" : "Active",
        escalated: Boolean(escalated),
        department: targetDept,
        conversationSummary: conversationSummary || undefined,
        confidenceScore: confidenceScore !== undefined ? Number(confidenceScore) : undefined,
        browser: clientMetadata?.browser,
        operatingSystem: clientMetadata?.operatingSystem,
        device: clientMetadata?.device,
        language: clientMetadata?.language,
        referrerUrl: clientMetadata?.referrerUrl,
        currentPage: clientMetadata?.currentPage,
        ipAddress: hashedIp,
      },
      create: {
        sessionId: activeSessionId,
        userId: userId || undefined,
        conversationStatus: escalated ? "Escalated" : "Active",
        escalated: Boolean(escalated),
        department: targetDept,
        conversationSummary: conversationSummary || undefined,
        confidenceScore: confidenceScore !== undefined ? Number(confidenceScore) : undefined,
        browser: clientMetadata?.browser || "Unknown",
        operatingSystem: clientMetadata?.operatingSystem || "Unknown",
        device: clientMetadata?.device || "Desktop",
        language: clientMetadata?.language || "en-US",
        referrerUrl: clientMetadata?.referrerUrl || "",
        currentPage: clientMetadata?.currentPage || "/",
        ipAddress: hashedIp,
      },
    });

    // 2. Persist latest messages to ChatMessage model if provided
    if (messages && Array.isArray(messages) && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg) {
        await prisma.chatMessage.create({
          data: {
            sessionId: activeSessionId,
            sender: lastMsg.role === "user" ? "user" : "bot",
            message: lastMsg.content || "",
            intent: intent || undefined,
            confidence: confidenceScore !== undefined ? Number(confidenceScore) : undefined,
          },
        });
      }
    }

    // 3. Create ChatEscalation record if user submitted escalation
    if (escalated && email && name) {
      await prisma.chatEscalation.upsert({
        where: { sessionId: activeSessionId },
        update: {
          userName: name,
          email,
          phone: phone || undefined,
          assignedDepartment: targetDept,
          routingReason: escalationReason || "Automated confidence escalation",
          conversationSummary: conversationSummary || undefined,
        },
        create: {
          sessionId: activeSessionId,
          userName: name,
          email,
          phone: phone || undefined,
          assignedDepartment: targetDept,
          routingReason: escalationReason || "Automated confidence escalation",
          conversationSummary: conversationSummary || undefined,
          status: "Pending",
        },
      });
    }

    // 4. Also store legacy ChatLog for full backward compatibility
    await prisma.chatLog.create({
      data: {
        userId: userId || undefined,
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        messages: messages || [],
        escalated: Boolean(escalated),
        escalationReason: escalationReason || undefined,
        assignedDepartment: targetDept,
        browser: clientMetadata?.browser || undefined,
        device: clientMetadata?.device || undefined,
        os: clientMetadata?.operatingSystem || undefined,
        ipAddress: hashedIp,
        outcome: escalated ? "Escalated" : "Active",
        status: escalated ? "Pending" : "Closed",
      },
    });

    return NextResponse.json({ success: true, sessionId: activeSessionId, logId: session.id });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Chat Log API error:", err);
    return NextResponse.json({ success: false, error: "Failed to record chat log: " + errorMsg }, { status: 500 });
  }
}
