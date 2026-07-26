import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    if (isRateLimited(req, 3, 60000)) {
      return NextResponse.json({ error: "Too many enquiries. Please try again in 1 minute." }, { status: 429 });
    }

    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        subject,
        message,
        status: "Pending",
      },
    });

    return NextResponse.json({ success: true, enquiry });
  } catch (error: any) {
    console.error("Enquiry save error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
