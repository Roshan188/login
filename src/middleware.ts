import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/settings", "/portfolio/new", "/portfolio/edit"];
const authPaths = ["/auth/signin", "/auth/signup"];
const companyPaths = ["/company"];

export default auth((req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl;
  const session = (req as { auth: { user?: { role?: string } } | null }).auth;

  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));
  const isCompanyPath = companyPaths.some((path) => pathname.startsWith(path));

  // Redirect unauthenticated users from protected paths
  if (isProtected && !session) {
    const signInUrl = new URL("/auth/signin", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect non-company users from company paths
  if (isCompanyPath && session) {
    const userRole = (session as { user?: { role?: string } })?.user?.role;
    if (userRole && userRole !== "company" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
