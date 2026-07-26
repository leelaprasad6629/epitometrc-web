import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { title, type, url } = await req.json();

    if (!title || !type || !url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const material = await prisma.cohortMaterial.create({
      data: {
        courseId: id,
        title,
        type,
        url,
      },
    });

    return NextResponse.json({
      success: true,
      material,
    });
  } catch (error: any) {
    console.error("Create material error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
