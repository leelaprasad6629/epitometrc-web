import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: candidateId } = await params;
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

    // Fetch candidate details
    const candidate = await prisma.user.findUnique({
      where: { id: candidateId },
      select: {
        id: true,
        name: true,
        email: true,
        contactNumber: true,
        createdAt: true,
        profile: {
          select: {
            profile: true,
            confidenceScores: true,
          },
        },
        enrollments: {
          include: {
            course: {
              select: {
                title: true,
              },
            },
          },
        },
        applications: {
          include: {
            job: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    if (!candidate) {
      return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      candidate: {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.contactNumber || "N/A",
        joinedDate: new Date(candidate.createdAt).toLocaleDateString(),
        resumeDetails: (candidate.profile as any)?.profile || null,
        confidenceScores: (candidate.profile as any)?.confidenceScores || null,
        enrollments: candidate.enrollments.map((enr) => ({
          id: enr.id,
          courseName: enr.course.title,
          progress: enr.progress,
        })),
        applications: candidate.applications.map((app) => ({
          id: app.id,
          jobTitle: app.job.title,
          status: app.status,
          appliedAt: new Date(app.appliedAt).toLocaleDateString(),
        })),
      },
    });
  } catch (error: any) {
    console.error("Candidate detail API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
