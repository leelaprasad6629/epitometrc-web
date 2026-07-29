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

    if (userRole !== "Student") {
      return NextResponse.json({ error: "Access Denied: Public registration is restricted to Student accounts." }, { status: 400 });
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
          role: "Student",
          status: "Active",
          requirePasswordChange: false,
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
