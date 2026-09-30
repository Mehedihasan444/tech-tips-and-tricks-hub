import { JwtPayload } from "jsonwebtoken"
import { User } from "../User/user.model"



const getFriendsFromDB = async (user: JwtPayload) => {
    const friends = await User.findById(user._id).populate("following").populate("followers")
    
    return {
        following: friends?.following,
        followers: friends?.followers
    }
}

export const FriendServices = {
    getFriendsFromDB
}