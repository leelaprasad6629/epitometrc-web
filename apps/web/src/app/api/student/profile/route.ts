import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

function getUserIdFromRequest(req: NextRequest): string | null {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  const payload = verifyToken(token) as { id: string } | null;
  return payload?.id || null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const profileRecord = await prisma.userProfile.findUnique({
      where: { userId },
      select: {
        profile: true,
        confidenceScores: true
      }
    });

    return NextResponse.json({
      success: true,
      profile: profileRecord?.profile || null,
      confidenceScores: profileRecord?.confidenceScores || {}
    });
  } catch (err) {
    console.error("Failed to read profile:", err);
    return NextResponse.json({ success: false, error: "Failed to load profile data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { profile, confidenceScores } = await req.json();

    await prisma.userProfile.upsert({
      where: { userId },
      update: {
        profile: profile || null,
        confidenceScores: confidenceScores || {}
      },
      create: {
        userId,
        profile: profile || null,
        confidenceScores: confidenceScores || {}
      }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to save profile:", err);
    return NextResponse.json({ success: false, error: "Failed to save profile data." }, { status: 500 });
  }
}
