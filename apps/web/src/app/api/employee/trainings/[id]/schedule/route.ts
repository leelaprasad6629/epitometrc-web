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
    const { title, date, time, link } = await req.json();

    if (!title || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const schedule = await prisma.cohortSchedule.create({
      data: {
        courseId: id,
        title,
        date,
        time,
        link: link || null,
      },
    });

    return NextResponse.json({
      success: true,
      schedule,
    });
  } catch (error: any) {
    console.error("Create schedule error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
