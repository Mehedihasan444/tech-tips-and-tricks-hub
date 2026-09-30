import { Comment } from "./comment.model";
import { Post } from "../Post/post.model";
import { User } from "../User/user.model";
import { sendCommentNotification, sendReplyNotification } from "../../socket/socket";

import mongoose, { Types } from "mongoose";

const createCommentIntoDB = async (payload: any) => {
  if (payload.commentId) {
    const { commentId, data } = payload; // `data` contains new comment details

    // Step 1: Find the root comment or immediate parent comment using the postId or commentId
    const rootComment = await Comment.findOne({ postId: data.postId }).exec();

    if (!rootComment) {
      throw new Error("Root comment (post) not found");
    }

    // Step 2: Recursive function to find immediate parent comment
    const findImmediateParent = (
      parentComment: typeof rootComment,
      targetCommentId: Types.ObjectId
    ): typeof rootComment | null => {
      // Check if current comment is the immediate parent
      if (parentComment._id.toString() === targetCommentId.toString()) {
        return parentComment;
      }

      // Traverse the children to find the target parent comment
      if (parentComment?.children) {
        for (let child of parentComment?.children) {
          const foundComment = findImmediateParent(
            child as any,
            targetCommentId
          );
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
      _id: new mongoose.Types.ObjectId(),
      postId: data.postId, // The same postId as the root post
      commentText: data.commentText,
      commentUser: data.commentUser,
      createdAt: String(new Date()),
      children: [], // Initialize an empty array for future children
    };

    // Step 4: Push the new comment into the immediate parent's `children` array
    immediateParentComment.children?.push(newComment);

    // Save the updated root comment with nested comment embedded in `children`
    await rootComment.save();

    // Send reply notification to the immediate parent comment author
    try {
      // Find the commenter info for notification
      const commenter = await User.findById(data.commentUser);
      
      // Find the parent comment author (immediateParentComment has commentUser)
      const parentCommentUserId = (immediateParentComment as any).commentUser?.toString();
      
      if (parentCommentUserId && parentCommentUserId !== data.commentUser) {
        sendReplyNotification(
          {
            _id: data.commentUser,
            name: commenter?.name || commenter?.nickName || "Someone",
            profilePhoto: commenter?.profilePhoto || "",
          },
          parentCommentUserId,
          data.postId,
          newComment._id.toString()
        );
      }
    } catch (error) {
      console.error("Failed to send reply notification:", error);
    }

    return newComment;
  } else {
    // If there is no parent comment, just create the comment
    const result = await Comment.create(payload);
    
    // Send comment notification to post author
    try {
      const post = await Post.findById(payload.postId);
      const commenter = await User.findById(payload.commentUser);
      
      // Get the post author ID (it's a reference)
      const postAuthorId = post?.author?.toString();
      
      if (postAuthorId && postAuthorId !== payload.commentUser) {
        sendCommentNotification(
          {
            _id: payload.commentUser,
            name: commenter?.name || commenter?.nickName || "Someone",
            profilePhoto: commenter?.profilePhoto || "",
          },
          postAuthorId,
          payload.postId,
          result._id.toString()
        );
      }
    } catch (error) {
      console.error("Failed to send comment notification:", error);
    }
    
    return result;
  }
};

const getAllCommentsOfASinglePostFromDB = async (postId: string) => {
  try {
    const result = await Comment.find({ postId })
      .populate("commentUser")
      .populate({
        path: "children",
        populate: {
          path: "commentUser", // Populate commentUser for each child
        },
      });

    return result;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Could not retrieve comments from the database.");
  }
};

const getSingleCommentFromDB = async (commentId: string) => {
  const result = await Comment.findById(commentId)
    .populate("commentUser")
    .populate("children"); // Use commentUser for population
  return result;
};
const updateCommentInDB = async (payload: any) => {
  const commentId = payload.commentId;
  const commentData = { _id: new mongoose.Types.ObjectId(), ...payload.data };

  // Step 1: Check if the comment is a root-level comment and update it
  const isExist = await Comment.findById(commentId).exec();

  if (isExist) {
    const result = await Comment.findByIdAndUpdate(commentId, commentData, {
      new: true, // Return the updated comment
    });
    return result;
  } else {
    // Step 2: Find the root comment based on the postId if it's not a root-level comment
    const rootComment = await Comment.findOne({
      postId: commentData?.postId,
    }).exec();

    if (!rootComment) {
      throw new Error("Root comment (post) not found");
    }

    // Step 3: Recursive function to find and update the target comment
    const findAndUpdateComment = (
      parentComment: typeof rootComment,
      targetCommentId: string
    ): boolean => {
      if (parentComment.children && parentComment.children.length > 0) {
        for (let i = 0; i < parentComment.children.length; i++) {
          const child = parentComment.children[i];

          // If child matches the commentId, update it
          if (child && child._id && child._id.toString() === targetCommentId) {
            // Update fields of the child comment
            parentComment.children[i] = { ...commentData }; // Update comment data
            return true; // Found and updated
          }

          // Recursively check deeper children
          const isUpdated = findAndUpdateComment(child as any, targetCommentId);
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
    const result = await rootComment.save();

    return result;
  }
};

const deleteCommentFromDB = async (payload: {
  commentId: string; // Ensure commentId is a string (or ObjectId as required)
  postId: string;
}) => {
  const { commentId, postId } = payload;

  const isExist = await Comment.findById(commentId).exec();
  if (isExist) {
    const result = await Comment.findByIdAndDelete(commentId);
    return result;
  } else {
    // Step 1: Find the root comment based on the postId
    const rootComment = await Comment.findOne({ postId }).exec();

    if (!rootComment) {
      throw new Error("Root comment (post) not found");
    }
    // Step 2: Recursive function to find and delete the target comment
    const findAndDeleteComment = (
      parentComment: typeof rootComment,
      targetCommentId: string
    ): boolean => {
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
          const isDeleted = findAndDeleteComment(child as any, targetCommentId);
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
    const result = await rootComment.save();

    return result;
  }
};

export const CommentServices = {
  createCommentIntoDB,
  getAllCommentsOfASinglePostFromDB,
  getSingleCommentFromDB,
  updateCommentInDB,
  deleteCommentFromDB,
};
