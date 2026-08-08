import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { validateFileContent } from "@/lib/fileValidation";
import fs from "fs/promises";
import path from "path";

const ALLOWED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".gif", ".doc", ".docx", ".mp4", ".mov", ".webm"];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token) as { id: string; role?: string } | null;
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Enforce Magic Byte Content Signatures
    const validation = validateFileContent(
      buffer,
      file.name,
      file.type,
      ALLOWED_EXTENSIONS,
      MAX_FILE_SIZE
    );

    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique name to prevent collisions
    const uniqueFileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(uploadDir, uniqueFileName);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      url: `/uploads/${uniqueFileName}`,
    });
  } catch (error: any) {
    console.error("Media upload error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
