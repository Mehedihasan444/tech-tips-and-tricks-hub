import NextAuth from "next-auth";
import { authConfig } from "@/config/nextauth.config";

// Auth routes need the Node runtime (cookies + live API calls) and must never
// be statically collected at build time when the API is unreachable.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const { handlers } = NextAuth(authConfig);

export const { GET, POST } = handlers;
