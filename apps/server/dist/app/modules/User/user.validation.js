"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const user_constant_1 = require("./user.constant");
const mongoose_1 = __importDefault(require("mongoose"));
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            required_error: "Name is required",
        }),
        role: zod_1.z.nativeEnum(user_constant_1.USER_ROLE),
        email: zod_1.z
            .string({
            required_error: "Email is required",
        })
            .email({
            message: "Invalid email",
        }),
        password: zod_1.z.string({
            required_error: "Password is required",
        }),
        status: zod_1.z.nativeEnum(user_constant_1.USER_STATUS).default(user_constant_1.USER_STATUS.ACTIVE),
        mobileNumber: zod_1.z.string().optional(),
        nickName: zod_1.z.string({
            required_error: "Nickname is required",
        }),
    }),
});
const updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        role: zod_1.z.nativeEnum(user_constant_1.USER_ROLE).optional(),
        email: zod_1.z.string().email().optional(),
        password: zod_1.z.string().optional(),
        status: zod_1.z.nativeEnum(user_constant_1.USER_STATUS).optional(),
        mobileNumber: zod_1.z.string().optional(),
        profilePhoto: zod_1.z.string().optional().nullable(),
        bio: zod_1.z.string().optional().nullable(),
        dateOfBirth: zod_1.z.string().optional().nullable(),
        gender: zod_1.z.string().optional().nullable(),
        maritalStatus: zod_1.z.string().optional().nullable(),
        education: zod_1.z
            .array(zod_1.z.object({
            degree: zod_1.z.string(),
            institution: zod_1.z.string(),
            gpa: zod_1.z.string(),
            startDate: zod_1.z.string(),
            endDate: zod_1.z.string(),
        }))
            .optional()
            .default([]),
        socialMedia: zod_1.z
            .array(zod_1.z.object({
            platform: zod_1.z.string(),
            url: zod_1.z.string({ message: "Invalid URL format" }),
        }))
            .optional()
            .default([]),
        nickName: zod_1.z.string().optional(),
        shortBio: zod_1.z.string().optional(),
        followers: zod_1.z
            .string({
            required_error: "User is required",
        })
            .refine((val) => {
            return mongoose_1.default.Types.ObjectId.isValid(val);
        }).optional(),
        following: zod_1.z
            .string({
            required_error: "User is required",
        })
            .refine((val) => {
            return mongoose_1.default.Types.ObjectId.isValid(val);
        }).optional(),
        isPremium: zod_1.z.boolean().optional(),
        subscriptionStartDate: zod_1.z.string().optional(),
    }),
});
exports.UserValidation = {
    createUserValidationSchema,
    updateUserValidationSchema,
};
