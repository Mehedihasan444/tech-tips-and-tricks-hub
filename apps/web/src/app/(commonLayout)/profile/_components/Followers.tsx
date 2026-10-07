"use client";
import { useUser } from "@/context/user.provider";
import { useUpdateUser } from "@/hooks/user.hook";
import { IUser } from "@/types/IUser";
import { TPost } from "@/types/TPost";
import { useChatManager } from "@/components/ui/ChatManager";
import { Button } from "@heroui/react";
import { MessageCircle } from "lucide-react";
import React from "react";

const Followers = ({ user, posts }: { user: IUser; posts: TPost[] }) => {
  const { user: loggedInUser } = useUser();
  const { mutate: handleUserUpdate, isPending: isFollowPending } = useUpdateUser();
  const { openChat } = useChatManager();

  const followerEntry =
    !loggedInUser?._id || !user
      ? undefined
      : user?.followers?.find((i) => i._id === loggedInUser._id);
  const isFollower = Boolean(followerEntry);

  const handleFollowAndUnfollow = () => {
    if (!loggedInUser) return; // Ensure loggedInUser is not null
    const userData = {
      loggedInUserId: loggedInUser._id,
    };
    handleUserUpdate({ userId: user._id, userData });
  };

  const handleStartChat = () => {
    if (!user) return;
    openChat({
      _id: user._id,
      name: user.name,
      profilePhoto: user.profilePhoto || "",
      nickName: user.nickName,
    });
  };

  return (
    <div className=" p-6  flex justify-between items-center flex-1 gap-5 text-center ">
      <div className="flex flex-col items-center justify-center">
        <p>{posts?.length}</p>
        <h2 className="text-lg font-semibold ">Posts</h2>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p>{user?.followers?.length || 0} </p>
        <h2 className="text-lg font-semibold ">Followers</h2>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p>{user?.following?.length || 0}</p>
        <h2 className="text-lg font-semibold ">Following</h2>
      </div>
      <div className="sm:ml-5 flex gap-2">
        {loggedInUser?.nickName !== user?.nickName ? (
          <>
            <Button
              color="secondary"
              variant="flat"
              onPress={handleFollowAndUnfollow}
              isLoading={isFollowPending}
              isDisabled={isFollowPending || !loggedInUser}
              aria-pressed={isFollower}
              aria-label={
                isFollower
                  ? `Unfollow ${user?.name ?? "this user"}`
                  : `Follow ${user?.name ?? "this user"}`
              }
              className="px-4 py-2 font-medium"
            >
              {isFollower ? "Following" : "Follow"}
            </Button>
            <Button
              isIconOnly
              color="primary"
              variant="flat"
              onPress={handleStartChat}
              aria-label="Send message"
            >
              <MessageCircle size={18} />
            </Button>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Followers;
