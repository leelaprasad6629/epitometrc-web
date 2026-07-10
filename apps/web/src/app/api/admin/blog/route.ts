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

    return NextResponse.json({
      success: true,
      posts: [
        { id: 1, title: "Scaling Next.js Micro-Frontends in 2026", category: "Technology", author: "Sarah Jennings", status: "Published" },
      ],
    });
  } catch (error: any) {
    console.error("Admin blog GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  return NextResponse.json({ success: true });
}
