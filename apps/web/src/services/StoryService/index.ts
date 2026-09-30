/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import axiosInstance from "@/config/axios.config";
import { revalidateTag } from "next/cache";

export const createStory = async (formData: FormData): Promise<any> => {
    try {
      const { data } = await axiosInstance.post("/stories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      revalidateTag("stories");
  
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to create story");
    }
  };

// Get user stories and stories of users they follow
export const getStories = async () => {
  try {
    // Use axiosInstance instead of fetch to automatically include auth headers
    const response = await axiosInstance.get("/stories");
    
    // Return the data in the same format as other functions
    return response.data;
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw new Error('Failed to fetch stories');
  }
};

// Add a function to manually trigger revalidation
export const refreshStories = async () => {
  try {
    revalidateTag("stories");
    return { success: true };
  } catch (error) {
    console.error('Error revalidating stories:', error);
    return { success: false };
  }
};


export const deleteStory = async (storyId: string) => {
  try {
    const res = await axiosInstance.delete(`/stories/${storyId}`);
    revalidateTag("stories");
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete story");
  }
};