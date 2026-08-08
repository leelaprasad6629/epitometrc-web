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

    // 1. CRM Tracking (Create client and interaction entry)
    try {
      let client = await prisma.cRMClient.findFirst({
        where: { email: email }
      });

      if (!client) {
        client = await prisma.cRMClient.create({
          data: {
            name: name,
            email: email,
            company: "Inquirer (Not Specified)",
            status: "Lead",
            health: "Active",
            summary: `Initial enquiry submitted: ${subject}`
          }
        });
      }

      await prisma.cRMInteraction.create({
        data: {
          clientId: client.id,
          date: new Date().toISOString().split("T")[0],
          type: "Email",
          description: `Contact Form Submission: [${subject}] - ${message}`,
          participant: name
        }
      });
    } catch (crmErr) {
      console.warn("CRM lead logging failed:", crmErr);
    }

    // 2. Email Dispatching (Send to company & Send confirmation to client)
    try {
      const { sendEmail } = await import("@/lib/email");

      // Notify company
      await sendEmail({
        to: "careers@epitometrc.com",
        subject: `[New Lead] Contact Form: ${subject}`,
        text: `You have received a new contact inquiry from ${name} (${email}).\n\nSubject: ${subject}\nMessage:\n${message}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-line; background-color: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">${message}</p>
        `
      });

      // Confirm to customer
      await sendEmail({
        to: email,
        subject: `We received your inquiry: ${subject}`,
        text: `Dear ${name},\n\nThank you for reaching out to EpitomeTRC. We have received your message regarding "${subject}" and our team will get back to you as soon as possible.\n\nBest Regards,\nEpitomeTRC Team`,
        html: `
          <h3>Thank you for reaching out to EpitomeTRC</h3>
          <p>Dear ${name},</p>
          <p>We have received your message regarding <strong>"${subject}"</strong>. Our team is reviewing your inquiry and will get back to you as soon as possible.</p>
          <p>Here is a copy of your message details:</p>
          <p style="white-space: pre-line; background-color: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px;">${message}</p>
          <hr/>
          <p style="color: #64748b; font-size: 12px;">This is an automated confirmation email. Please do not reply directly to this message.</p>
        `
      });
    } catch (emailErr) {
      console.warn("Contact form email dispatch failed:", emailErr);
    }

    return NextResponse.json({ success: true, enquiry });
  } catch (error: any) {
    console.error("Enquiry save error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
