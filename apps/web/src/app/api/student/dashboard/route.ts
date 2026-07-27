import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = getToken(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        name: true,
        profile: {
          select: {
            profile: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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

    // Calculate dynamic pending assignments and mentor sessions based on student progress
    const activeCoursesCount = enrollments.length;
    const completedAssignments = enrollments.reduce((acc, curr) => acc + Math.floor(curr.progress / 25), 0);
    const pendingAssignments = Math.max(0, (activeCoursesCount * 4) - completedAssignments);
    const mentorSessions = activeCoursesCount * 2;

    const extraProfile = (user.profile as any)?.profile || {};
    const recruiterNotes = extraProfile.recruiterNotes || [];
    const reviewStatus = extraProfile.reviewStatus || "Pending";

    return NextResponse.json({
      success: true,
      userName: user.name || "Student Partner",
      recruiterNotes,
      reviewStatus,
      stats: {
        activeCourses: activeCoursesCount,
        pendingAssignments,
        certifications: enrollments.filter((e) => e.progress === 100).length,
        mentorSessions,
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

// POST: Request portfolio review from placement advisor
export async function POST(req: NextRequest) {
  try {
    const token = getToken(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch existing profile
    const existing = await prisma.userProfile.findUnique({
      where: { userId: payload.id },
      select: { profile: true },
    });

    const extraProfile = (existing?.profile as any) || {};
    const notesArray = extraProfile.recruiterNotes || [];

    notesArray.push({
      text: "Requested profile, resume, and ATS readiness review.",
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      author: "System Alerts",
    });

    await prisma.userProfile.upsert({
      where: { userId: payload.id },
      update: {
        profile: {
          ...extraProfile,
          recruiterNotes: notesArray,
          reviewStatus: "Review Requested",
        },
      },
      create: {
        userId: payload.id,
        profile: {
          recruiterNotes: notesArray,
          reviewStatus: "Review Requested",
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Review request submitted successfully",
      reviewStatus: "Review Requested",
      recruiterNotes: notesArray,
    });
  } catch (error: any) {
    console.error("Student dashboard review request error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
