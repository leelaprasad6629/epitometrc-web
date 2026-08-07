import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rateLimit";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    if (isRateLimited(req, 5, 60000)) {
      return NextResponse.json({ error: "Too many registration attempts. Please try again in 1 minute." }, { status: 429 });
    }

    const { name, email, password, role, contactNumber, policyAccepted } = await req.json();

    if (!name || !email || !password || !contactNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (policyAccepted !== true) {
      return NextResponse.json({ error: "You must read and agree to the Terms & Conditions and Privacy Policy to create an account." }, { status: 400 });
    }

    const userRole = role || "Student";

    // Restriction: Employee/Admin accounts cannot be registered publicly
    if (userRole !== "Student") {
      return NextResponse.json({ error: "Access Denied: Registration for Employee, Intern, or Admin accounts must be created directly by an administrator." }, { status: 403 });
    }

    // Strong password validation
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return NextResponse.json({ error: "Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: userRole,
          status: "PendingVerification", // Require verification before first login
          requirePasswordChange: false,
          policyAccepted: true,
          policyAcceptedAt: new Date(),
          policyVersion: "v1.0",
        },
      });

      await tx.userProfile.create({
        data: {
          userId: u.id,
          profile: {
            name: u.name,
            email: u.email,
            contactNumber: contactNumber || null,
            skills: [],
            experience: [],
            education: [],
            projects: [],
          },
          confidenceScores: {},
        },
      });

      return u;
    });

    // Sign verification token (expires in 24 hours)
    const verificationToken = signToken({ id: user.id, email: user.email, purpose: "email-verification" });
    const verificationLink = `${req.nextUrl.origin}/api/auth/verify-email?token=${verificationToken}`;

    const { sendEmail } = await import("@/lib/email");
    await sendEmail({
      to: user.email,
      subject: "Verify your EpitomeTRC Account",
      text: `Hello ${user.name},\n\nPlease verify your EpitomeTRC account by clicking the following link:\n${verificationLink}\n\nThis link will expire in 24 hours.\n\nBest regards,\nEpitomeTRC Registration Team`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:12px;">
          <h2 style="color:#0b172a;">Welcome to EpitomeTRC!</h2>
          <p>Hello ${user.name},</p>
          <p>Thank you for registering on our platform. Please verify your account by clicking the link below:</p>
          <div style="margin:24px 0;">
            <a href="${verificationLink}" style="background-color:#f97316;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;font-size:14px;">Verify Account</a>
          </div>
          <p style="color:#64748b;font-size:12px;">Or copy this link into your browser:<br/><a href="${verificationLink}" style="color:#f97316;">${verificationLink}</a></p>
          <p style="color:#64748b;font-size:12px;margin-top:20px;border-top:1px solid #e2e8f0;padding-top:20px;">This link will expire in 24 hours. If you did not sign up for an account, please ignore this email.</p>
        </div>
      `
    });

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      message: "Verification link sent to your email. Please verify your account before logging in.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
