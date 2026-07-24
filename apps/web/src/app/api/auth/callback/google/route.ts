import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(errorParam)}`, req.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL("/login?error=Google+authorization+code+missing", req.url));
    }

    const host = req.headers.get("host") || "epitometrc-web.vercel.app";
    const protocol = host.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;
    const redirectUri = `${origin}/api/auth/callback/google`;

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Google token exchange error:", tokenData);
      return NextResponse.redirect(new URL("/login?error=Google+token+exchange+failed", req.url));
    }

    // Get user profile info
    const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userinfoRes.json();
    if (!userinfoRes.ok || !googleUser.email) {
      console.error("Google userinfo fetch error:", googleUser);
      return NextResponse.redirect(new URL("/login?error=Failed+to+retrieve+Google+profile", req.url));
    }

    const { email, name, picture } = googleUser;

    // Prevent duplicate student accounts
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      // Role validation: Google OAuth is ONLY allowed for Student accounts
      if (user.role !== "Student") {
        return NextResponse.redirect(
          new URL("/login?error=Google+Login+is+only+authorized+for+Student+accounts", req.url)
        );
      }

      // Update User profile details if exist
      await prisma.userProfile.upsert({
        where: { userId: user.id },
        update: {
          profile: {
            picture: picture || null,
            provider: "google",
          },
        },
        create: {
          userId: user.id,
          profile: {
            picture: picture || null,
            provider: "google",
          },
        },
      });
    } else {
      // Auto-create student user account
      const defaultPassword = Math.random().toString(36).slice(-10);
      const passwordHash = await bcrypt.hash(defaultPassword, 10);

      user = await prisma.user.create({
        data: {
          name: name || "Student",
          email,
          passwordHash,
          role: "Student",
          status: "Active",
        },
      });

      await prisma.userProfile.create({
        data: {
          userId: user.id,
          profile: {
            picture: picture || null,
            provider: "google",
          },
        },
      });
    }

    // Sign session token
    const token = signToken({ id: user.id, email: user.email, role: user.role });

    const response = NextResponse.redirect(new URL("/student/dashboard", req.url));
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Google OAuth Callback Error:", err);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(err.message)}`, req.url));
  }
}
