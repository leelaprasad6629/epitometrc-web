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

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { name: true },
    });

    // Fetch user enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: payload.id },
      include: { course: true },
    });

    // Fetch user applications
    const applications = await prisma.application.findMany({
      where: { userId: payload.id },
      include: { job: true },
    });

    // Fetch all courses for recommendation
    const enrolledCourseIds = enrollments.map((e) => e.courseId);
    const recommended = await prisma.course.findMany({
      where: {
        id: { notIn: enrolledCourseIds },
      },
      take: 2,
    });

    return NextResponse.json({
      success: true,
      userName: user?.name || "Alex",
      stats: {
        activeCourses: enrollments.length,
        pendingAssignments: 3, // mock count
        certifications: enrollments.filter((e) => e.progress === 100).length,
        mentorSessions: 8, // mock count
      },
      enrollments: enrollments.map((e) => ({
        id: e.id,
        courseId: e.courseId,
        title: e.course.title,
        progress: e.progress,
        image: e.course.image,
        duration: e.course.duration,
      })),
      applications: applications.map((a) => ({
        id: a.id,
        role: a.job.title,
        company: "EpitomeTRC",
        status: a.status,
        appliedDate: a.appliedAt.toLocaleDateString(),
      })),
      recommended: recommended.map((r) => ({
        id: r.id,
        title: r.title,
        location: "Virtual Classroom",
        duration: r.duration,
        image: r.image,
      })),
    });
  } catch (error: any) {
    console.error("Student dashboard error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
