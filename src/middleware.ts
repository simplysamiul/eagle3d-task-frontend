// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const pathname = req.nextUrl.pathname;

  const isLoginPage = pathname === "/login";
  // protect everything except static, api routes etc.
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
