import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TImageFiles } from "../../interfaces/image.interface";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PostServices } from "./post.service";

const createPost = catchAsync(async (req, res) => {
  let post;
  if (!req.files) {

     post = await PostServices.createPostIntoDB(
      req.body,null
    );
  }else{

     post = await PostServices.createPostIntoDB(
      req.body,
      req.files as TImageFiles
    );
  }


  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post created successfully",
    data: post,
  });
});
const updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;

  const updatedPost = await PostServices.updatePostInDB(
    id,
    req.body,
    req.files as TImageFiles
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post updated successfully",
    data: updatedPost,
  });
});
const getAllPosts = catchAsync(async (req, res) => {
  const post = await PostServices.getAllPostsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post retrieved successfully",
    data: post,
  });
});

const getPost = catchAsync(async (req, res) => {
  const postId = req.params.id;
  const post = await PostServices.getPostFromDB(postId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post retrieved successfully",
    data: post,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  await PostServices.deletePostFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Post deleted successfully",
    data: null,
  });
});

export const postControllers = {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
};
