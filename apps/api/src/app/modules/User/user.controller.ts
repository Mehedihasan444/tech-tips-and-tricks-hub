import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { getRouteParam } from "../../utils/getRouteParam";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";
import AppError from "../../errors/AppError";
import { TImageFiles } from "../../interfaces/image.interface";

const userRegister = catchAsync(async (req, res) => {
  const user = await UserServices.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Created Successfully",
    data: user,
  });
});
const updateUserFollowListAndFollowersList = catchAsync(async (req, res) => {
  const id = getRouteParam(req.params.id, "id");
  if (!id && !req.body) {
    throw new AppError(400, "Something went wrong");
  }
  const caller = (req as unknown as { user?: { _id?: string; role?: string } }).user;
  const body = { ...(req.body ?? {}) } as Record<string, unknown>;
  if (caller?.role !== "ADMIN") {
    // Follow/unfollow flow: callers may only act as themselves.
    if (body.loggedInUserId && body.loggedInUserId !== caller?._id) {
      throw new AppError(httpStatus.FORBIDDEN, "You can only follow as yourself");
    }
    // Profile updates: users may only update their own document,
    // and never escalate privilege via role/status/premium/password.
    if (!body.loggedInUserId && id !== caller?._id) {
      throw new AppError(httpStatus.FORBIDDEN, "You can only update your own profile");
    }
    if (!body.loggedInUserId) {
      delete body.role;
      delete body.status;
      delete body.isPremium;
      delete body.password;
    }
  }
  const updatedUser = await UserServices.updateUserFollowListAndFollowersListInDB(id, body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: updatedUser,
  });
});
const getAllUsers = catchAsync(async (req, res) => {
  const users = await UserServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users Retrieved Successfully",
    data: users,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const nickName = getRouteParam(req.params.nickName, "nickName");
  const user = await UserServices.getSingleUserFromDB(nickName);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Retrieved Successfully",
    data: user,
  });
});
const deleteUser = catchAsync(async (req, res) => {
  const id = getRouteParam(req.params.id, "id");
  await UserServices.deleteUserFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted successfully",
    data: null,
  });
});
const updateProfilePhoto = catchAsync(async (req, res) => {
  if (!req.files) {
    throw new AppError(400, "No profile picture found");
  }
  const caller = (req as unknown as { user?: { _id?: string; role?: string } }).user;
  // Users may only change their own avatar; admins may specify any userId.
  const body = caller?.role !== "ADMIN" ? { ...req.body, userId: caller?._id } : req.body;
  if (!body?.userId) throw new AppError(400, "userId is required");
  await UserServices.updateProfilePhoto(body, req.files as TImageFiles);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile picture updated successfully",
    data: null,
  });
});

export const UserControllers = {
  getSingleUser,
  userRegister,
  getAllUsers,
  updateUserFollowListAndFollowersList,
  deleteUser,
  updateProfilePhoto,
};
