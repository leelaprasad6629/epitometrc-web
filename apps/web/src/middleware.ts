import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJWT(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
    return payload;
  } catch (e) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let sessionToken = request.cookies.get("token")?.value || null;
  const authHeader = request.headers.get("authorization");
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    sessionToken = authHeader.substring(7);
  }

  const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isEmployeePath = pathname.startsWith("/employee") || pathname.startsWith("/api/employee");
  const isStudentPath = pathname.startsWith("/student") || pathname.startsWith("/api/student");

  if (isAdminPath || isEmployeePath || isStudentPath) {
    if (!sessionToken) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Access Denied: Unauthenticated." }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login?error=Session+required.+Please+log+in.", request.url));
    }

    const payload = decodeJWT(sessionToken);
    if (!payload || !payload.role || !payload.id) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Access Denied: Invalid session." }, { status: 401 });
      }
      const response = NextResponse.redirect(new URL("/login?error=Invalid+session.+Please+log+in.", request.url));
      response.cookies.delete("token");
      return response;
    }

    const role = payload.role;

    // Centralized RBAC Guards
    if (isAdminPath && role !== "Admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Access Denied: Admin privileges required." }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/login?error=Access+Restricted+to+Administrators.", request.url));
    }

    if (isEmployeePath && role !== "Employee" && role !== "Admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Access Denied: Staff privileges required." }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/login?error=Access+Restricted+to+Employees.", request.url));
    }

    if (isStudentPath && role !== "Student" && role !== "Admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Access Denied: Student privileges required." }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/login?error=Access+Restricted+to+Students.", request.url));
    }
  }

  // Clone headers for Bearer injection if needed
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Cookie", `token=${token}`);
    request.cookies.set("token", token);
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/employee/:path*",
    "/api/employee/:path*",
    "/student/:path*",
    "/api/student/:path*",
    "/api/:path*"
  ],
};
