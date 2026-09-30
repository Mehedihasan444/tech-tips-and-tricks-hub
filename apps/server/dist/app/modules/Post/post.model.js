"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const post_constant_1 = require("./post.constant");
const PostSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
    },
    category: {
        type: String,
        required: true,
        enum: post_constant_1.postCategories,
    },
    tags: {
        type: [String],
        required: true,
        enum: post_constant_1.postTags,
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User", // Assuming you have a user model
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        default: "PUBLISHED",
    },
    isPremium: {
        type: Boolean,
        required: true
        // default: false,
    },
}, {
    timestamps: true,
});
exports.Post = (0, mongoose_1.model)("Post", PostSchema);
