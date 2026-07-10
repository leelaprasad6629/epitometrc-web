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
      select: { role: true, email: true },
    });

    if (!user || user.role !== "Admin") {
      return NextResponse.json({ error: "Access Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      settings: {
        siteName: "EpitomeTRC",
        adminEmail: user.email,
        maintenance: false,
      },
    });
  } catch (error: any) {
    console.error("Admin settings GET error:", error);
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

    const { siteName, adminEmail, maintenance } = await req.json();

    return NextResponse.json({
      success: true,
      siteName,
      adminEmail,
      maintenance,
    });
  } catch (error: any) {
    console.error("Admin settings PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
