"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidation = void 0;
const zod_1 = require("zod");
const createPaymentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string({
            required_error: "userId is required",
        }),
        transactionId: zod_1.z
            .string({ required_error: "transactionId is required" })
            .optional(),
    }),
});
const updatePaymentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().optional(),
        transactionId: zod_1.z
            .string({ required_error: "transactionId is required" })
            .optional(),
    }),
});
exports.PaymentValidation = {
    createPaymentValidationSchema,
    updatePaymentValidationSchema,
};
