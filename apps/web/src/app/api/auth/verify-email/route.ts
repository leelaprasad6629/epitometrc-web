import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/login?error=Invalid+or+missing+verification+token.", req.url));
    }

    const payload = verifyToken(token) as { id: string; email: string; purpose: string } | null;
    
    if (!payload || payload.purpose !== "email-verification" || !payload.id) {
      return NextResponse.redirect(new URL("/login?error=Verification+token+has+expired+or+is+invalid.", req.url));
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      return NextResponse.redirect(new URL("/login?error=User+not+found.", req.url));
    }

    if (user.status === "Active") {
      return NextResponse.redirect(new URL("/login?verified=already", req.url));
    }

    // Update status to Active
    await prisma.user.update({
      where: { id: user.id },
      data: { status: "Active" },
    });

    return NextResponse.redirect(new URL("/login?verified=true", req.url));
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.redirect(new URL("/login?error=An+unexpected+error+occurred+during+verification.", req.url));
  }
}
