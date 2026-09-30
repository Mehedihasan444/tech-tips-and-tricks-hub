/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStory, deleteStory } from "@/services/StoryService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateStory = () => {
    return useMutation<any, Error, FormData>({
      mutationKey: ["CREATE_STORY"],
      mutationFn: async (StoryData) => await createStory(StoryData),
      onSuccess: () => {
        toast.success("Story created successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };


  export const useDeleteStory = () => {
    return useMutation<any, Error, { storyId: string }>({
      mutationKey: ["DELETE_STORY"],
      mutationFn: async ({ storyId }) => await deleteStory(storyId), // Destructure the input
      onSuccess: () => {
        toast.success("Story deleted successfully");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  