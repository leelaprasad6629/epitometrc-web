import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthorizedUser } from "@/lib/jwt";
import { logAuditAction } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthorizedUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Increment tokenVersion in database to invalidate all active session tokens
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        tokenVersion: { increment: 1 }
      }
    });

    // Write audit log
    await logAuditAction(
      user.id,
      user.email,
      "DEVICE_LOGOUT",
      { userId: user.id, email: user.email, newTokenVersion: updatedUser.tokenVersion },
      req.headers.get("x-forwarded-for")
    );

    const response = NextResponse.json({
      success: true,
      message: "Successfully logged out of all other devices."
    });

    // Clear session token on the current device
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Device logout error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
