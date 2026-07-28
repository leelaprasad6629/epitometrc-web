import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
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

const ALLOWED_MIME_TYPES = new Set([
  "video/mp4",
  "video/quicktime",
  "video/webm",
  "video/x-matroska",
  "application/octet-stream",
]);

const ALLOWED_EXTENSIONS = new Set([".mp4", ".mov", ".webm"]);
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

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

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { success: false, error: "Invalid video format. Only MP4, MOV, and WEBM video files are allowed." },
        { status: 400 }
      );
    }

    if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid video MIME type. Only MP4, MOV, and WEBM video files are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `Video size exceeds the 100 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB uploaded).` },
        { status: 400 }
      );
    }

    const { supabase } = await import("@/lib/supabase");
    
    // Auto-create videos bucket if missing
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === 'videos');
      if (!bucketExists) {
        await supabase.storage.createBucket('videos', { public: true });
      }
    } catch {
      // Proceed hoping it exists
    }

    const safeFileName = `${userId}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('videos')
      .upload(safeFileName, fileBuffer, {
        contentType: file.type || 'video/mp4',
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      throw new Error("Supabase upload failed: " + uploadError.message);
    }

    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(safeFileName);

    const fileUrl = urlData.publicUrl;

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
