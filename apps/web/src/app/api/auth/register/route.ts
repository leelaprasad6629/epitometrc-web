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

    const { name, email, password, role, contactNumber } = await req.json();

    if (!name || !email || !password || !contactNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userRole = role || "Student";

    if (userRole === "Admin") {
      return NextResponse.json({ error: "Administrator accounts must be pre-authorized and cannot be registered publicly." }, { status: 403 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let user;

    if (userRole !== "Student") {
      // Domain sanity check first
      if (!email.toLowerCase().endsWith("@epitometrc.com")) {
        return NextResponse.json({ error: "Access Denied: Official staff accounts must use a verified @epitometrc.com email address." }, { status: 400 });
      }

      // Check pre-authorization in database
      if (!existingUser) {
        return NextResponse.json({ error: "Access Denied: This email has not been pre-authorized by an administrator. Staff accounts cannot self-register." }, { status: 403 });
      }

      if (existingUser.role !== userRole) {
        return NextResponse.json({ error: `Access Denied: The pre-authorized role for this email does not match ${userRole}.` }, { status: 403 });
      }

      if (existingUser.status !== "Active") {
        return NextResponse.json({ error: "Access Denied: Your pre-authorized account is currently inactive." }, { status: 403 });
      }

      // Check if already registered (we use a simple check, if they have a password hash that is not empty/placeholder)
      if (existingUser.passwordHash && existingUser.passwordHash !== "placeholder-temp-hash") {
        return NextResponse.json({ error: "Account already fully registered. Please log in directly." }, { status: 400 });
      }

      // Update password hash and register them
      const passwordHash = await bcrypt.hash(password, 10);
      user = await prisma.user.update({
        where: { email },
        data: {
          name,
          contactNumber,
          passwordHash,
          status: "Active",
        },
      });
    } else {
      // Students self-register normally
      if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: "Student",
          status: "Active",
        },
      });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return NextResponse.json({
      success: true,
      token,
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
