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

    if (!user || (user.role !== "Employee" && user.role !== "Admin" && user.role !== "Employer" && user.role !== "Organization")) {
      return NextResponse.json({ error: "Access Forbidden" }, { status: 403 });
    }

    // Fetch all courses
    const courses = await prisma.course.findMany({
      include: {
        enrollments: {
          select: { progress: true }
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    const batches = courses.map((course) => {
      // Dynamic client name based on course category
      const client = `${course.category.charAt(0).toUpperCase() + course.category.slice(1)} Enterprise Partners`;
      
      // Dynamic start and end dates based on current date
      const start = new Date(Date.now() - 1000 * 60 * 60 * 24 * 15); // 15 days ago
      const end = new Date(Date.now() + 1000 * 60 * 60 * 24 * 45); // 45 days from now

      // Dynamic status based on student enrollments progress
      const totalEnrollments = course.enrollments.length;
      const completedCount = course.enrollments.filter(e => e.progress === 100).length;
      const status = totalEnrollments > 0 && completedCount === totalEnrollments ? "Completed" : "In Progress";

      return {
        id: course.id,
        title: course.title,
        client,
        startDate: start.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        endDate: end.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        studentsCount: course._count.enrollments,
        status,
      };
    });

    return NextResponse.json({
      success: true,
      batches,
    });
  } catch (error: any) {
    console.error("Employee trainings API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string; role?: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, category, description, duration, modules, image } = await req.json();

    if (!title || !category || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        title,
        category,
        description,
        duration: duration || "8 Weeks",
        modules: Number(modules) || 6,
        image: image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80",
      },
    });

    return NextResponse.json({
      success: true,
      course,
    });
  } catch (error: any) {
    console.error("Create course error:", error);
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}
