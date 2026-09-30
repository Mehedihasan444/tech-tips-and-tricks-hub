import { z } from "zod";

const createPaymentValidationSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: "userId is required",
    }),
    transactionId: z
      .string({ required_error: "transactionId is required" })
      .optional(),
  }),
});

const updatePaymentValidationSchema = z.object({
  body: z.object({
    userId: z.string().optional(),
    transactionId: z
      .string({ required_error: "transactionId is required" })
      .optional(),
  }),
});

export const PaymentValidation = {
  createPaymentValidationSchema,
  updatePaymentValidationSchema,
};
