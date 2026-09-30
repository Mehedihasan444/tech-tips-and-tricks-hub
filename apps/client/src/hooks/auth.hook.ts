/* eslint-disable @typescript-eslint/no-explicit-any */
import { forgetPassword, loginUser, logout, registerUser, resetPassword } from "@/services/AuthService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUserRegistration = () => {
  return useMutation<any, Error, any>({
    mutationKey: ["USER_REGISTRATION"],
    mutationFn: async (userData) => await registerUser(userData),
    onSuccess:  (data) => {
      if (data.success) {
        toast.success("User registration successful.");
      } else if (!data.success) {
        toast.error(data.message);
      }

    },
    onError: (error) => {
      console.log(error, "error");
      toast.error(error.message);
    },
  });
};

export const useUserLogin = () => {
  return useMutation<any, Error, any>({
    mutationKey: ["USER_LOGIN"],
    mutationFn: async (userData) => await loginUser(userData),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("User login successfull.");
      } else if (!data.success) {
        toast.error(data.message);
      }
    },
    onError: (error) => {
      console.log(error, 'error')
      toast.error(error.message);
    },
  });
};

export const useForgetPassword = () => {
  return useMutation<any, Error, any>({
    mutationKey: ["FORGET_PASSWORD"],
    mutationFn: async (userData) => await forgetPassword(userData),
    onSuccess: () => {
      toast.success("Check your email");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
export const useResetPassword = () => {
  return useMutation<any, Error, any>({
    mutationKey: ["RESET_PASSWORD"],
    mutationFn: async (userData) => await resetPassword(userData),
    onSuccess: () => {
      logout()

      toast.success("Your password has been reset.");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};