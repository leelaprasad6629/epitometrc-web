import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getToken } from "@/lib/jwt";

function getUserIdFromRequest(req: NextRequest): string | null {
  const token = getToken(req);
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

    let profile = profileRecord?.profile as any || null;
    if (profile && profile.profileImage && profile.profileImage.includes("unsplash.com")) {
      profile.profileImage = null;
    }

    return NextResponse.json({
      success: true,
      profile,
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

    if (profile && profile.profileImage && typeof profile.profileImage === "string" && profile.profileImage.includes("unsplash.com")) {
      profile.profileImage = null;
    }

    // Decode and save profile image to Supabase storage if it is a base64 string
    if (profile && profile.profileImage && typeof profile.profileImage === "string" && profile.profileImage.startsWith("data:image/")) {
      const match = profile.profileImage.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const base64Data = match[2];
        const fileBuffer = Buffer.from(base64Data, "base64");
        const extension = mimeType.split("/")[1] || "png";
        const safeFileName = `avatar_${userId}_${Date.now()}.${extension}`;

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
            profile.profileImage = urlData.publicUrl;
          }
        } catch (err) {
          console.error("Failed to upload image to Supabase storage:", err);
        }
      }
    }

    // Update the parent User record with updated name and contact number
    if (profile) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...(profile.fullName !== undefined ? { name: profile.fullName } : {}),
          ...(profile.phone !== undefined ? { contactNumber: profile.phone } : {})
        }
      });
    }

    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId },
      update: {
        profile: profile || null,
        confidenceScores: confidenceScores || {}
      },
      create: {
        userId,
        profile: profile || null,
        confidenceScores: confidenceScores || {}
      },
      select: {
        profile: true,
        confidenceScores: true
      }
    });

    return NextResponse.json({
      success: true,
      profile: updatedProfile.profile,
      confidenceScores: updatedProfile.confidenceScores || {}
    });
  } catch (err) {
    console.error("Failed to save profile:", err);
    return NextResponse.json({ success: false, error: "Failed to save profile data." }, { status: 500 });
  }
}
