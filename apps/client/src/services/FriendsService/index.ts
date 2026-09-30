"use server"
import axiosInstance from "@/config/axios.config";

export const getFriends = async () => {
    try {
      // Use axiosInstance instead of fetch to automatically include auth headers
      const response = await axiosInstance.get("/friends");
      
      // Return the data in the same format as other functions
      return response.data;
    } catch (error) {
      console.error('Error fetching friends:', error);
      throw new Error('Failed to fetch friends');
    }
  };