import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "src/lib/ai/store/profile_db.json");

// Ensure database file exists
function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ profile: null, confidenceScores: {} }), "utf8");
  }
}

export async function GET() {
  try {
    ensureDb();
    const data = fs.readFileSync(DB_PATH, "utf8");
    const json = JSON.parse(data);
    return NextResponse.json({
      success: true,
      profile: json.profile || null,
      confidenceScores: json.confidenceScores || {}
    });
  } catch (err) {
    console.error("Failed to read profile:", err);
    return NextResponse.json({ success: false, error: "Failed to load profile data." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    ensureDb();
    const { profile, confidenceScores } = await req.json();
    fs.writeFileSync(
      DB_PATH,
      JSON.stringify({ profile, confidenceScores }, null, 2),
      "utf8"
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to save profile:", err);
    return NextResponse.json({ success: false, error: "Failed to save profile data." }, { status: 500 });
  }
}
