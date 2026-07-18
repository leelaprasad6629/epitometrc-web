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

    // Verify role is Admin
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { role: true },
    });

    if (!user || user.role !== "Admin") {
      return NextResponse.json({ error: "Access Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const courses = await prisma.course.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { category: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { title: "asc" },
    });

    return NextResponse.json({
      success: true,
      courses: courses.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        enrollment: c._count.enrollments,
        status: "Published",
      })),
    });
  } catch (error: any) {
    console.error("Admin courses GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string; role?: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify role is Admin
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { role: true },
    });

    if (!user || user.role !== "Admin") {
      return NextResponse.json({ error: "Access Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }

    await prisma.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin course DELETE error:", error);
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

    // Verify role is Admin
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { role: true },
    });

    if (!user || user.role !== "Admin") {
      return NextResponse.json({ error: "Access Forbidden" }, { status: 403 });
    }

    const { title, category, description, duration, modules } = await req.json();
    if (!title || !category) {
      return NextResponse.json({ error: "Missing required fields: title or category" }, { status: 400 });
    }

    const newCourse = await prisma.course.create({
      data: {
        title,
        category,
        description: description || "Curriculum syllabus training program.",
        duration: duration || "12 Weeks",
        modules: modules ? parseInt(modules) : 8,
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
      },
    });

    return NextResponse.json({
      success: true,
      course: {
        id: newCourse.id,
        title: newCourse.title,
        category: newCourse.category,
        enrollment: 0,
        status: "Published",
      },
    });
  } catch (error: any) {
    console.error("Admin courses POST error:", error);
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}
