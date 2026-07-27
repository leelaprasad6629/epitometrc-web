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

    const uploadDir = path.join(process.cwd(), "public", "uploads", "resumes");
    await fs.mkdir(uploadDir, { recursive: true });

    const safeFileName = `${userId}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadDir, safeFileName);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(filePath, fileBuffer);

    const fileUrl = `/uploads/resumes/${safeFileName}`;
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
