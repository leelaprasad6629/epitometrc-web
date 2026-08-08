import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { logAuditAction } from "@/lib/audit";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (token) {
      const payload = verifyToken(token) as { id: string; email: string } | null;
      if (payload) {
        try {
          // Delete active session record
          await prisma.userSession.delete({
            where: { token }
          }).catch(() => {});
          
          // Audit Log Logout
          await logAuditAction(
            payload.id,
            payload.email,
            "LOGOUT",
            { ipAddress: req.headers.get("x-forwarded-for") },
            req.headers.get("x-forwarded-for")
          );
        } catch (dbErr) {
          console.warn("DB session delete bypassed or failed:", dbErr);
        }
      }
    }

    const response = NextResponse.json({ success: true });
    
    // Clear the authentication token
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
