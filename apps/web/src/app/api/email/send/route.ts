import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

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

    // Verify role is Employee or Admin
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { role: true },
    });

    if (!user || (user.role !== "Employee" && user.role !== "Admin" && user.role !== "Employer" && user.role !== "Organization")) {
      return NextResponse.json({ error: "Access Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { to, subject, emailBody } = body;

    if (!to || !subject || !emailBody) {
      return NextResponse.json({ error: "Missing required parameters (to, subject, emailBody)." }, { status: 400 });
    }

    const result = await sendEmail({
      to,
      subject,
      text: emailBody,
    });

    return NextResponse.json({
      success: true,
      delivered: result.delivered,
      message: result.message,
      messageId: (result as any).messageId || null,
    });
  } catch (error: any) {
    console.error("Send email API error:", error);
    return NextResponse.json({ error: "Failed to dispatch email: " + error.message }, { status: 500 });
  }
}
