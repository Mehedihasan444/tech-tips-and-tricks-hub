/* eslint-disable @typescript-eslint/no-explicit-any */
import { createPayment } from "@/services/PaymentService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreatePayment = () => {
  return useMutation<any, Error, { userId: string }>({
    mutationKey: ["CREATE_PAYMENT"],
    mutationFn: async ({ userId }) => await createPayment(userId),
    onSuccess: (res) => {
      if (res?.data?.payment_url) window.location.href = res?.data?.payment_url;
      // toast.success("Payment created successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
