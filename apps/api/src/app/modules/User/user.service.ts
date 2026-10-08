import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { TImageFiles } from "../../interfaces/image.interface";
import { UserSearchableFields } from "./user.constant";
import { TUser, TUserData } from "./user.interface";
import { User } from "./user.model";
import mongoose from "mongoose";
import { sendFollowNotification } from "../../socket/socket";

const createUser = async (payload: TUser) => {
  const user = await User.create(payload);

  return user;
};

const updateUserFollowListAndFollowersListInDB = async (userId: string, payload: TUserData) => {
  if (payload.loggedInUserId) {
    const { loggedInUserId } = payload;

    // Convert userId and loggedInUserId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const loggedInUserObjectId = new mongoose.Types.ObjectId(loggedInUserId);

    // Retrieve the user and logged-in user's data to check if they are already following
    const user = await User.findById(userObjectId).populate("followers").populate("following");
    const loggedInUser = await User.findById(loggedInUserObjectId)
      .populate("followers")
      .populate("following");

    if (!user || !loggedInUser) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check if the loggedInUser is already in the followers list of user
    const isAlreadyFollowing = user.followers?.some((follower: any) =>
      follower._id.equals(loggedInUserObjectId),
    );

    // If the user is already being followed, we will remove the loggedInUserId from the followers list
    // Otherwise, we will add the loggedInUserId to the followers list
    const userToUpdate = await User.findByIdAndUpdate(
      userObjectId,
      isAlreadyFollowing
        ? { $pull: { followers: loggedInUserObjectId } } // Remove loggedInUserId from followers
        : { $addToSet: { followers: loggedInUserObjectId } }, // Add loggedInUserId to followers
      { returnDocument: "after" },
    );

    // Similarly, check if userId is in the loggedInUser's following list
    const isUserInFollowingList = loggedInUser.following?.some((follow: any) =>
      follow._id.equals(userObjectId),
    );

    // If already following, remove the userId from the following list
    // Otherwise, add userId to the following list
    const loggedInUserToUpdate = await User.findByIdAndUpdate(
      loggedInUserObjectId,
      isUserInFollowingList
        ? { $pull: { following: userObjectId } } // Remove userId from following
        : { $addToSet: { following: userObjectId } }, // Add userId to following
      { returnDocument: "after" },
    );

    // Send follow notification if this is a new follow (not unfollow)
    if (!isAlreadyFollowing && loggedInUser) {
      try {
        sendFollowNotification(
          {
            _id: loggedInUserId,
            name: loggedInUser.name || loggedInUser.nickName || "Someone",
            profilePhoto: loggedInUser.profilePhoto || "",
          },
          userId, // The user being followed receives notification
        );
      } catch (error) {
        // Don't fail the follow operation if notification fails
        console.error("Failed to send follow notification:", error);
      }
    }

    return { userToUpdate, loggedInUserToUpdate };
  } else {
    const result = await User.findByIdAndUpdate(userId, payload, { returnDocument: "after" });

    return result;
  }
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const users = new QueryBuilder(
    User.find()
      .populate("followers") // Fully populates the 'followers' field with complete User documents
      .populate("following"),
    query,
  )
    .fields()
    .paginate()
    .sort()
    .filter()
    .search(UserSearchableFields);

  const result = await users.modelQuery;
  // Count with the same filter/search so pageCount is correct when filtering.
  const totalUsers = await User.countDocuments(users.modelQuery.getFilter());
  // Calculate the page count
  const limit = Number(query?.limit) || 10;
  const pageCount = Math.ceil(totalUsers / limit);

  if (query?.page || query?.limit) {
    return {
      data: result,
      pageCount,
      currentPage: Number(query?.page) || 1,
    };
  } else {
    return result;
  }
};

const getSingleUserFromDB = async (nickName: string) => {
  const user = await User.findOne({ nickName }).populate("followers").populate("following");

  return user;
};

const deleteUserFromDB = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.role === "ADMIN") {
    throw new AppError(httpStatus.FORBIDDEN, "You can not delete an admin user");
  }
  const result = await User.findByIdAndDelete(userId);
  return result;
};
const updateProfilePhoto = async (payload: Record<string, unknown>, image: TImageFiles) => {
  const file = (image as unknown as { image?: { path?: string }[] })?.image?.[0];
  if (!file?.path) throw new AppError(httpStatus.BAD_REQUEST, "No profile picture found");
  const result = await User.findByIdAndUpdate(
    payload?.userId,
    { profilePhoto: file.path },
    { returnDocument: "after" },
  );
  if (!result) throw new AppError(httpStatus.NOT_FOUND, "User not found");
  return result;
};

export const UserServices = {
  createUser,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserFollowListAndFollowersListInDB,
  deleteUserFromDB,
  updateProfilePhoto,
};
