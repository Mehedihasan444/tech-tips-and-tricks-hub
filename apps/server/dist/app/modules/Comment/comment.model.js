"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
// Define the schema for the embedded child comments
let childCommentSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true }, // Define _id explicitly
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true },
    commentText: { type: String, required: true },
    commentUser: {
        type: {
            name: String,
            photo: String,
            nickName: String,
        },
        required: true,
    },
    createdAt: { type: String, required: true },
});
childCommentSchema.add({ children: [childCommentSchema] });
// Define the main comment schema
let commentSchema = new mongoose_1.Schema({
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Post", required: true },
    commentText: { type: String, required: true },
    commentUser: {
        type: {
            name: String,
            photo: String,
            nickName: String,
        },
        required: true,
    },
    createdAt: { type: String, required: true },
    children: [{ type: childCommentSchema, default: [] }],
}, {
    timestamps: true,
});
// // Export the model
exports.Comment = (0, mongoose_1.model)("Comment", commentSchema);
