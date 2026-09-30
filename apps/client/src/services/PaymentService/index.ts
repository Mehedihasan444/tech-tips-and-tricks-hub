/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import axiosInstance from "@/config/axios.config";
import envConfig from "@/config/envConfig";
import { revalidateTag } from "next/cache";

export const createPayment = async (userId: string): Promise<any> => {
  try {
    const { data } = await axiosInstance.post("/payment", {userId}, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    revalidateTag("payments");

    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create payment");
  }
};
export const getPayments = async (userId:string) => {
  const fetchOption = {
    next: {
      cache: "force-cache" as RequestCache,
      tags: ["payments"],
    },
  };

  const res = await fetch(
    `${envConfig.baseApi}/payment?userId=${userId}`,
    fetchOption
  );

  return res.json();
};