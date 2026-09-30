import mongoose from "mongoose";
import { z } from "zod";
import { POST_STATUS } from "./post.constant";

const createPostValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    content: z.string({
      required_error: "content is required",
    }),
    status: z.nativeEnum(POST_STATUS).default(POST_STATUS.DRAFT).optional(),
    author: z
      .string({
        required_error: "User is required",
      })
      .refine((val) => {
        return mongoose.Types.ObjectId.isValid(val);
      }),
    category: z.string({
      required_error: "Category is required",
    }),
    tags: z.array(
      z.string({
        required_error: "Tags is required",
      })
    ),
    images: z.array(z.string()).optional(),
    isPremium: z.boolean()
  }),
});

const updatePostValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "Title is required",
      })
      .optional(),
    content: z
      .string({
        required_error: "content is required",
      })
      .optional(),
    status: z.string().optional(),
    author: z
      .string({
        required_error: "User is required",
      })
      .refine((val) => {
        return mongoose.Types.ObjectId.isValid(val);
      })
      .optional(),
    category: z
      .string({
        required_error: "Category is required",
      })
      .optional(),
    tags: z
      .array(
        z.string({
          required_error: "Tags is required",
        })
      )
      .optional(),
    images: z.array(z.string()).optional(),
    likes: z.number().optional(),
    dislikes: z.number().optional(),
    isPremium: z.boolean().optional(),
   
  }),
});

export const PostValidation = {
  createPostValidationSchema,
  updatePostValidationSchema,
};
