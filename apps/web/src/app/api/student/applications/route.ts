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

    const applications = await prisma.application.findMany({
      where: { userId: payload.id },
      include: {
        job: true,
      },
      orderBy: { appliedAt: "desc" },
    });

    const formatted = applications.map((app) => {
      // Create a deterministic set of screening steps based on application status
      const steps = [
        { name: "Application Submitted", date: new Date(app.appliedAt).toLocaleDateString(), completed: true },
        { name: "Resume Screening", date: "System Verified", completed: true },
        { 
          name: "Technical Assessment", 
          date: app.status === "Interviewing" || app.status === "Approved" || app.status === "Hired" ? "Active" : "Pending", 
          completed: app.status === "Interviewing" || app.status === "Approved" || app.status === "Hired" 
        },
        { 
          name: "Final Decision", 
          date: app.status === "Approved" || app.status === "Hired" ? "Completed" : app.status === "Rejected" ? "Rejected" : "Pending", 
          completed: app.status === "Approved" || app.status === "Hired" || app.status === "Rejected" 
        },
      ];

      return {
        id: app.id,
        role: app.job.title,
        company: "EpitomeTRC",
        location: app.job.location || "HQ • Remote Friendly",
        appliedDate: new Date(app.appliedAt).toLocaleDateString(),
        status: app.status,
        statusColor: app.status === "Approved" || app.status === "Hired" 
          ? "green" 
          : app.status === "Rejected" 
          ? "red" 
          : app.status === "Interviewing" 
          ? "amber" 
          : "blue",
        steps,
      };
    });

    return NextResponse.json({
      success: true,
      applications: formatted,
    });
  } catch (error: any) {
    console.error("Student applications API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
