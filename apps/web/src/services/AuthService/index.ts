/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import axiosInstance from "@/config/axios.config";
import { revalidateTag } from "next/cache";
import { authCookieOptions, ACCESS_TOKEN_MAX_AGE } from "@/config/authCookies";
import { toErrorMessage } from "@/utils/toError";
import envConfig from "@/config/envConfig";
import { getUser } from "../UserService";

export const registerUser = async (userData: Record<string, unknown>) => {
  try {
    const { data } = await axiosInstance.post("/auth/register", userData);

    if (data.success) {
      const cookieStore = await cookies();
      cookieStore.set(
        "accessToken",
        data?.data?.accessToken,
        authCookieOptions(ACCESS_TOKEN_MAX_AGE),
      );
      cookieStore.set(
        "refreshToken",
        data?.data?.refreshToken,
        authCookieOptions(ACCESS_TOKEN_MAX_AGE),
      );
      revalidateTag("users", "max");
    }

    return data;
  } catch (error: any) {
    if (error?.response?.data?.success === false) {
      return error?.response?.data;
    } else {
      throw new Error(toErrorMessage(error, "Request failed"));
    }
  }
};

export const loginUser = async (userData: Record<string, unknown>) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", userData);

    if (data.success) {
      const cookieStore = await cookies();
      cookieStore.set(
        "accessToken",
        data?.data?.accessToken,
        authCookieOptions(ACCESS_TOKEN_MAX_AGE),
      );
      cookieStore.set(
        "refreshToken",
        data?.data?.refreshToken,
        authCookieOptions(ACCESS_TOKEN_MAX_AGE),
      );
    }

    return data;
  } catch (error: any) {
    if (error?.response?.data?.success === false) {
      return error?.response?.data;
    } else {
      throw new Error(toErrorMessage(error, "Request failed"));
    }
  }
};

export const forgetPassword = async (userData: Record<string, unknown>) => {
  try {
    const { data } = await axiosInstance.post("/auth/forget-password", userData);
    // if (data.success) {
    //   cookies().set("accessToken", data?.data?.accessToken);
    //   // cookies().set("refreshToken", data?.data?.refreshToken);
    // }

    return data;
  } catch (error: any) {
    throw new Error(toErrorMessage(error, "Request failed"));
  }
};
export const resetPassword = async (userData: Record<string, unknown>) => {
  try {
    const { token, ...newData } = userData;
    if (typeof token === "string") {
      const cookieStore = await cookies();
      cookieStore.set("accessToken", token, authCookieOptions(ACCESS_TOKEN_MAX_AGE));
    }

    const { data } = await axiosInstance.post("/auth/reset-password", newData);

    return data;
  } catch (error: any) {
    throw new Error(toErrorMessage(error, "Request failed"));
  }
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
};

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  let decodedToken = null;

  if (accessToken) {
    try {
      decodedToken = await jwtDecode(accessToken);
    } catch {
      // A malformed cookie must not 500 the page; treat it as "signed out".
      return null;
    }

    if (decodedToken) {
      const user = await getUser(decodedToken?.nickName).catch(() => null);
      return user?.data ?? null;
    }
  }

  return decodedToken;
};

export const getNewAccessToken = async () => {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    // Deliberately a bare `axios` call rather than `axiosInstance`.
    //
    // The shared instance's 401 interceptor calls this very function, so
    // routing the refresh through it means a 401 from the refresh endpoint
    // re-enters that interceptor with a fresh config (the `sent` guard is per
    // config, not global) and recurses until the stack blows. It also must not
    // inherit the request interceptor's Authorization header: this endpoint
    // authenticates with the refresh cookie only.
    const res = await axios.post(`${envConfig.baseApi}/auth/refresh-token`, undefined, {
      withCredentials: true,
      headers: {
        cookie: `refreshToken=${refreshToken}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error("Failed to get new access token");
  }
};
