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

    // Mock quizzes data
    const quizzes = [
      { id: "1", title: "Module 1 Review Quiz", questionsCount: 10, timeLimitMinutes: 15 }
    ];

    return NextResponse.json({ success: true, quizzes });
  } catch (error: unknown) {
    console.error("Quizzes API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
