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
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch student user details
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        name: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all completed course enrollments (progress = 100)
    const completedEnrollments = await prisma.enrollment.findMany({
      where: {
        userId: payload.id,
        progress: 100,
      },
      include: {
        course: true,
      },
      orderBy: { completedAt: "desc" },
    });

    const certificates = completedEnrollments.map((enr: any) => {
      let instructorName = "Marcus Thorne";
      let instructorTitle = "Placement Director & Strategy Coach";

      if (enr.course.category.toLowerCase().includes("tech")) {
        instructorName = "Sarah Jennings";
        instructorTitle = "Technical Director & IT Lead Consultant";
      }

      return {
        id: `CERT-${enr.id.substring(0, 8).toUpperCase()}`,
        title: enr.course.title,
        issuedBy: "EpitomeTRC Academy",
        issuedDate: new Date(enr.completedAt || new Date()).toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        instructorName,
        instructorTitle,
      };
    });

    return NextResponse.json({
      success: true,
      studentName: user.name,
      certificates,
    });
  } catch (error: any) {
    console.error("Student certificates API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
