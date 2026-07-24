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
      select: { role: true, name: true },
    });

    if (!user || (user.role !== "Employee" && user.role !== "Admin" && user.role !== "Employer" && user.role !== "Organization")) {
      return NextResponse.json({ error: "Access Forbidden" }, { status: 403 });
    }

    // Fetch stats
    const activeOpenings = await prisma.job.count({
      where: { status: "Active" },
    });

    const totalApplicants = await prisma.application.count();

    const ongoingProjects = await prisma.enrollment.count({
      where: { progress: { lt: 100 } },
    });

    const newMatches = await prisma.application.count({
      where: { status: "Reviewing" },
    });

    const totalStudents = await prisma.user.count({
      where: { role: "Student" },
    });

    // Compute average ATS score from parsed profile completeness
    const profiles = await prisma.userProfile.findMany({ select: { profile: true } });
    let totalCompleteness = 0;
    let profileCount = 0;
    profiles.forEach((p) => {
      if (p.profile && typeof p.profile === "object") {
        const completeness = (p.profile as any).overallCompleteness;
        if (typeof completeness === "number") {
          totalCompleteness += completeness;
          profileCount++;
        }
      }
    });
    const averageAtsScore = profileCount > 0 ? Math.round(totalCompleteness / profileCount) : 85;

    // Compute average placement readiness based on student course progress
    const enrollmentsProgress = await prisma.enrollment.findMany({ select: { progress: true } });
    const totalProgress = enrollmentsProgress.reduce((sum, e) => sum + e.progress, 0);
    const placementReadiness = enrollmentsProgress.length > 0 
      ? Math.round(totalProgress / enrollmentsProgress.length) 
      : 75;

    // Fetch pipeline counts
    const appliedCount = await prisma.application.count({
      where: { status: "Reviewing" },
    });
    const interviewCount = await prisma.application.count({
      where: { status: "Interviewing" },
    });
    const offeredCount = await prisma.application.count({
      where: { status: "Approved" },
    });
    const hiredCount = await prisma.application.count({
      where: { status: "Hired" },
    });

    // Fetch recent applications/activities
    const recentApplications = await prisma.application.findMany({
      take: 5,
      orderBy: { appliedAt: "desc" },
      include: {
        user: { select: { name: true } },
        job: { select: { title: true } },
      },
    });

    const activities = recentApplications.map((app) => ({
      text: `New application for ${app.job.title}`,
      time: new Date(app.appliedAt).toLocaleDateString(),
      author: app.user.name,
    }));

    // Fetch active enrollments (deliverables)
    const activeEnrollments = await prisma.enrollment.findMany({
      take: 4,
      where: { progress: { lt: 100 } },
      include: {
        course: { select: { title: true } },
        user: { select: { name: true } },
      },
    });

    const deliverables = activeEnrollments.map((enr) => ({
      name: `${enr.course.title} (${enr.user.name})`,
      status: enr.progress > 0 ? "IN PROGRESS" : "NOT STARTED",
      statusColor: enr.progress > 0 
        ? "text-blue-600 bg-blue-50 border-blue-100" 
        : "text-slate-500 bg-slate-50 border-slate-200",
      due: `Progress: ${enr.progress}%`,
    }));

    return NextResponse.json({
      success: true,
      userName: user.name,
      stats: {
        activeOpenings: activeOpenings.toString(),
        totalApplicants: totalApplicants.toLocaleString(),
        ongoingProjects: ongoingProjects.toString().padStart(2, "0"),
        newMatches: newMatches.toString(),
        totalStudents: totalStudents.toString(),
        averageAtsScore: `${averageAtsScore}%`,
        placementReadiness: `${placementReadiness}%`,
        activeInterviews: interviewCount.toString(),
      },
      pipeline: [
        { name: "Applied", count: appliedCount, height: "h-40" },
        { name: "Interviews", count: interviewCount, height: "h-28" },
        { name: "Offered", count: offeredCount, height: "h-14" },
        { name: "Hired", count: hiredCount, height: "h-8" },
      ],
      activities: activities.length > 0 ? activities : [
        { text: "No recent applications received.", time: "Just now", author: "System" }
      ],
      deliverables: deliverables.length > 0 ? deliverables : [
        { name: "No active corporate/student cohorts.", status: "COMPLETED", statusColor: "text-emerald-600 bg-emerald-50 border-emerald-100", due: "None" }
      ],
    });
  } catch (error: any) {
    console.error("Employee dashboard API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
