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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        contactNumber: true,
        profile: {
          select: {
            profile: true,
            confidenceScores: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    let profile = (user.profile as any)?.profile || null;
    const confidenceScores = (user.profile as any)?.confidenceScores || {};

    if (!profile) {
      // Construct a default profile based on the registration User table record
      profile = {
        fullName: user.name,
        email: user.email,
        phone: user.contactNumber || "",
        headline: "Software Engineering Apprentice",
        bio: "",
        education: [],
        experience: [],
        projects: [],
        technicalSkills: [],
        verifiedSkills: [],
        certifications: [],
        achievements: [],
        languagesKnown: [],
        professionalInterests: []
      };
    } else {
      // Ensure registration keys are bridged if present
      profile.fullName = profile.fullName || profile.name || user.name;
      profile.email = profile.email || user.email;
      profile.phone = profile.phone || profile.contactNumber || user.contactNumber || "";
      profile.headline = profile.headline || "Software Engineering Apprentice";
    }

    if (profile.profileImage && typeof profile.profileImage === "string" && profile.profileImage.includes("unsplash.com")) {
      profile.profileImage = null;
    }

    return NextResponse.json({
      success: true,
      profile,
      confidenceScores
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

    // Decode and save profile image to permanent server storage (/uploads) & Supabase storage
    if (profile && profile.profileImage && typeof profile.profileImage === "string" && profile.profileImage.startsWith("data:image/")) {
      const match = profile.profileImage.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        const mimeType = match[1];
        const base64Data = match[2];
        const fileBuffer = Buffer.from(base64Data, "base64");
        const extension = mimeType.split("/")[1] || "png";
        const safeFileName = `avatar_${userId}_${Date.now()}.${extension}`;

        try {
          // 1. Guaranteed Local Server Storage (public/uploads)
          const fs = await import("fs/promises");
          const path = await import("path");
          const uploadDir = path.join(process.cwd(), "public", "uploads");
          await fs.mkdir(uploadDir, { recursive: true });
          const localFilePath = path.join(uploadDir, safeFileName);
          await fs.writeFile(localFilePath, fileBuffer);
          
          // Set persistent local URL first
          profile.profileImage = `/uploads/${safeFileName}`;

          // 2. Optional: Cloud Storage Mirror (Supabase Storage)
          try {
            const { supabase } = await import("@/lib/supabase");
            const { data: buckets } = await supabase.storage.listBuckets();
            const bucketExists = buckets?.some(b => b.name === 'avatars');
            if (!bucketExists) {
              await supabase.storage.createBucket('avatars', { public: true });
            }

            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('avatars')
              .upload(safeFileName, fileBuffer, {
                contentType: mimeType,
                cacheControl: '3600',
                upsert: true,
              });

            if (!uploadError) {
              const { data: urlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(safeFileName);
              if (urlData?.publicUrl) {
                profile.profileImage = urlData.publicUrl;
              }
            }
          } catch (cloudErr) {
            console.warn("Supabase mirror skipped, using persistent local server URL:", cloudErr);
          }
        } catch (err) {
          console.error("Failed to save avatar image file:", err);
        }
      }
    }

    // Preserve existing profileImage from DB if not explicitly passed or set to undefined
    const existingRecord = await prisma.userProfile.findUnique({
      where: { userId },
      select: { profile: true }
    });

    const existingProfileData = (existingRecord?.profile as any) || {};

    if (profile && profile.profileImage === undefined && existingProfileData.profileImage) {
      profile.profileImage = existingProfileData.profileImage;
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
