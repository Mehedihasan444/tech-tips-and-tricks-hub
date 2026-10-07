/* eslint-disable @typescript-eslint/no-explicit-any */

import { createPost, deletePost, updatePost } from "@/services/PostService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Emitted whenever posts change so feeds can refetch.
 *
 * There is no `useQuery` anywhere in this app (reads go through Server Actions
 * and `useEffect`), so `queryClient.invalidateQueries({queryKey:["posts"]})` was
 * a no-op: creating a post toasted success but the feed never refreshed.
 */
export const POSTS_CHANGED_EVENT = "tech-tips:posts-changed";

export const notifyPostsChanged = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(POSTS_CHANGED_EVENT));
  }
};

export const useCreatePost = () => {
  return useMutation<any, Error, FormData>({
    mutationKey: ["CREATE_POST"],
    mutationFn: async (postData) => await createPost(postData),
    onSuccess: () => {
      toast.success("Post created successfully");
      notifyPostsChanged();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
export const useUpdatePost = () => {
  return useMutation<any, Error, { postId: string; formData: FormData; silent?: boolean }>({
    mutationKey: ["UPDATE_POST"],
    mutationFn: async ({ postId, formData }) => await updatePost(formData, postId), // Destructure the input
    onSuccess: (_, variables) => {
      // Like/dislike toggles pass silent:true — the count change is feedback enough.
      if (!variables?.silent) {
        toast.success("Post updated successfully");
      }
      notifyPostsChanged();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
export const useDeletePost = () => {
  return useMutation<any, Error, { postId: string }>({
    mutationKey: ["DELETE_POST"],
    mutationFn: async ({ postId }) => await deletePost(postId), // Destructure the input
    onSuccess: () => {
      toast.success("Post deleted successfully");
      notifyPostsChanged();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
