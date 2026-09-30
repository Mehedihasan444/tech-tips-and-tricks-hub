/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "@/config/axios.config";
import { revalidateTag } from "next/cache";
import { getUser } from "../UserService";


export const registerUser = async (userData: Record<string, unknown>) => {
  try {
    const { data } = await axiosInstance.post("/auth/register", userData);

    if (data.success) {
      cookies().set("accessToken", data?.data?.accessToken);
      cookies().set("refreshToken", data?.data?.refreshToken);
      revalidateTag("users");
    }

    return data;
  } catch (error: any) {
    if (error?.response?.data?.success === false) {

      return (error?.response?.data);
    } else {

      throw new Error(error);
    }
  }
};

export const loginUser = async (userData: Record<string, unknown>) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", userData);

    if (data.success) {
      cookies().set("accessToken", data?.data?.accessToken);
      cookies().set("refreshToken", data?.data?.refreshToken);
    }

    return data;
  } catch (error: any) {
    if (error?.response?.data?.success === false) {

      return (error?.response?.data);
    } else {

      throw new Error(error);
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
    throw new Error(error);
  }
};
export const resetPassword = async (userData: Record<string, unknown>) => {
  try {
    const { token, ...newData } = userData;
    if (typeof token === 'string') {
      cookies().set("accessToken", token);
    }

    const { data } = await axiosInstance.post("/auth/reset-password", newData);

    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};


export const logout = () => {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
};

export const getCurrentUser = async () => {
  const accessToken = cookies().get("accessToken")?.value;

  let decodedToken = null;

  if (accessToken) {
    decodedToken = await jwtDecode(accessToken);
    if (decodedToken) {
      const user = await getUser(decodedToken?.nickName);
      return user?.data;
    }

  }

  return decodedToken;
};

export const getNewAccessToken = async () => {
  try {
    const refreshToken = cookies().get("refreshToken")?.value;

    const res = await axiosInstance({
      url: "/auth/refresh-token",
      method: "POST",
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
