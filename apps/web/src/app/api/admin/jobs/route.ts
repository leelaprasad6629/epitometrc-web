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

    const jobs = await prisma.job.findMany({
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { location: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      include: {
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { title: "asc" },
    });

    return NextResponse.json({
      success: true,
      jobs: jobs.map((j) => ({
        id: j.id,
        title: j.title,
        location: j.location,
        applicants: j._count.applications,
        status: j.status,
      })),
    });
  } catch (error: any) {
    console.error("Admin jobs GET error:", error);
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
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    await prisma.job.delete({
      where: { id: jobId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin job DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
