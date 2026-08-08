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

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { role: true },
    });

    if (!user || user.role !== "Student") {
      return NextResponse.json({ error: "Access Denied: Only students can apply for jobs." }, { status: 403 });
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

    // Notify recruitment team
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: { name: true, email: true }
      });
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        select: { title: true }
      });

      if (user && job) {
        const { sendEmail } = await import("@/lib/email");
        await sendEmail({
          to: "careers@epitometrc.com",
          subject: `[Job Application] New candidate for ${job.title}`,
          text: `Candidate ${user.name} (${user.email}) has applied for the job: ${job.title}.\n\nPlease review their application on the recruitment dashboard.`,
          html: `
            <h3>New Job Application Received</h3>
            <p><strong>Job Title:</strong> ${job.title}</p>
            <p><strong>Candidate Name:</strong> ${user.name}</p>
            <p><strong>Candidate Email:</strong> ${user.email}</p>
            <p>Please log in to the employee dashboard to review their details.</p>
            <hr/>
            <p style="color: #64748b; font-size: 12px;">Epitome Recruitment Portal</p>
          `
        });
      }
    } catch (notifyErr) {
      console.warn("Application notification failed:", notifyErr);
    }

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error("Application error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
