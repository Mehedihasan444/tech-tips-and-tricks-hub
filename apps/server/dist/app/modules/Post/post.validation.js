"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostValidation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const post_constant_1 = require("./post.constant");
const createPostValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({
            required_error: "Title is required",
        }),
        content: zod_1.z.string({
            required_error: "content is required",
        }),
        status: zod_1.z.nativeEnum(post_constant_1.POST_STATUS).default(post_constant_1.POST_STATUS.DRAFT).optional(),
        author: zod_1.z
            .string({
            required_error: "User is required",
        })
            .refine((val) => {
            return mongoose_1.default.Types.ObjectId.isValid(val);
        }),
        category: zod_1.z.string({
            required_error: "Category is required",
        }),
        tags: zod_1.z.array(zod_1.z.string({
            required_error: "Tags is required",
        })),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        isPremium: zod_1.z.boolean()
    }),
});
const updatePostValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string({
            required_error: "Title is required",
        })
            .optional(),
        content: zod_1.z
            .string({
            required_error: "content is required",
        })
            .optional(),
        status: zod_1.z.string().optional(),
        author: zod_1.z
            .string({
            required_error: "User is required",
        })
            .refine((val) => {
            return mongoose_1.default.Types.ObjectId.isValid(val);
        })
            .optional(),
        category: zod_1.z
            .string({
            required_error: "Category is required",
        })
            .optional(),
        tags: zod_1.z
            .array(zod_1.z.string({
            required_error: "Tags is required",
        }))
            .optional(),
        images: zod_1.z.array(zod_1.z.string()).optional(),
        likes: zod_1.z.number().optional(),
        dislikes: zod_1.z.number().optional(),
        isPremium: zod_1.z.boolean().optional(),
    }),
});
exports.PostValidation = {
    createPostValidationSchema,
    updatePostValidationSchema,
};
