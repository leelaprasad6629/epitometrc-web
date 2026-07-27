import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import crypto from "crypto";

const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || "epitome-secret-salt-2026";

function generateSignature(enrollmentId: string, date: string, status: string) {
  return crypto
    .createHmac("sha256", SECRET)
    .update(`${enrollmentId}:${date}:${status}`)
    .digest("hex")
    .substring(0, 10);
}

function verifyStatus(enrollmentId: string, date: string, signedStatus: string) {
  if (!signedStatus.includes(":SIG_")) {
    // If it's an old seeded status (like "Present" or "Absent"), sign it optimistically but mark as unverified
    return { status: signedStatus, verified: false, tampered: false };
  }
  const [status, sig] = signedStatus.split(":SIG_");
  const expectedSig = generateSignature(enrollmentId, date, status);
  if (sig === expectedSig) {
    return { status, verified: true, tampered: false };
  }
  return { status, verified: false, tampered: true };
}

// GET: list attendance records for a specific date
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

    // Support dynamic calendar date parameters (defaults to current date string)
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Fetch active enrollments
    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } },
        attendances: {
          where: { date: dateParam }
        }
      },
    });

    // Populate missing attendance records for date persistently in DB
    const records = await Promise.all(
      enrollments.map(async (e, idx) => {
        let att = e.attendances[0];
        if (!att) {
          const defaultStatus = idx % 2 === 0 ? "Present" : "Absent";
          const signature = generateSignature(e.id, dateParam, defaultStatus);
          att = await prisma.attendance.create({
            data: {
              enrollmentId: e.id,
              status: `${defaultStatus}:SIG_${signature}`,
              date: dateParam,
            }
          });
        }

        const verification = verifyStatus(e.id, dateParam, att.status);

        return {
          id: att.id,
          enrollmentId: e.id,
          name: e.user.name,
          course: e.course.title,
          status: verification.status,
          verified: verification.verified,
          tampered: verification.tampered,
          date: att.date,
        };
      })
    );

    return NextResponse.json({
      success: true,
      date: dateParam,
      records,
    });
  } catch (error: any) {
    console.error("Employee attendance API error:", error);
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}

// PATCH: toggle/update attendance status securely in DB
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

    // Verify role is Employee or Admin
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { role: true },
    });

    if (!user || (user.role !== "Employee" && user.role !== "Admin" && user.role !== "Employer" && user.role !== "Organization" && user.role !== "Intern")) {
      return NextResponse.json({ error: "Access Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { enrollmentId, status, date } = body;
    if (!enrollmentId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const targetDate = date || new Date().toISOString().split("T")[0];

    // Compute cryptographic signature to prevent direct DB editing tampering
    const signature = generateSignature(enrollmentId, targetDate, status);
    const signedStatus = `${status}:SIG_${signature}`;

    // Look for attendance record by enrollmentId or direct attendance record ID
    let att = await prisma.attendance.findFirst({
      where: {
        OR: [
          { id: enrollmentId },
          { enrollmentId: enrollmentId, date: targetDate }
        ]
      }
    });

    if (att) {
      att = await prisma.attendance.update({
        where: { id: att.id },
        data: { status: signedStatus }
      });
    } else {
      att = await prisma.attendance.create({
        data: {
          enrollmentId,
          status: signedStatus,
          date: targetDate
        }
      });
    }

    return NextResponse.json({
      success: true,
      enrollmentId: att.enrollmentId,
      status,
      date: att.date,
      verified: true,
    });
  } catch (error: any) {
    console.error("Employee attendance PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}
