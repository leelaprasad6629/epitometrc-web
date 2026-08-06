import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Please log in to enroll." }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized: Invalid session token." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check existing enrollment
    const existing = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId,
      },
    });

    if (existing) {
      return NextResponse.json({ success: true, enrollment: existing, message: "Already enrolled" });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId,
        progress: 0,
      },
    });

    // Increment enrolledCount on course
    await prisma.course.update({
      where: { id: courseId },
      data: { enrolledCount: { increment: 1 } },
    }).catch(() => {});

    return NextResponse.json({ success: true, enrollment });
  } catch (error: any) {
    console.error("Course enrollment API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
