import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import { User } from "../User/user.model";
import { TStory } from "./story.interface";
import { Story } from "./story.model";

// Create a new story
const createStory = async (image: any, user: JwtPayload) => {
  // Check if user exists
  const userData = await User.findById(user._id);
  if (!userData) {
    throw new AppError(404, "User not found");
  }

  // Calculate expiry time (24 hours from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  // Create story object
  const storyData: Partial<TStory> = {
    userId: new Types.ObjectId(user._id),
    username: userData.name,
    userImage: userData.profilePhoto,
    imageUrl: image.path,
    timestamp: new Date(),
    expiresAt,
    isActive: true,
  };

  // Save to database
  const result = await Story.create(storyData);
  return result;
};

// Get all active stories of user and stories of users they follow
const getAllStories = async (user: JwtPayload) => {
  // Get all active stories
  const stories = await Story.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean();
  // Get user's following list
  const userFriend = await User.findById(user._id).populate("following");

  const userFriendIds = userFriend?.following?.map((friend) => friend);

  // Get stories from friends in a single query
  const friendStories = userFriendIds && userFriendIds.length > 0
    ? await Story.find({
      userId: { $in: userFriendIds },
      isActive: true
    }).lean()
    : [];

  // Get user's own stories
  const userStories = await Story.find({
    userId: new Types.ObjectId(user._id),
    isActive: true
  }).lean();

  // Combine both sets of stories
  const filteredStories = [...userStories, ...friendStories];

  // Format the stories for client consumption
  const formattedStories = filteredStories.map((story) => {  // Changed from stories.map to filteredStories.map
    // Calculate time difference
    const now = new Date();
    const storyTime = new Date(story.timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - storyTime.getTime()) / (1000 * 60 * 60)
    );

    let timeAgo;
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - storyTime.getTime()) / (1000 * 60)
      );
      timeAgo = `${diffInMinutes}m ago`;
    } else {
      timeAgo = `${diffInHours}h ago`;
    }

    return {
      id: story._id.toString(),
      userId: story.userId.toString(),
      username: story.username,
      userImage: story.userImage,
      imageUrl: story.imageUrl,
      timestamp: timeAgo,
    };
  });

  return formattedStories;
};

// Get stories by user ID
const getStoriesByUserId = async (userId: string) => {
  const stories = await Story.find({
    userId: new Types.ObjectId(userId),
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  // Format the stories for client consumption
  const formattedStories = stories.map((story) => {
    // Calculate time difference
    const now = new Date();
    const storyTime = new Date(story.timestamp);
    const diffInHours = Math.floor(
      (now.getTime() - storyTime.getTime()) / (1000 * 60 * 60)
    );

    let timeAgo;
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - storyTime.getTime()) / (1000 * 60)
      );
      timeAgo = `${diffInMinutes}m ago`;
    } else {
      timeAgo = `${diffInHours}h ago`;
    }

    return {
      id: story._id.toString(),
      userId: story.userId.toString(),
      username: story.username,
      userImage: story.userImage,
      imageUrl: story.imageUrl,
      timestamp: timeAgo,
    };
  });

  return formattedStories;
};

// Delete a story
const deleteStory = async (id: string, user: JwtPayload) => {
  const story = await Story.findById(id);

  if (!story) {
    throw new AppError(404, "Story not found");
  }

  // Check if the user is the owner of the story
  if (story.userId.toString() !== user._id) {
    throw new AppError(403, "You are not authorized to delete this story");
  }

  const result = await Story.findByIdAndDelete(id);
  return result;
};

export const StoryService = {
  createStory,
  getAllStories,
  getStoriesByUserId,
  deleteStory,
};