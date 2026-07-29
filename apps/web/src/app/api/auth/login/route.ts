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

    const token = signToken({ id: user.id, email: user.email, role: user.role });

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

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
