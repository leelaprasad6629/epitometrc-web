import { NextRequest } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function isRateLimited(req: NextRequest, limit = 10, durationMs = 60000): boolean {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + durationMs });
    return false;
  }
  
  if (now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + durationMs });
    return false;
  }
  
  entry.count++;
  if (entry.count > limit) {
    return true;
  }
  return false;
}
