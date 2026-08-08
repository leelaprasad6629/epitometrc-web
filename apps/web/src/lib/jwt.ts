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

  // Verify that the token is registered as an active session in the database
  try {
    const activeSession = await prisma.userSession.findUnique({
      where: { token },
      select: { expiresAt: true }
    });
    if (!activeSession || new Date() > activeSession.expiresAt) {
      return null;
    }
  } catch (err) {
    console.warn("UserSession database verification bypassed/failed:", err);
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return user;
}

export async function registerUserSession(
  userId: string,
  token: string,
  userEmail: string,
  req: NextRequest
) {
  const { prisma } = await import("./prisma");
  const { logAuditAction } = await import("./audit");

  const ipAddress = req.headers.get("x-forwarded-for") || null;
  const userAgent = req.headers.get("user-agent") || null;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 1); // 1 day session expiry

  try {
    // 1. Delete expired sessions for this user
    await prisma.userSession.deleteMany({
      where: {
        userId,
        expiresAt: { lt: new Date() }
      }
    });

    // 2. Fetch existing active sessions
    const activeSessions = await prisma.userSession.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" }
    });

    // 3. Enforce Concurrent Login Limit: Max 2 active sessions
    const CONCURRENT_LIMIT = 2;
    if (activeSessions.length >= CONCURRENT_LIMIT) {
      // FIFO: Revoke the oldest session(s)
      const numberToRemove = activeSessions.length - CONCURRENT_LIMIT + 1;
      const sessionsToRevoke = activeSessions.slice(0, numberToRemove);
      for (const sess of sessionsToRevoke) {
        await prisma.userSession.delete({
          where: { id: sess.id }
        });
      }
    }

    // 4. Create new session
    await prisma.userSession.create({
      data: {
        userId,
        token,
        ipAddress,
        userAgent,
        expiresAt
      }
    });

    // 5. Log audit trail
    await logAuditAction(
      userId,
      userEmail,
      "LOGIN",
      { ipAddress, userAgent, tokenSnippet: token.substring(token.length - 10) },
      ipAddress
    );
  } catch (err) {
    console.error("Session registry failure:", err);
  }
}

