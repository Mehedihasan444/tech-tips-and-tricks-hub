import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
// Edge-safe: jwt-decode only, never `jsonwebtoken` (Node crypto breaks Edge).
import { decode, isTokenExpired } from "./utils/jwt.decode.edge";

interface TDecode {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  profilePhoto: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE";
  iat: number;
  exp: number;
}

const AuthRoutes = ["/login", "/register", "/forget-password", "/reset-password"];

const normalizePath = (pathname: string) =>
  pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

export async function proxy(request: NextRequest) {
  const { pathname: rawPathname } = request.nextUrl;
  const pathname = normalizePath(rawPathname);

  // Check for access token (use request cookies in middleware — edge-safe)
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    // If user is not logged in, allow access to auth routes only
    if (AuthRoutes.includes(pathname)) {
      return NextResponse.next(); // Allow access to login/register
    } else {
      // Redirect to login page with redirect parameter
      return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url));
    }
  }

  // If user is logged in, decode token (unverified payload: routing hint only,
  // real authorization is enforced by the API on every request).
  const decodedToken = accessToken ? (decode(accessToken) as TDecode | null) : null;

  // Reject expired/malformed tokens instead of trusting attacker-controlled payloads.
  if (!decodedToken || isTokenExpired(decodedToken)) {
    if (AuthRoutes.includes(pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If there is a valid user and the role is detected
  if (decodedToken?.role == "ADMIN" || decodedToken?.role == "USER") {
    // Prevent logged-in users from accessing login/register routes
    if (AuthRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const isAdminRoute =
      pathname === "/admin-dashboard" || pathname.startsWith("/admin-dashboard/");
    const isUserRoute = pathname === "/dashboard" || pathname.startsWith("/dashboard/");

    // Explicit role gates: cross-role dashboard access is denied (no fallthrough).
    if (isAdminRoute) {
      return decodedToken.role === "ADMIN"
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/", request.url));
    }

    if (isUserRoute) {
      return decodedToken.role === "USER"
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/", request.url));
    }
    // Allow access to common routes for both USER and ADMIN

    return NextResponse.next();
  }

  // If for some reason the token is invalid, redirect to login
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/forget-password",
    "/reset-password",
    "/",
    "/about-us",
    "/contact-us",
    "/posts/:path*",
    "/explore/:path*",
    "/subscription",
    "/profile/:path*",
    "/my-friends/:path*",
    "/saved-posts/:path*",
    "/community/:path*",
    "/settings/:path*",
    "/messages/:path*",
    "/notifications/:path*",
    "/dashboard/:path*",
    "/admin-dashboard/:path*",
  ],
};
