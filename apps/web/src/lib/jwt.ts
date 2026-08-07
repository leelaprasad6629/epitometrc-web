import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "epitome-secret-key-123456789";

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

export function getToken(req: NextRequest): string | null {
  let token = req.cookies.get("token")?.value;
  if (!token) {
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }
  return token || null;
}

export async function getAuthorizedUser(req: NextRequest, allowedRoles?: string[]) {
  const token = getToken(req);
  if (!token) return null;

  const payload = verifyToken(token) as { id: string; tokenVersion?: number } | null;
  if (!payload?.id) return null;

  const { prisma } = await import("./prisma");
  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, role: true, status: true, name: true, tokenVersion: true }
  });

  if (!user || user.status !== "Active") {
    return null;
  }

  // Enforce session expiration / device logout check
  if (payload.tokenVersion !== undefined && user.tokenVersion !== payload.tokenVersion) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return user;
}
