import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken, verifyToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Route Action 1: Request Reset Link (Forgot Password step)
    if (body.email && !body.token) {
      const { email } = body;
      const user = await prisma.user.findUnique({
        where: { email },
      });

      // Maintain security by always returning success to prevent email enumeration
      if (!user) {
        return NextResponse.json({
          success: true,
          message: "A password reset link has been sent to your email address if it exists in our system.",
        });
      }

      // Generate temporary reset token (expires in 15 minutes)
      const resetToken = signToken({ email: user.email, purpose: "password-reset" });
      const resetLink = `${req.nextUrl.origin}/reset-password?token=${resetToken}`;

      const { sendEmail } = await import("@/lib/email");
      await sendEmail({
        to: user.email,
        subject: "Reset your EpitomeTRC Password",
        text: `Hello ${user.name},\n\nYou requested a password reset. Please click the link below to set a new password:\n${resetLink}\n\nThis link will expire in 15 minutes.\n\nBest regards,\nEpitomeTRC Security Team`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #e2e8f0;border-radius:12px;">
            <h2 style="color:#0b172a;">Password Reset Request</h2>
            <p>Hello ${user.name},</p>
            <p>We received a request to reset the password for your EpitomeTRC account. Click the button below to choose a new password:</p>
            <div style="margin:24px 0;">
              <a href="${resetLink}" style="background-color:#f97316;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:bold;font-size:14px;">Reset Password</a>
            </div>
            <p style="color:#64748b;font-size:12px;">Or copy this link into your browser:<br/><a href="${resetLink}" style="color:#f97316;">${resetLink}</a></p>
            <p style="color:#64748b;font-size:12px;margin-top:20px;border-top:1px solid #e2e8f0;padding-top:20px;">This link will expire in 15 minutes. If you did not request a password reset, you can safely ignore this email.</p>
          </div>
        `
      });

      return NextResponse.json({
        success: true,
        message: "A password reset link has been sent to your email address.",
      });
    }

    // Route Action 2: Reset Password execution (Reset Password page step)
    if (body.token && body.password) {
      const { token, password } = body;

      const payload = verifyToken(token) as { email: string; purpose: string } | null;
      if (!payload || payload.purpose !== "password-reset" || !payload.email) {
        return NextResponse.json({ error: "The password reset token is invalid or has expired. Please request a new one." }, { status: 400 });
      }

      // Strong password validation
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!strongPasswordRegex.test(password)) {
        return NextResponse.json({ error: "Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, one number, and one special character." }, { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (!user) {
        return NextResponse.json({ error: "User account not found." }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      // Save password and increment tokenVersion to log out of all other devices
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          tokenVersion: { increment: 1 }
        },
      });

      return NextResponse.json({
        success: true,
        message: "Your password has been successfully updated. You can now log in with your new credentials.",
      });
    }

    return NextResponse.json({ error: "Invalid parameters provided" }, { status: 400 });
  } catch (error: any) {
    console.error("Reset password API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
