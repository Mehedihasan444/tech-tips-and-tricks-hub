import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { StoryService } from "./story.service";
import { RequestHandler } from "express";

// Create a new story
const createStory = catchAsync(async (req, res) => {
  // console.log(Array.isArray(req.files) ? req.files : req.files?.['image'][0], "files")

  const image = Array.isArray(req.files) ? req.files : req.files?.['image'][0]

  const result = await StoryService.createStory(image, req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Story created successfully",
    data: result,
  });
});

// Get user stories and stories of users they follow
const getAllStories = catchAsync(async (req, res) => {
  const result = await StoryService.getAllStories(req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Stories retrieved successfully",
    data: result,
  });
});

// Get stories by user ID
const getStoriesByUserId: RequestHandler = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await StoryService.getStoriesByUserId(userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User stories retrieved successfully",
    data: result,
  });
});

// Delete a story
const deleteStory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StoryService.deleteStory(id, req.user);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Story deleted successfully",
    data: result,
  });
});

export const StoryController = {
  createStory,
  getAllStories,
  getStoriesByUserId,
  deleteStory,
};