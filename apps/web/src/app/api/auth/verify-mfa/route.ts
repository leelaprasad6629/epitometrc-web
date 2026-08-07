import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { mfaToken, code } = await req.json();

    if (!mfaToken || !code) {
      return NextResponse.json({ error: "Missing verification parameters" }, { status: 400 });
    }

    const payload = verifyToken(mfaToken) as { 
      id: string; 
      email: string; 
      purpose: string; 
      codeHash: string; 
    } | null;

    if (!payload || payload.purpose !== "mfa-verification" || !payload.id || !payload.codeHash) {
      return NextResponse.json({ error: "MFA session has expired or is invalid. Please try logging in again." }, { status: 400 });
    }

    const match = await bcrypt.compare(code, payload.codeHash);
    if (!match) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    if (user.status !== "Active") {
      return NextResponse.json({ error: "Your account is currently inactive." }, { status: 403 });
    }

    // Sign the final authenticated session token
    const token = signToken({ 
      id: user.id, 
      email: user.email, 
      role: user.role,
      tokenVersion: user.tokenVersion
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Set final session cookie with SameSite protection
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("MFA verify error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
