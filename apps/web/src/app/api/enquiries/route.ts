import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
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
