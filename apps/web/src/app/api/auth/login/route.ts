import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import { isRateLimited } from "@/lib/rateLimit";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    if (isRateLimited(req, 10, 60000)) {
      return NextResponse.json({ error: "Too many login attempts. Please try again in 1 minute." }, { status: 429 });
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    if (user.status !== "Active") {
      return NextResponse.json({ error: "Access Denied: Your account is currently inactive. Please contact an administrator." }, { status: 403 });
    }

    // Domain validation: Employee/Admin and other staff accounts must use @epitometrc.com
    if (user.role !== "Student") {
      if (!email.toLowerCase().endsWith("@epitometrc.com")) {
        return NextResponse.json({ error: "Access Denied: Official staff accounts must use a verified @epitometrc.com email address." }, { status: 403 });
      }
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    if (user.role === "Admin") {
      // Generate a 6-digit verification code
      const mfaCode = Math.floor(100000 + Math.random() * 900000).toString();
      const codeHash = await bcrypt.hash(mfaCode, 8);
      
      // Sign a temporary token valid for 5 minutes
      const mfaToken = signToken({ 
        id: user.id, 
        email: user.email, 
        purpose: "mfa-verification", 
        codeHash 
      });

      const { sendEmail } = await import("@/lib/email");
      await sendEmail({
        to: user.email,
        subject: "EpitomeTRC Secure Login - MFA Verification Code",
        text: `Hello ${user.name},\n\nYour 6-digit secure login verification code is: ${mfaCode}\n\nThis code will expire in 5 minutes.\n\nBest regards,\nEpitomeTRC Security Team`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:12px;">
            <h2 style="color:#0b172a;">Secure Login MFA Request</h2>
            <p>Hello ${user.name},</p>
            <p>A login request to your EpitomeTRC Admin account was initiated. Please verify your identity using the verification code below:</p>
            <div style="margin:24px 0;text-align:center;">
              <span style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#f97316;background-color:#f8fafc;padding:12px 24px;border:1px solid #cbd5e1;border-radius:8px;display:inline-block;">${mfaCode}</span>
            </div>
            <p style="color:#64748b;font-size:12px;">This code is valid for exactly 5 minutes. If you did not request this login, please change your password immediately.</p>
          </div>
        `
      });

      return NextResponse.json({
        success: true,
        requireMFA: true,
        mfaToken,
      });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role, tokenVersion: user.tokenVersion });

    const response = NextResponse.json({
      success: true,
      token,
      requirePasswordChange: user.requirePasswordChange,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set secure cookie with CSRF sameSite protection
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
