import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// GET: list or seed attendance records
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

    // Fetch active enrollments
    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } },
        attendances: {
          where: { date: "Today" }
        }
      },
    });

    // Populate missing attendance records for "Today" persistently in DB
    const records = await Promise.all(
      enrollments.map(async (e, idx) => {
        let att = e.attendances[0];
        if (!att) {
          att = await prisma.attendance.create({
            data: {
              enrollmentId: e.id,
              status: idx % 2 === 0 ? "Present" : "Absent",
              date: "Today",
            }
          });
        }
        return {
          id: att.id, // We return the attendance record ID so we can PATCH it directly!
          enrollmentId: e.id,
          name: e.user.name,
          course: e.course.title,
          status: att.status,
          date: att.date,
        };
      })
    );

    return NextResponse.json({
      success: true,
      records,
    });
  } catch (error: any) {
    console.error("Employee attendance API error:", error);
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}

// PATCH: toggle attendance status in DB
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

    // Look for attendance record by enrollmentId or direct attendance record ID
    let att = await prisma.attendance.findFirst({
      where: {
        OR: [
          { id: enrollmentId },
          { enrollmentId: enrollmentId, date: "Today" }
        ]
      }
    });

    if (att) {
      att = await prisma.attendance.update({
        where: { id: att.id },
        data: { status }
      });
    } else {
      // Create new one if not exists
      att = await prisma.attendance.create({
        data: {
          enrollmentId,
          status,
          date: "Today"
        }
      });
    }

    return NextResponse.json({
      success: true,
      enrollmentId: att.enrollmentId,
      status: att.status,
    });
  } catch (error: any) {
    console.error("Employee attendance PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}
