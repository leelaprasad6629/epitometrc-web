import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role, contactNumber } = await req.json();

    if (!name || !email || !password || !contactNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const userRole = role || "Student";

    if (userRole === "Admin") {
      return NextResponse.json({ error: "Administrator accounts must be pre-authorized and cannot be registered publicly." }, { status: 403 });
    }

    if (userRole === "Employee") {
      if (!email.toLowerCase().endsWith("@epitometrc.com")) {
        return NextResponse.json({ error: "Employee accounts must use an official @epitometrc.com email address." }, { status: 400 });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: userRole,
      },
    });

    return NextResponse.json({
      success: true,
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
