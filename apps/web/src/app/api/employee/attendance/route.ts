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

    if (!user || (user.role !== "Employee" && user.role !== "Admin")) {
      return NextResponse.json({ error: "Access Forbidden" }, { status: 403 });
    }

    // Fetch active enrollments
    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } },
      },
    });

    return NextResponse.json({
      success: true,
      records: enrollments.map((e, idx) => ({
        id: e.id,
        name: e.user.name,
        course: e.course.title,
        status: idx % 2 === 0 ? "Present" : "Absent", // Simulate initial distribution
        date: "Today",
      })),
    });
  } catch (error: any) {
    console.error("Employee attendance API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

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

    const { enrollmentId, status } = await req.json();
    if (!enrollmentId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Attendance toggling logic (simulated response since schema does not store attendance records)
    return NextResponse.json({
      success: true,
      enrollmentId,
      status,
    });
  } catch (error: any) {
    console.error("Employee attendance PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
