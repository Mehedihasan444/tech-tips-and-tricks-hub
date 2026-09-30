import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FriendServices } from "./friends.services";

const getFriends = catchAsync(async (req, res) => {
    const result = await FriendServices.getFriendsFromDB(req.user);


    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Friends retrieved successfully",
        data: result,
    });
})


export const FriendController = {
    getFriends,
}