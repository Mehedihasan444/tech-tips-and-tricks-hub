/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import axiosInstance from "@/config/axios.config";
import envConfig from "@/config/envConfig";
import { IUserData } from "@/types/IUser";
import { revalidateTag } from "next/cache";

export const getUsers = async (page: number = 1, limit: number = 8) => {
  // Cached and tagged so the revalidateTag("users") calls in the write actions
  // actually have something to invalidate. `cache: "no-store"` cannot be combined
  // with `next.tags`: the response never enters the Data Cache, so the tag is
  // never registered and every revalidateTag became a silent no-op.
  const fetchOptions = {
    next: { revalidate: 30, tags: ["users"] },
  };

  const res = await fetch(`${envConfig.baseApi}/users?page=${page}&limit=${limit}`, fetchOptions);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
export const getSuggestedUsers = async (limit = 5) => {
  const res = await fetch(`${envConfig.baseApi}/users?limit=${limit}`, {
    next: { revalidate: 60, tags: ["users"] },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch suggested users (${res.status})`);
  }

  return res.json();
};

export const getUser = async (nickName: string) => {
  const fetchOptions = {
    next: { revalidate: 30, tags: ["users", `user:${nickName}`] },
  };

  const res = await fetch(`${envConfig.baseApi}/users/${nickName}`, fetchOptions);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
export const updateUser = async (userData: IUserData, userId: string): Promise<any> => {
  try {
    const { data } = await axiosInstance.put(`/users/${userId}`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    revalidateTag("users", "max");

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update user");
  }
};
export const updateProfilePhoto = async (userData: FormData): Promise<any> => {
  try {
    const { data } = await axiosInstance.put(`/users/update-profile-photo`, userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    revalidateTag("users", "max");

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update user");
  }
};
export const deleteUser = async (userId: string) => {
  try {
    const res = await axiosInstance.delete(`/users/${userId}`);
    revalidateTag("users", "max");
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete user");
  }
};
