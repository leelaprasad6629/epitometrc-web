import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    
    // Authenticate user
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string } | null;
    if (!payload?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: payload.id, courseId },
    });
    if (!enrollment) {
      return NextResponse.json({ error: "Forbidden: Not enrolled in this course" }, { status: 403 });
    }

    // Mock assignments data
    const assignments = [
      { id: "1", title: "Assignment 1: Stakeholder Alignment Plan", dueDate: "End of Week 2", status: "Pending" }
    ];

    return NextResponse.json({ success: true, assignments });
  } catch (error: unknown) {
    console.error("Assignments API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
