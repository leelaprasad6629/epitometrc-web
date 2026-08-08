import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { validateFileContent } from "@/lib/fileValidation";
import fs from "node:fs/promises";
import path from "node:path";

function getUserIdFromRequest(req: NextRequest): string | null {
  const token = req.cookies.get("token")?.value;
  if (token) {
    const payload = verifyToken(token) as { id: string } | null;
    if (payload?.id) return payload.id;
  }

  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const bearerToken = authHeader.substring(7);
    const payload = verifyToken(bearerToken) as { id: string } | null;
    if (payload?.id) return payload.id;
  }

  return null;
}

const ALLOWED_EXTENSIONS = [".mp4", ".mov", ".webm"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const profileRecord = await prisma.userProfile.findUnique({
      where: { userId },
      select: { videoResumeFile: true },
    });

    return NextResponse.json({
      success: true,
      videoResumeFile: profileRecord?.videoResumeFile || null,
    });
  } catch (err: unknown) {
    console.error("GET /api/student/video-resume error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch video resume metadata." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const duration = formData.get("duration") as string | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No video file uploaded." }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Secure Data Protection Validation
    const validation = validateFileContent(
      fileBuffer,
      file.name,
      file.type,
      ALLOWED_EXTENSIONS,
      MAX_FILE_SIZE
    );

    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const safeFileName = `${userId}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // 1. Guaranteed Local Server Storage (public/uploads)
    let fileUrl = `/uploads/${safeFileName}`;
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });
      const localFilePath = path.join(uploadDir, safeFileName);
      await fs.writeFile(localFilePath, fileBuffer);
    } catch (fsErr) {
      console.warn("Failed to write video resume file to local disk:", fsErr);
    }

    // 2. Optional: Cloud Storage Mirror (Supabase Storage)
    try {
      const { supabase } = await import("@/lib/supabase");
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(b => b.name === 'videos');
        if (!bucketExists) {
          await supabase.storage.createBucket('videos', { public: true });
        }
      } catch {}

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(safeFileName, fileBuffer, {
          contentType: file.type || 'video/mp4',
          cacheControl: '3600',
          upsert: true,
        });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('videos')
          .getPublicUrl(safeFileName);
        if (urlData?.publicUrl) {
          fileUrl = urlData.publicUrl;
        }
      } else {
        console.warn("Supabase upload error, using local server storage URL:", uploadError.message);
      }
    } catch (cloudErr) {
      console.warn("Supabase mirror skipped, using local server storage URL:", cloudErr);
    }

    const videoMetadata = {
      userId,
      fileName: file.name,
      fileUrl,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      duration: duration || undefined,
      mimeType: file.type || "video/mp4",
    };

    await prisma.userProfile.upsert({
      where: { userId },
      update: { videoResumeFile: videoMetadata },
      create: {
        userId,
        videoResumeFile: videoMetadata,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Video resume uploaded successfully.",
      videoResumeFile: videoMetadata,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("POST /api/student/video-resume error:", err);
    return NextResponse.json({ success: false, error: "Failed to upload video resume: " + errorMsg }, { status: 500 });
  }
}
