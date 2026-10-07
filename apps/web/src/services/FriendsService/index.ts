"use server";
import axios from "axios";
import axiosInstance from "@/config/axios.config";

export const getFriends = async () => {
  try {
    // Use axiosInstance instead of fetch to automatically include auth headers
    const response = await axiosInstance.get("/friends");

    // Return the data in the same format as other functions
    return response.data;
  } catch (error) {
    // A blanket `throw new Error("Failed to fetch friends")` discarded the only
    // information that distinguishes the causes: a 401 (session ended), a 500
    // (server fault) and a network failure all surfaced as the same message.
    // Keep the status and server message so callers can react to them.
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    const serverMessage = axios.isAxiosError(error)
      ? (error.response?.data as { message?: string } | undefined)?.message
      : undefined;

    console.error("Error fetching friends:", { status, serverMessage, error });

    throw new Error(
      status
        ? `Failed to fetch friends (${status}): ${serverMessage ?? "request failed"}`
        : "Failed to fetch friends",
    );
  }
};
