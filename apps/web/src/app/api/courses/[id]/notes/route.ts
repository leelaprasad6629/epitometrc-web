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

    // Mock notes data
    const notes = [
      { id: "1", title: "Introduction & Key Terms", content: "Notes on enterprise analysis concepts and UML standards." },
      { id: "2", title: "Best Practices", content: "Notes on gathering stakeholder specifications and BPMN layouts." }
    ];

    return NextResponse.json({ success: true, notes });
  } catch (error: unknown) {
    console.error("Notes API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
