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
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/octet-stream",
]);

const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const profileRecord = await prisma.userProfile.findUnique({
      where: { userId },
      select: { resumeFile: true },
    });

    return NextResponse.json({
      success: true,
      resumeFile: profileRecord?.resumeFile || null,
    });
  } catch (err: unknown) {
    console.error("GET /api/student/resume error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch resume metadata." }, { status: 500 });
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

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded." }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Only PDF, DOC, and DOCX files are allowed." },
        { status: 400 }
      );
    }

    if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid MIME type. Only PDF, DOC, and DOCX files are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `File size exceeds the 10 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB uploaded).` },
        { status: 400 }
      );
    }

    const { supabase } = await import("@/lib/supabase");
    
    // Auto-create resumes bucket if missing
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(b => b.name === 'resumes');
      if (!bucketExists) {
        await supabase.storage.createBucket('resumes', { public: true });
      }
    } catch {
      // Proceed hoping it exists
    }

    const safeFileName = `${userId}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(safeFileName, fileBuffer, {
        contentType: file.type || 'application/pdf',
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      throw new Error("Supabase upload failed: " + uploadError.message);
    }

    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(safeFileName);

    const fileUrl = urlData.publicUrl;

    const resumeMetadata = {
      userId,
      fileName: file.name,
      fileUrl,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      mimeType: file.type || "application/pdf",
    };

    await prisma.userProfile.upsert({
      where: { userId },
      update: { resumeFile: resumeMetadata },
      create: {
        userId,
        resumeFile: resumeMetadata,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Resume uploaded successfully.",
      resumeFile: resumeMetadata,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("POST /api/student/resume error:", err);
    return NextResponse.json({ success: false, error: "Failed to upload resume file: " + errorMsg }, { status: 500 });
  }
}
