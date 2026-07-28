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
            profile: {
              select: {
                profile: true,
              },
            },
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
      applicants: applications.map((app) => {
        const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBmaWxsPSIjRTJFOEYwIiBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMCAxMCAxMCAxMCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCA0YzEu5MgMCAzLjUgMS41NyAzLjUgMy41UzEzLjkzIDEzIDEyIDEzcy0zLjUtMS41Ny0zLjUtMy41UzEwLjA3IDYgMTIgNnptMCAxNGMtMi4wMyAwLTQuNDMtMS01LjQ2LTIuNThDNy41NiAxNS44NCAxMC4wOSAxNSAxMiAxNXM0LjQ0Ljg0IDUuNDYgMi40MkMxNi40MyAxOSAxNC4wMyAyMCAxMiAyMHoiLz48L3N2Zz4=";
        const extraProfile = (app.user.profile as any)?.profile || {};
        const atsAnalysis = extraProfile.atsAnalysis || {};
        const matchScore = atsAnalysis.matchScore ? `${atsAnalysis.matchScore}%` : "Pending Eval";
        const avatar = extraProfile.profileImage || DEFAULT_AVATAR;
        
        return {
          id: app.id,
          userId: app.userId,
          name: app.user.name,
          email: app.user.email,
          role: app.job.title,
          status: app.status,
          appliedDate: new Date(app.appliedAt).toLocaleDateString(),
          matchScore,
          avatar,
        };
      }),
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
