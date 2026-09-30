import { z } from "zod";

export const createStoryValidationSchema = z.object({
  body: z.object({
    imageUrl: z.string({
      required_error: "Story image URL is required",
    }),
  }),
});

export const updateStoryValidationSchema = z.object({
  body: z.object({
    isActive: z.boolean().optional(),
  }),
});