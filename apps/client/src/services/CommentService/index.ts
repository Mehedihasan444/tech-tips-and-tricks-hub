/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";
import axiosInstance from "@/config/axios.config";
import envConfig from "@/config/envConfig";
import { TCommentCreate, TReplyComment } from "@/hooks/comment.hook";
import { revalidateTag } from "next/cache";

export const createComment = async (
  commentData: TCommentCreate
): Promise<any> => {
  try {
    const { data } = await axiosInstance.post("/comments", commentData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    revalidateTag("comments");

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to post comment");
  }
};
export const replyComment = async (
  commentData: TReplyComment
): Promise<any> => {
  try {
    const { data } = await axiosInstance.post("/comments", commentData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    revalidateTag("comments");

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to post comment");
  }
};
export const updateComment = async (
  commentData: TReplyComment
): Promise<any> => {
  try {
    const { data } = await axiosInstance.put("/comments", commentData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    revalidateTag("comments");

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to post comment");
  }
};
export const deleteComment = async (
  commentId: string,
  postId: string
): Promise<any> => {
  try {
    const { data } = await axiosInstance.delete(`/comments`, {
      params: { commentId, postId },
      headers: {
        "Content-Type": "application/json",
      },
    });

    revalidateTag("comments");

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete comment");
  }
};

export const getAllCommentsOfASinglePost = async (postId: string) => {
  const fetchOption = {
    next: {
      cache: "force-cache" as RequestCache,
      tags: ["comments"],
    },
  };

  const res = await fetch(
    `${envConfig.baseApi}/comments?postId=${postId}`,
    fetchOption
  );

  return res.json();
};
