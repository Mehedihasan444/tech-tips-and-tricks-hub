/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";
import axiosInstance from "./axios.config";
import { generateNickname } from "@/utils/generateNickname";

export const AuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
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

          if (
            response.data.data.accessToken ||
            response.data.data.refreshToken
          ) {
            cookies().set("accessToken", response.data.data.accessToken);
            cookies().set("refreshToken", response.data.data.refreshToken);
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
  secret: process.env.NEXTAUTH_SECRET as string,
};
