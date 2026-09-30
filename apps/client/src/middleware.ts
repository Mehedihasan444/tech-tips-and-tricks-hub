import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { decode } from "./utils/jwt.decode";

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

const AuthRoutes = [
  "/login",
  "/register",
  "/forget-password",
  "/reset-password",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for access token
  const accessToken = cookies().get("accessToken")?.value;

  if (!accessToken) {
    // If user is not logged in, allow access to auth routes only
    if (AuthRoutes.includes(pathname)) {
      return NextResponse.next(); // Allow access to login/register
    } else {
      // Redirect to login page with redirect parameter
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, request.url)
      );
    }
  }

  // If user is logged in, decode token
  const decodedToken = accessToken ? (decode(accessToken) as TDecode) : null;

  // If there is a valid user and the role is detected
  if (decodedToken?.role == "ADMIN" || decodedToken?.role == "USER") {
    // Prevent logged-in users from accessing login/register routes
    if (AuthRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Role-based authorization
    if (decodedToken.role === "ADMIN" && pathname.match(/^\/admin-dashboard/)) {
      return NextResponse.next(); // Allow access to admin dashboard
    }

    if (decodedToken.role === "USER" && pathname.match(/^\/dashboard/)) {
      return NextResponse.next(); // Allow access to user dashboard
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
    "/posts",
    "/subscription",
    "/profile",
    "/dashboard/:page*",
    "/admin-dashboard/:page*",
  ],
};
