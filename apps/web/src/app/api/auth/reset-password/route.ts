import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Missing email address" }, { status: 400 });
    }
    
    // In production, this would generate a secure reset token, persist it to the database,
    // and email it to the user. For development, we return a simulated success.
    return NextResponse.json({
      success: true,
      message: `Simulated password reset link successfully sent to ${email}`,
    });
  } catch (error: any) {
    console.error("Reset password API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
