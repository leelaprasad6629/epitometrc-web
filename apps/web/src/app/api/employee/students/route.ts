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

    if (!user || (user.role !== "Employee" && user.role !== "Admin" && user.role !== "Employer" && user.role !== "Organization" && user.role !== "Intern")) {
      return NextResponse.json({ error: "Access Forbidden" }, { status: 403 });
    }

    // Fetch all users with role Student, including their enrollments and profiles
    const studentsList = await prisma.user.findMany({
      where: { role: "Student" },
      include: {
        profile: {
          select: {
            profile: true,
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
          orderBy: { progress: "desc" },
          take: 1,
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({
      success: true,
      students: studentsList.map((s) => {
        const topEnrollment = s.enrollments[0];
        const DEFAULT_AVATAR = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBmaWxsPSIjRTJFOEYwIiBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMCAxMCAxMCAxMCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCA0YzEuOTMgMCAzLjUgMS41NyAzLjUgMy41UzEzLjkzIDEzIDEyIDEzcy0zLjUtMS41Ny0zLjUtMy41UzEwLjA3IDYgMTIgNnptMCAxNGMtMi4wMyAwLTQuNDMtMS01LjQ2LTIuNThDNy41NiAxNS44NCAxMC4wOSAxNSAxMiAxNXM0LjQ0Ljg0IDUuNDYgMi40MkMxNi40MyAxOSAxNC4wMyAyMCAxMiAyMHoiLz48L3N2Zz4=";
        const extraProfile = (s.profile as any)?.profile || {};
        const rawAvatar = extraProfile.profileImage || "";
        const avatar = (rawAvatar && rawAvatar.includes("unsplash.com")) ? DEFAULT_AVATAR : (rawAvatar || DEFAULT_AVATAR);
        
        return {
          id: topEnrollment?.id || `no-enrollment-${s.id}`,
          userId: s.id,
          name: s.name,
          course: topEnrollment?.course?.title || "No Enrolled Courses",
          progress: topEnrollment?.progress || 0,
          email: s.email,
          avatar,
        };
      }),
    });
  } catch (error: any) {
    console.error("Employee students API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
