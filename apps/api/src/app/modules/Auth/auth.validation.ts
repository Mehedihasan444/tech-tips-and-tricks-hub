import { z } from "zod";

const registerValidationSchema = z.object({
  body: z.object({
    name: z.string({
      error: "Name is required",
    }),
    email: z.string({
      error: "Email is required",
    }),
    password: z.string({ error: "Password is required" }),
    mobileNumber: z.string({ error: "Mobile number is required" }).optional(),
    profilePhoto: z.string(),
    nickName: z.string({ error: "Nick name is required" }),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({
      error: "Email is required",
    }),
    password: z.string({ error: "Password is required" }),
  }),
});
const socialLoginValidationSchema = z.object({
  body: z.object({
    email: z.string({
      error: "Email is required",
    }),
    name: z.string({ error: "Name is required" }),
    nickName: z.string({ error: "Nickname is required" }),
    profilePhoto: z.string({ error: "Profile Photo is required" }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      error: "Old password is required",
    }),
    newPassword: z.string({ error: "Password is required" }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      error: "Refresh token is required!",
    }),
  }),
});
const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      error: "User email is required!",
    }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    userId: z.string({
      error: "User id is required!",
    }),
    newPassword: z.string({
      error: "New password is required!",
    }),
    oldPassword: z.string({
      error: "Old password is required!",
    }),
  }),
});
export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  socialLoginValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
