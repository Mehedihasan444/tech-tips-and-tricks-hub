"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentServices = void 0;
const comment_model_1 = require("./comment.model");
const post_model_1 = require("../Post/post.model");
const user_model_1 = require("../User/user.model");
const socket_1 = require("../../socket/socket");
const mongoose_1 = __importDefault(require("mongoose"));
const createCommentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (payload.commentId) {
        const { commentId, data } = payload; // `data` contains new comment details
        // Step 1: Find the root comment or immediate parent comment using the postId or commentId
        const rootComment = yield comment_model_1.Comment.findOne({ postId: data.postId }).exec();
        if (!rootComment) {
            throw new Error("Root comment (post) not found");
        }
        // Step 2: Recursive function to find immediate parent comment
        const findImmediateParent = (parentComment, targetCommentId) => {
            // Check if current comment is the immediate parent
            if (parentComment._id.toString() === targetCommentId.toString()) {
                return parentComment;
            }
            // Traverse the children to find the target parent comment
            if (parentComment === null || parentComment === void 0 ? void 0 : parentComment.children) {
                for (let child of parentComment === null || parentComment === void 0 ? void 0 : parentComment.children) {
                    const foundComment = findImmediateParent(child, targetCommentId);
                    if (foundComment) {
                        return foundComment;
                    }
                }
            }
            return null;
        };
        // Find the immediate parent comment in the nested structure
        const immediateParentComment = findImmediateParent(rootComment, commentId);
        if (!immediateParentComment) {
            throw new Error("Immediate parent comment not found");
        }
        // Step 3: Create the new comment object (to be embedded in the children array)
        const newComment = {
            _id: new mongoose_1.default.Types.ObjectId(),
            postId: data.postId, // The same postId as the root post
            commentText: data.commentText,
            commentUser: data.commentUser,
            createdAt: String(new Date()),
            children: [], // Initialize an empty array for future children
        };
        // Step 4: Push the new comment into the immediate parent's `children` array
        (_a = immediateParentComment.children) === null || _a === void 0 ? void 0 : _a.push(newComment);
        // Save the updated root comment with nested comment embedded in `children`
        yield rootComment.save();
        // Send reply notification to the immediate parent comment author
        try {
            // Find the commenter info for notification
            const commenter = yield user_model_1.User.findById(data.commentUser);
            // Find the parent comment author (immediateParentComment has commentUser)
            const parentCommentUserId = (_b = immediateParentComment.commentUser) === null || _b === void 0 ? void 0 : _b.toString();
            if (parentCommentUserId && parentCommentUserId !== data.commentUser) {
                (0, socket_1.sendReplyNotification)({
                    _id: data.commentUser,
                    name: (commenter === null || commenter === void 0 ? void 0 : commenter.name) || (commenter === null || commenter === void 0 ? void 0 : commenter.nickName) || "Someone",
                    profilePhoto: (commenter === null || commenter === void 0 ? void 0 : commenter.profilePhoto) || "",
                }, parentCommentUserId, data.postId, newComment._id.toString());
            }
        }
        catch (error) {
            console.error("Failed to send reply notification:", error);
        }
        return newComment;
    }
    else {
        // If there is no parent comment, just create the comment
        const result = yield comment_model_1.Comment.create(payload);
        // Send comment notification to post author
        try {
            const post = yield post_model_1.Post.findById(payload.postId);
            const commenter = yield user_model_1.User.findById(payload.commentUser);
            // Get the post author ID (it's a reference)
            const postAuthorId = (_c = post === null || post === void 0 ? void 0 : post.author) === null || _c === void 0 ? void 0 : _c.toString();
            if (postAuthorId && postAuthorId !== payload.commentUser) {
                (0, socket_1.sendCommentNotification)({
                    _id: payload.commentUser,
                    name: (commenter === null || commenter === void 0 ? void 0 : commenter.name) || (commenter === null || commenter === void 0 ? void 0 : commenter.nickName) || "Someone",
                    profilePhoto: (commenter === null || commenter === void 0 ? void 0 : commenter.profilePhoto) || "",
                }, postAuthorId, payload.postId, result._id.toString());
            }
        }
        catch (error) {
            console.error("Failed to send comment notification:", error);
        }
        return result;
    }
});
const getAllCommentsOfASinglePostFromDB = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield comment_model_1.Comment.find({ postId })
            .populate("commentUser")
            .populate({
            path: "children",
            populate: {
                path: "commentUser", // Populate commentUser for each child
            },
        });
        return result;
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        throw new Error("Could not retrieve comments from the database.");
    }
});
const getSingleCommentFromDB = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_model_1.Comment.findById(commentId)
        .populate("commentUser")
        .populate("children"); // Use commentUser for population
    return result;
});
const updateCommentInDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = payload.commentId;
    const commentData = Object.assign({ _id: new mongoose_1.default.Types.ObjectId() }, payload.data);
    // Step 1: Check if the comment is a root-level comment and update it
    const isExist = yield comment_model_1.Comment.findById(commentId).exec();
    if (isExist) {
        const result = yield comment_model_1.Comment.findByIdAndUpdate(commentId, commentData, {
            new: true, // Return the updated comment
        });
        return result;
    }
    else {
        // Step 2: Find the root comment based on the postId if it's not a root-level comment
        const rootComment = yield comment_model_1.Comment.findOne({
            postId: commentData === null || commentData === void 0 ? void 0 : commentData.postId,
        }).exec();
        if (!rootComment) {
            throw new Error("Root comment (post) not found");
        }
        // Step 3: Recursive function to find and update the target comment
        const findAndUpdateComment = (parentComment, targetCommentId) => {
            if (parentComment.children && parentComment.children.length > 0) {
                for (let i = 0; i < parentComment.children.length; i++) {
                    const child = parentComment.children[i];
                    // If child matches the commentId, update it
                    if (child && child._id && child._id.toString() === targetCommentId) {
                        // Update fields of the child comment
                        parentComment.children[i] = Object.assign({}, commentData); // Update comment data
                        return true; // Found and updated
                    }
                    // Recursively check deeper children
                    const isUpdated = findAndUpdateComment(child, targetCommentId);
                    if (isUpdated) {
                        return true;
                    }
                }
            }
            return false; // Comment not found in this level
        };
        // Step 4: Try to update the nested comment
        const isUpdated = findAndUpdateComment(rootComment, commentId);
        if (!isUpdated) {
            throw new Error("Comment not found or already updated");
        }
        // Step 5: Save the updated root comment with the nested comment updated
        const result = yield rootComment.save();
        return result;
    }
});
const deleteCommentFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId, postId } = payload;
    const isExist = yield comment_model_1.Comment.findById(commentId).exec();
    if (isExist) {
        const result = yield comment_model_1.Comment.findByIdAndDelete(commentId);
        return result;
    }
    else {
        // Step 1: Find the root comment based on the postId
        const rootComment = yield comment_model_1.Comment.findOne({ postId }).exec();
        if (!rootComment) {
            throw new Error("Root comment (post) not found");
        }
        // Step 2: Recursive function to find and delete the target comment
        const findAndDeleteComment = (parentComment, targetCommentId) => {
            // Traverse through the children to find the target comment
            if (parentComment.children && parentComment.children.length > 0) {
                for (let i = 0; i < parentComment.children.length; i++) {
                    const child = parentComment.children[i];
                    // If child matches the commentId, remove it from children
                    if (child && child._id && child._id.toString() === targetCommentId) {
                        //+
                        parentComment.children.splice(i, 1); // Remove the child
                        return true; // Found and deleted
                    }
                    // Recursively check in deeper children
                    const isDeleted = findAndDeleteComment(child, targetCommentId);
                    if (isDeleted) {
                        return true;
                    }
                }
            }
            return false; // Comment not found in this level
        };
        // Step 3: Try to delete the comment
        const isDeleted = findAndDeleteComment(rootComment, commentId);
        if (!isDeleted) {
            throw new Error("Comment not found or already deleted");
        }
        // Step 4: Save the updated root comment with the deleted comment removed
        const result = yield rootComment.save();
        return result;
    }
});
exports.CommentServices = {
    createCommentIntoDB,
    getAllCommentsOfASinglePostFromDB,
    getSingleCommentFromDB,
    updateCommentInDB,
    deleteCommentFromDB,
};
