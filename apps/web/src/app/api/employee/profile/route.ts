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
    const rawProfileImage = extraProfile.profileImage || null;
    const profileImage = (rawProfileImage && rawProfileImage.includes("unsplash.com")) ? null : rawProfileImage;

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
        profileImage,
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
    let { name, phone, specialization, office, availability, availabilityStatus, profileImage } = body;

    if (profileImage && typeof profileImage === "string" && profileImage.includes("unsplash.com")) {
      profileImage = null;
    }

    // Decode and save profile image to Supabase storage if it is a base64 string
    if (profileImage && typeof profileImage === "string" && profileImage.startsWith("data:image/")) {
      const match = profileImage.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const base64Data = match[2];
        const fileBuffer = Buffer.from(base64Data, "base64");
        const extension = mimeType.split("/")[1] || "png";
        const safeFileName = `avatar_${payload.id}_${Date.now()}.${extension}`;

        try {
          const { supabase } = await import("@/lib/supabase");

          // Ensure avatars bucket exists
          try {
            const { data: buckets } = await supabase.storage.listBuckets();
            const bucketExists = buckets?.some(b => b.name === 'avatars');
            if (!bucketExists) {
              await supabase.storage.createBucket('avatars', { public: true });
            }
          } catch (bucketErr) {
            console.warn("Failed to check/create avatars bucket:", bucketErr);
          }

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(safeFileName, fileBuffer, {
              contentType: mimeType,
              cacheControl: '3600',
              upsert: true,
            });

          if (uploadError) {
            console.error("Supabase avatar upload failed:", uploadError);
          } else {
            const { data: urlData } = supabase.storage
              .from('avatars')
              .getPublicUrl(safeFileName);
            profileImage = urlData.publicUrl;
          }
        } catch (err) {
          console.error("Failed to upload image to Supabase storage:", err);
        }
      }
    }

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
