import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

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

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId parameter" }, { status: 400 });
    }

    // Check enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: payload.id, courseId },
    });
    if (!enrollment) {
      return NextResponse.json({ error: "Forbidden: Not enrolled in this course" }, { status: 403 });
    }

    // Return success or mock file download stream
    return NextResponse.json({ success: true, message: "Download authorized" });
  } catch (error: unknown) {
    console.error("Downloads API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
