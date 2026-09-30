/* eslint-disable @typescript-eslint/no-explicit-any */

import { createPost, deletePost, updatePost } from "@/services/PostService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation<any, Error, FormData>({
    mutationKey: ["CREATE_POST"],
    mutationFn: async (postData) => await createPost(postData),
    onSuccess: () => {
      toast.success("Post created successfully");
      // Invalidate posts query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
export const useUpdatePost = () => {
  return useMutation<any, Error, { postId: string; formData: FormData }>({
    mutationKey: ["UPDATE_POST"],
    mutationFn: async ({ postId, formData }) => await updatePost(formData,postId ), // Destructure the input
    onSuccess: () => {
      toast.success("Post updated successfully");
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
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

