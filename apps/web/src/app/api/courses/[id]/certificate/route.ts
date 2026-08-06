import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true },
    });

    const course = await prisma.course.findFirst({
      where: { OR: [{ id: courseId }, { slug: courseId }] },
    });

    if (!user || !course) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    // Check enrollment progress
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId: user.id, courseId: course.id },
    });

    const isFullyCompleted = enrollment ? enrollment.progress >= 100 : false;

    // Check if certificate exists or generate unique cert ID
    const certCode = `EPT-${course.id.substring(0, 4).toUpperCase()}-${user.id.substring(0, 4).toUpperCase()}-2026`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://epitometrc-web.vercel.app/certifications?id=${certCode}`;

    const certificate = {
      id: "cert-" + course.id,
      certificateId: certCode,
      courseId: course.id,
      courseTitle: course.title,
      userId: user.id,
      userName: user.name,
      instructorName: course.instructorName || "Dr. Rajesh Verma",
      issuedAt: enrollment?.completedAt ? enrollment.completedAt.toISOString() : new Date().toISOString(),
      qrVerificationUrl: qrUrl,
      isUnlocked: isFullyCompleted,
    };

    return NextResponse.json({ success: true, certificate });
  } catch (error: any) {
    console.error("Certificate API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
