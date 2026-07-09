import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string; role?: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify role is Employee or Admin
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { role: true },
    });

    if (!user || (user.role !== "Employee" && user.role !== "Admin")) {
      return NextResponse.json({ error: "Access Forbidden" }, { status: 403 });
    }

    // Fetch all courses
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      batches: courses.map((course, idx) => ({
        id: course.id,
        title: course.title,
        client: idx % 2 === 0 ? "GlobalTech Solutions" : "CapitalOne UK", // Mock corporate client names
        startDate: "10 Oct 2026",
        endDate: "12 Dec 2026",
        studentsCount: course._count.enrollments,
        status: "In Progress",
      })),
    });
  } catch (error: any) {
    console.error("Employee trainings API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
