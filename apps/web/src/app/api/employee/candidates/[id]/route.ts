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

    const extraProfile = (candidate.profile as any)?.profile || {};
    const recruiterNotes = extraProfile.recruiterNotes || [];
    const reviewStatus = extraProfile.reviewStatus || "Pending";

    return NextResponse.json({
      success: true,
      candidate: {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.contactNumber || "N/A",
        joinedDate: new Date(candidate.createdAt).toLocaleDateString(),
        resumeDetails: extraProfile,
        confidenceScores: (candidate.profile as any)?.confidenceScores || null,
        recruiterNotes,
        reviewStatus,
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

// PATCH: append notes or update advisor review status on candidate profile JSON
export async function PATCH(
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
      select: { role: true, name: true },
    });

    if (!user || (user.role !== "Employee" && user.role !== "Admin" && user.role !== "Employer" && user.role !== "Organization")) {
      return NextResponse.json({ error: "Access Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { note, reviewStatus } = body;

    // Fetch existing profile
    const existing = await prisma.userProfile.findUnique({
      where: { userId: candidateId },
      select: { profile: true },
    });

    const extraProfile = (existing?.profile as any) || {};
    const notesArray = extraProfile.recruiterNotes || [];

    if (note) {
      notesArray.push({
        text: note,
        date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        author: user.name || "Placement Advisor",
      });
    }

    await prisma.userProfile.upsert({
      where: { userId: candidateId },
      update: {
        profile: {
          ...extraProfile,
          recruiterNotes: notesArray,
          reviewStatus: reviewStatus !== undefined ? reviewStatus : extraProfile.reviewStatus,
        },
      },
      create: {
        userId: candidateId,
        profile: {
          recruiterNotes: notesArray,
          reviewStatus: reviewStatus || "Pending",
        },
      },
    });

    return NextResponse.json({
      success: true,
      recruiterNotes: notesArray,
      reviewStatus: reviewStatus || extraProfile.reviewStatus,
    });
  } catch (error: any) {
    console.error("Candidate PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}
