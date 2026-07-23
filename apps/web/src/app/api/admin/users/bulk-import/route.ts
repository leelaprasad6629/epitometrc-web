import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string; role?: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify role is Admin
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: { role: true },
    });

    if (!user || user.role !== "Admin") {
      return NextResponse.json({ error: "Access Forbidden" }, { status: 403 });
    }

    const { role, users } = await req.json();
    if (!role || !users || !Array.isArray(users)) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const bcrypt = require("bcryptjs");
    let importedCount = 0;

    // Process all users in sequence (safely skipping duplicates)
    for (const record of users) {
      if (!record.email || !record.name) continue;

      const existing = await prisma.user.findUnique({
        where: { email: record.email }
      });

      if (existing) continue; // Skip duplicates based on email

      // Generate default secure password hash
      const defaultPassword = "ChangeMe123!";
      const passwordHash = await bcrypt.hash(defaultPassword, 10);

      await prisma.user.create({
        data: {
          name: record.name,
          email: record.email,
          contactNumber: record.contactNumber || null,
          passwordHash,
          role, // e.g. "Student" or "Employee"
          status: "Active"
        }
      });

      importedCount++;
    }

    return NextResponse.json({
      success: true,
      importedCount
    });
  } catch (error: any) {
    console.error("Bulk Import POST error:", error);
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
  }
}
