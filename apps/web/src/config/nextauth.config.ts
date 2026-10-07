/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { cookies } from "next/headers";
import axiosInstance from "./axios.config";
import { generateNickname } from "@/utils/generateNickname";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],

  callbacks: {
    async signIn({ profile, account }: any) {
      try {
        if (!profile || !account) {
          return false;
        }

        if (account?.provider === "google") {
          const response: any = await axiosInstance.post("/auth/social-login", {
            name: profile.name,
            email: profile.email,
            profilePhoto: profile.picture,
            nickName: generateNickname(profile.name),
          });

          if (response.data.data.accessToken || response.data.data.refreshToken) {
            const cookieStore = await cookies();
            const secure = process.env.NODE_ENV === "production";
            cookieStore.set("accessToken", response.data.data.accessToken, {
              httpOnly: true,
              secure,
              sameSite: "lax",
              path: "/",
            });
            cookieStore.set("refreshToken", response.data.data.refreshToken, {
              httpOnly: true,
              secure,
              sameSite: secure ? "none" : "lax",
              path: "/",
            });
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },

  pages: {
    signIn: "/login",
  },
  // Auth.js v5 prefers AUTH_SECRET; fall back to the legacy NEXTAUTH_SECRET.
  secret: (process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET) as string,
  trustHost: true,
} satisfies NextAuthConfig;

// Legacy alias (v4 name) to avoid breaking existing imports.
export const AuthOptions = authConfig;
