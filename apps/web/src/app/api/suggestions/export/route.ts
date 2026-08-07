import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string } | null;
    if (!payload?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, role: true }
    });

    if (!dbUser || dbUser.role !== "Admin") {
      return NextResponse.json({ error: "Access Forbidden: Admin privileges required" }, { status: 403 });
    }

    const suggestions = await prisma.ideaSuggestion.findMany({
      orderBy: { createdAt: "desc" }
    });

    // Helper to sanitize CSV field
    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      "Submission ID",
      "User Name",
      "User Email",
      "Title",
      "Category",
      "Status",
      "Priority",
      "LOA Eligible",
      "LOA Status",
      "LOA Marked By",
      "Created At",
      "Current Problem",
      "Proposed Solution",
      "Expected Outcome",
      "Benefits",
      "Why Implement",
      "Internal Remarks"
    ];

    const rows = suggestions.map((s) => [
      escapeCsv(s.submissionId),
      escapeCsv(s.userName),
      escapeCsv(s.userEmail),
      escapeCsv(s.title),
      escapeCsv(s.category),
      escapeCsv(s.status),
      escapeCsv(s.priority),
      escapeCsv(s.loaEligible ? "Yes" : "No"),
      escapeCsv(s.loaStatus || "N/A"),
      escapeCsv(s.loaMarkedBy || "N/A"),
      escapeCsv(new Date(s.createdAt).toISOString()),
      escapeCsv(s.currentProblem),
      escapeCsv(s.proposedSolution),
      escapeCsv(s.expectedOutcome),
      escapeCsv(s.benefits),
      escapeCsv(s.whyImplement),
      escapeCsv(s.internalRemarks || "")
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="EpitomeTRC_Ideas_Suggestions_${new Date().toISOString().slice(0, 10)}.csv"`
      }
    });

  } catch (error: any) {
    console.error("Suggestions export CSV error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
