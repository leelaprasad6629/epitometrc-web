import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string; role?: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user and profile details
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        name: true,
        email: true,
        contactNumber: true,
        role: true,
        profile: {
          select: {
            profile: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const extraProfile = (user.profile as any)?.profile || {};

    return NextResponse.json({
      success: true,
      profile: {
        name: user.name,
        email: user.email,
        phone: user.contactNumber || "",
        role: user.role,
        specialization: extraProfile.specialization || "General Strategy & IT Placement Advisor",
        office: extraProfile.office || "Indore HQ",
        availability: extraProfile.availability || "95%",
        availabilityStatus: extraProfile.availabilityStatus || "Fully Active",
        verifiedStatus: extraProfile.verifiedStatus || "Gold Certified Lead",
        profileImage: extraProfile.profileImage || null,
      },
    });
  } catch (error: any) {
    console.error("Employee profile GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string; role?: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, specialization, office, availability, availabilityStatus, profileImage } = body;

    // Update User details
    await prisma.user.update({
      where: { id: payload.id },
      data: {
        name: name || undefined,
        contactNumber: phone !== undefined ? phone : undefined,
      },
    });

    // Fetch existing extra profile
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId: payload.id },
      select: { profile: true },
    });

    const existingExtra = (existingProfile?.profile as any) || {};

    // Upsert UserProfile details
    await prisma.userProfile.upsert({
      where: { userId: payload.id },
      update: {
        profile: {
          ...existingExtra,
          specialization: specialization !== undefined ? specialization : existingExtra.specialization,
          office: office !== undefined ? office : existingExtra.office,
          availability: availability !== undefined ? availability : existingExtra.availability,
          availabilityStatus: availabilityStatus !== undefined ? availabilityStatus : existingExtra.availabilityStatus,
          profileImage: profileImage !== undefined ? profileImage : existingExtra.profileImage,
        },
      },
      create: {
        userId: payload.id,
        profile: {
          specialization: specialization || "General Strategy & IT Placement Advisor",
          office: office || "Indore HQ",
          availability: availability || "95%",
          availabilityStatus: availabilityStatus || "Fully Active",
          verifiedStatus: "Gold Certified Lead",
          profileImage: profileImage || null,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    console.error("Employee profile PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
