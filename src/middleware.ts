import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  // Public routes
  const publicRoutes = ["/login"];

  const isPublic = publicRoutes.includes(pathname);
  const isAuth = !!token;

  // If not authenticated & trying to access private route → redirect to login
  if (!isAuth && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If authenticated & trying to access login route → redirect to dashboard
  if (isAuth && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
