import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

function getUserIdFromRequest(req: NextRequest): string | null {
  const token = req.cookies.get("token")?.value;
  if (token) {
    const payload = verifyToken(token) as { id: string } | null;
    if (payload?.id) return payload.id;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    const body = await req.json();

    const {
      name,
      email,
      phone,
      messages,
      escalated,
      escalationReason,
      assignedDepartment,
      assignedMentor,
      browser,
      device,
      os,
      outcome,
      status,
    } = body;

    const userAgent = req.headers.get("user-agent") || "";
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";

    const chatLog = await prisma.chatLog.create({
      data: {
        userId: userId || undefined,
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        messages: messages || [],
        escalated: Boolean(escalated),
        escalationReason: escalationReason || undefined,
        assignedDepartment: assignedDepartment || undefined,
        assignedMentor: assignedMentor || undefined,
        browser: browser || userAgent.substring(0, 100),
        device: device || undefined,
        os: os || undefined,
        ipAddress: ipAddress.substring(0, 45),
        outcome: outcome || (escalated ? "Escalated" : "Active"),
        status: status || (escalated ? "Pending" : "Closed"),
      },
    });

    return NextResponse.json({ success: true, logId: chatLog.id });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Chat Log API error:", err);
    return NextResponse.json({ success: false, error: "Failed to record chat log: " + errorMsg }, { status: 500 });
  }
}
