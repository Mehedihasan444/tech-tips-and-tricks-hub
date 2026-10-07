/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import axiosInstance from "@/config/axios.config";

export const createPayment = async (userId: string): Promise<any> => {
  try {
    const { data } = await axiosInstance.post(
      "/payment",
      { userId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create payment");
  }
};
export const getPayments = async (userId?: string) => {
  // Financial records must never be served stale, so this stays uncached.
  // Uses the shared axios instance so the accessToken cookie is forwarded —
  // the API route requires USER or ADMIN auth, and a bare fetch sends no
  // Authorization header, which made every admin transaction table 401 and
  // render as "No payment data available".
  try {
    const { data } = await axiosInstance.get("/payment", {
      params: userId ? { userId } : undefined,
    });

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch payments");
  }
};
