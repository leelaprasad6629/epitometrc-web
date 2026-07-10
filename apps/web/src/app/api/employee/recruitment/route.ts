import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// GET: list all job applications
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

    if (!user || (user.role !== "Employee" && user.role !== "Admin" && user.role !== "Employer" && user.role !== "Organization")) {
      return NextResponse.json({ error: "Access Forbidden" }, { status: 403 });
    }

    // Fetch applications
    const applications = await prisma.application.findMany({
      orderBy: { appliedAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        job: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      applicants: applications.map((app) => ({
        id: app.id,
        name: app.user.name,
        email: app.user.email,
        role: app.job.title,
        status: app.status,
        appliedDate: new Date(app.appliedAt).toLocaleDateString(),
        matchScore: "85%", // Default dynamic placeholder for matching score
      })),
    });
  } catch (error: any) {
    console.error("Recruitment API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH: update application status (Approve, Reject, Review, etc.)
export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string; role?: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify role
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { role: true },
    });

    if (!user || (user.role !== "Employee" && user.role !== "Admin" && user.role !== "Employer" && user.role !== "Organization")) {
      return NextResponse.json({ error: "Access Forbidden" }, { status: 403 });
    }

    const { applicationId, status } = await req.json();
    if (!applicationId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      application: updated,
    });
  } catch (error: any) {
    console.error("Recruitment update status error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
