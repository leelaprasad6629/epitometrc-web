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

    if (userRole !== "Student" && userRole !== "Employee" && userRole !== "Intern") {
      return NextResponse.json({ error: "Access Denied: Invalid registration role." }, { status: 400 });
    }

    if ((userRole === "Employee" || userRole === "Intern") && !email.toLowerCase().endsWith("@epitometrc.com")) {
      return NextResponse.json({ error: "Access Denied: Employee/Intern registration is restricted to official @epitometrc.com accounts." }, { status: 400 });
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
          status: "Active",
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
