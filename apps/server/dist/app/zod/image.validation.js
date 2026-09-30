"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageFilesArrayZodSchema = void 0;
const zod_1 = require("zod");
const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "png",
    "jpeg",
    "jpg",
];
const ImageFileZodSchema = zod_1.z.object({
    fieldname: zod_1.z.string(),
    originalname: zod_1.z.string(),
    encoding: zod_1.z.string(),
    mimetype: zod_1.z.enum(ACCEPTED_FILE_TYPES),
    path: zod_1.z.string(),
    size: zod_1.z
        .number()
        .refine((size) => size <= MAX_UPLOAD_SIZE, "File size must be less than 3MB"),
    filename: zod_1.z.string(),
});
// export const ImageFilesArrayZodSchema = z.object({
//   files: z.record(z.string(), z.array(ImageFileZodSchema))
//   .refine((files) => {
//     return Object.keys(files).length > 0;
//   }, "Image is required"),
// });
exports.ImageFilesArrayZodSchema = zod_1.z.object({
    files: zod_1.z.record(zod_1.z.string(), zod_1.z.array(ImageFileZodSchema).optional()).optional(),
})
    .refine((data) => {
    // Check if `files` is provided and has at least one image
    if (data === null || data === void 0 ? void 0 : data.files) {
        const imageField = data.files['postImages'];
        if (imageField && imageField.length > 0) {
            return true; // Images are present
        }
    }
    // If no images are provided, allow it as valid if updating without images
    return true; // Images are optional for updates
}, 'At least one image must be provided, or none for an update.');
