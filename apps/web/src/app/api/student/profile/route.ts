import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: true, profile: null, confidenceScores: {} });
}

export async function POST() {
  return NextResponse.json({ success: true });
}
