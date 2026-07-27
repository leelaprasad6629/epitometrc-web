import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    
    // Clone request headers and inject cookie header
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("Cookie", `token=${token}`);
    
    // Set the cookie on the request object directly for downstream compatibility
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
  matcher: "/api/:path*",
};
