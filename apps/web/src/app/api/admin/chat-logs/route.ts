import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const exportCsv = searchParams.get("exportCsv") === "true";

    const where: Prisma.ChatSessionWhereInput = {};

    if (department && department !== "All") {
      where.department = department;
    }

    if (status && status !== "All") {
      where.conversationStatus = status;
    }

    if (search) {
      where.OR = [
        { sessionId: { contains: search, mode: "insensitive" } },
        { department: { contains: search, mode: "insensitive" } },
        { conversationSummary: { contains: search, mode: "insensitive" } },
        { escalation: { userName: { contains: search, mode: "insensitive" } } },
        { escalation: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (exportCsv) {
      const allSessions = await prisma.chatSession.findMany({
        where,
        include: { escalation: true, messages: true },
        orderBy: { createdAt: "desc" },
      });

      const csvRows = [
        "Session ID,Date,Status,Department,Confidence,Summary,User Name,Email,Phone,Browser,OS,Device",
      ];

      for (const s of allSessions) {
        const row = [
          `"${s.sessionId}"`,
          `"${s.createdAt.toISOString()}"`,
          `"${s.conversationStatus}"`,
          `"${s.department || "General"}"`,
          `"${s.confidenceScore ?? "N/A"}"`,
          `"${(s.conversationSummary || "").replace(/"/g, '""')}"`,
          `"${s.escalation?.userName || ""}"`,
          `"${s.escalation?.email || ""}"`,
          `"${s.escalation?.phone || ""}"`,
          `"${s.browser || ""}"`,
          `"${s.operatingSystem || ""}"`,
          `"${s.device || ""}"`,
        ];
        csvRows.push(row.join(","));
      }

      return new NextResponse(csvRows.join("\n"), {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=chat_logs_${Date.now()}.csv`,
        },
      });
    }

    const total = await prisma.chatSession.count({ where });
    const sessions = await prisma.chatSession.findMany({
      where,
      include: { escalation: true, messages: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalCount = await prisma.chatSession.count();
    const escalatedCount = await prisma.chatSession.count({ where: { escalated: true } });
    const resolvedCount = await prisma.chatSession.count({ where: { resolved: true } });

    return NextResponse.json({
      success: true,
      sessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      analytics: {
        totalChats: totalCount,
        escalatedChats: escalatedCount,
        resolvedChats: resolvedCount,
        resolutionRate: totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 100,
      },
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Admin Chat Logs API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error: " + errorMsg },
      { status: 500 }
    );
  }
}
