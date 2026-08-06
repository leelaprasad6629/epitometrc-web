import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const category = searchParams.get("category") || "All";
    const level = searchParams.get("level") || "All";
    const sortBy = searchParams.get("sortBy") || "popular";

    const token = req.cookies.get("token")?.value;
    let userId = "";

    if (token) {
      const payload = verifyToken(token) as { id: string } | null;
      if (payload) {
        userId = payload.id;
      }
    }

    const where: any = {};

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
      ];
    }

    if (category !== "All") {
      where.category = { equals: category, mode: "insensitive" };
    }

    if (level !== "All") {
      where.level = { equals: level, mode: "insensitive" };
    }

    let orderBy: any = { enrolledCount: "desc" };
    if (sortBy === "newest") {
      orderBy = { id: "desc" };
    } else if (sortBy === "rating") {
      orderBy = { rating: "desc" };
    } else if (sortBy === "alphabetical") {
      orderBy = { title: "asc" };
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy,
      include: {
        enrollments: userId
          ? {
              where: { userId },
            }
          : false,
      },
    });

    const formatted = courses.map((c: any) => {
      const enrollment = c.enrollments?.[0];
      return {
        id: c.id,
        title: c.title,
        subtitle: c.subtitle || "Master essential industry competencies through hands-on learning.",
        slug: c.slug || c.id,
        category: c.category,
        description: c.description,
        duration: c.duration,
        modules: c.modules,
        image: c.image,
        level: c.level || "Intermediate",
        language: c.language || "English",
        price: c.price || "Free",
        rating: c.rating || 4.8,
        reviewsCount: c.reviewsCount || 128,
        enrolledCount: c.enrolledCount || 1450,
        learningObjectives: c.learningObjectives || [
          "Build production-grade systems following clean architecture",
          "Apply industry best practices and design patterns",
          "Deploy & scale real-world applications with automated CI/CD"
        ],
        skillsCovered: c.skillsCovered || ["Software Architecture", "Agile Execution", "Clean Code"],
        instructorName: c.instructorName || "Dr. Rajesh Verma",
        instructorRole: c.instructorRole || "Principal Architect & Lead Instructor",
        instructorAvatar: c.instructorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        enrolled: !!enrollment,
        progress: enrollment ? enrollment.progress : 0,
        completedAt: enrollment?.completedAt ? enrollment.completedAt.toISOString() : null,
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

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { role: true },
    });

    if (!user || (user.role !== "Admin" && user.role !== "Instructor" && user.role !== "Employee")) {
      return NextResponse.json({ error: "Access Denied: Only Instructors and Admins can create courses." }, { status: 403 });
    }

    const body = await req.json();
    const { title, category, description, duration, modules, image, level, price, subtitle } = body;

    if (!title || !category || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const newCourse = await prisma.course.create({
      data: {
        title,
        subtitle: subtitle || "Master essential industry competencies through hands-on learning.",
        slug,
        category,
        description,
        duration: duration || "8 Weeks",
        modules: Number(modules) || 8,
        image: image || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
        level: level || "Intermediate",
        price: price || "Free",
      },
    });

    return NextResponse.json({ success: true, course: newCourse });
  } catch (error: any) {
    console.error("Course creation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
