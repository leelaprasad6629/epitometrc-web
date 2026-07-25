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

    // Fetch user details
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { role: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let notifications: any[] = [];

    if (user.role === "Student") {
      // Fetch this student's activities
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: payload.id },
        include: { course: true },
        orderBy: { completedAt: "desc" },
        take: 3,
      });

      const applications = await prisma.application.findMany({
        where: { userId: payload.id },
        include: { job: true },
        orderBy: { appliedAt: "desc" },
        take: 3,
      });

      // Map to notifications
      enrollments.forEach((e) => {
        notifications.push({
          id: `enr-${e.id}`,
          title: `Enrolled in ${e.course.title}`,
          time: `Progress: ${e.progress}%`,
          read: e.progress > 0,
        });

        if (e.progress === 100) {
          notifications.push({
            id: `comp-${e.id}`,
            title: `Graduated from ${e.course.title}!`,
            time: `Certificate CERT-${e.id.substring(0, 8).toUpperCase()} issued`,
            read: true,
          });
        }
      });

      applications.forEach((a) => {
        notifications.push({
          id: `app-${a.id}`,
          title: `Application for ${a.job.title} updated to: ${a.status}`,
          time: new Date(a.appliedAt).toLocaleDateString(),
          read: a.status !== "Reviewing",
        });
      });
    } else {
      // Employee / Admin: Fetch recent student actions
      const recentEnrollments = await prisma.enrollment.findMany({
        take: 5,
        orderBy: { completedAt: "desc" },
        include: {
          user: { select: { name: true } },
          course: { select: { title: true } },
        },
      });

      const recentApplications = await prisma.application.findMany({
        take: 5,
        orderBy: { appliedAt: "desc" },
        include: {
          user: { select: { name: true } },
          job: { select: { title: true } },
        },
      });

      const recentProfiles = await prisma.userProfile.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: {
          user: { select: { name: true } },
        },
      });

      recentProfiles.forEach((up) => {
        const extra = (up.profile as any) || {};
        if (extra.reviewStatus === "Review Requested") {
          notifications.push({
            id: `rev-req-${up.userId}`,
            title: `${up.user.name} requested profile & resume review`,
            time: `ATS Fit: ${extra.atsAnalysis?.matchScore || "Not Evaluated"}%`,
            read: false,
          });
        }
      });

      recentEnrollments.forEach((e) => {
        notifications.push({
          id: `enr-emp-${e.id}`,
          title: `${e.user.name} enrolled in ${e.course.title}`,
          time: `Cohort progress: ${e.progress}%`,
          read: e.progress > 0,
        });

        if (e.progress === 100) {
          notifications.push({
            id: `comp-emp-${e.id}`,
            title: `${e.user.name} completed ${e.course.title}`,
            time: `Course fully completed`,
            read: true,
          });
        }
      });

      recentApplications.forEach((a) => {
        notifications.push({
          id: `app-emp-${a.id}`,
          title: `${a.user.name} applied for ${a.job.title}`,
          time: `Application status: ${a.status}`,
          read: a.status !== "Reviewing",
        });
      });
    }

    // Sort by id or time to make it look stable and cohesive
    notifications = notifications.slice(0, 6);

    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (error: any) {
    console.error("Notifications API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
