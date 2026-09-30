/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import axiosInstance from "@/config/axios.config";
import envConfig from "@/config/envConfig";
import { revalidateTag } from "next/cache";
import { getCurrentUser } from "../AuthService";

export const createPost = async (formData: FormData): Promise<any> => {
  try {
    const { data } = await axiosInstance.post("/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    revalidateTag("posts");

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create post");
  }
};

export const getPosts = async (page=1,limit=10) => {
  const fetchOption = {
    cache: "no-store" as RequestCache,
  };

  const res = await fetch(`${envConfig.baseApi}/posts?page=${page}&limit=${limit}`, fetchOption);
  return res.json();
};

export const getPost = async (postId: string) => {
  const fetchOptions = {
    cache: "no-store" as RequestCache,
  };

  const res = await fetch(`${envConfig.baseApi}/posts/${postId}`, fetchOptions);

  if (!res.ok) {
    console.log("Response status:", res.status);
    console.log("Response text:", await res.text());
    throw new Error("Failed to fetch data");
  }

  const jsonData = await res.json();
  console.log("Parsed JSON:", jsonData);
  return jsonData;
};

export const getMyPosts = async (id: string) => {
  if (id) {
    const res = await axiosInstance.get(`/posts?author=${id}`);
    return res.data;
  }
  const user = await getCurrentUser();

  const res = await axiosInstance.get(`/posts?author=${user?._id}`);

  return res.data;
};

export const updatePost = async (
  formData: FormData,
  postId: string
): Promise<any> => {
  try {
    const { data } = await axiosInstance.put(`/posts/${postId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    revalidateTag("posts");

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update post");
  }
};

export const deletePost = async (postId: string) => {
  try {
    const res = await axiosInstance.delete(`/posts/${postId}`);
    revalidateTag("posts");
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete post");
  }
};
