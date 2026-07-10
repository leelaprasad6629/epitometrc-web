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

    const jobs = await prisma.job.findMany({
      include: {
        applications: userId ? { where: { userId } } : false,
      },
    });

    const formatted = jobs.map((j: any) => {
      const app = j.applications?.[0];
      return {
        id: j.id,
        title: j.title,
        category: j.category,
        location: j.location,
        type: j.type,
        description: j.description,
        applied: !!app,
        appStatus: app ? app.status : null,
      };
    });

    return NextResponse.json({ success: true, jobs: formatted });
  } catch (error: any) {
    console.error("Jobs fetch error:", error);
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

    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ error: "Missing jobId" }, { status: 400 });
    }

    const existing = await prisma.application.findFirst({
      where: {
        userId: payload.id,
        jobId,
      },
    });

    if (existing) {
      return NextResponse.json({ success: true, application: existing });
    }

    const application = await prisma.application.create({
      data: {
        userId: payload.id,
        jobId,
        status: "Reviewing",
      },
    });

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error("Application error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
