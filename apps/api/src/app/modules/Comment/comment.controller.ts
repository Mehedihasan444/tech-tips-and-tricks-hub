import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CommentServices } from "./comment.service";

const createComment = catchAsync(async (req, res) => {
  const user = await CommentServices.createCommentIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment Created Successfully",
    data: user,
  });
});
const getAllCommentsOfASinglePost = catchAsync(async (req, res) => {
  const postId = req.query.postId as string;
  if (!postId) {
    throw new Error("provide postId");
  }
  const comments = await CommentServices.getAllCommentsOfASinglePostFromDB(
    postId
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comments Retrieved Successfully",
    data: comments,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  await CommentServices.deleteCommentFromDB(
    req.query as { commentId: string; postId: string }
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment deleted successfully",
    data: null,
  });
});
const updateComment = catchAsync(async (req, res) => {
  const updatedComment = await CommentServices.updateCommentInDB(req.body); // Use req.body for payload

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment updated successfully",
    data: updatedComment,
  });
});

const getSingleComment = catchAsync(async (req, res) => {
  const comment = await CommentServices.getSingleCommentFromDB(req.params.id); // Use req.params.id instead of nickName

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Comment Retrieved Successfully",
    data: comment,
  });
});

export const CommentControllers = {
  getSingleComment,
  createComment,
  getAllCommentsOfASinglePost,
  deleteComment,
  updateComment,
};
