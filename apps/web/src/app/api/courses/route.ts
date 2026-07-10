import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    let userId = "";

    if (token) {
      const payload = verifyToken(token) as { id: string } | null;
      if (payload) {
        userId = payload.id;
      }
    }

    const courses = await prisma.course.findMany({
      include: {
        enrollments: userId ? { where: { userId } } : false,
      },
    });

    // Format output to add joined flag and progress
    const formatted = courses.map((c: any) => {
      const enrollment = c.enrollments?.[0];
      return {
        id: c.id,
        title: c.title,
        category: c.category,
        description: c.description,
        duration: c.duration,
        modules: c.modules,
        image: c.image,
        enrolled: !!enrollment,
        progress: enrollment ? enrollment.progress : 0,
      };
    });

    return NextResponse.json({ success: true, courses: formatted });
  } catch (error: any) {
    console.error("Courses fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();
    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findFirst({
      where: {
        userId: payload.id,
        courseId,
      },
    });

    if (existing) {
      return NextResponse.json({ success: true, enrollment: existing });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: payload.id,
        courseId,
        progress: 0,
      },
    });

    return NextResponse.json({ success: true, enrollment });
  } catch (error: any) {
    console.error("Enrollment error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
