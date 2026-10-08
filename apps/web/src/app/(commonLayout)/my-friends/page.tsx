/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Card, Avatar, Button, Chip, Divider } from "@heroui/react";
import { Users, UserPlus } from "lucide-react";
import { getFriends } from "@/services/FriendsService";
import EmptyState from "@/components/ui/EmptyState";
import { useRouter } from "next/navigation";
import { UserCardSkeleton } from "@/components/ui/Skeleton";
import { useSocket } from "@/context/socket.provider";

// Define the Friend type as returned by the API
interface APIFriend {
  _id: string;
  nickName?: string;
  name: string;
  profilePhoto?: string;
  bio?: string;
  followers?: any[];
}

interface Friend {
  id: string;
  nickName?: string;
  name: string;
  avatar: string;
  profession: string;
  followerCount: number;
}

const transformFriend = (friend: APIFriend): Friend => ({
  id: friend._id,
  nickName: friend.nickName,
  name: friend.name || friend.nickName || "Unknown",
  avatar: friend.profilePhoto || "",
  profession: friend.bio || "Tech Enthusiast",
  followerCount: friend.followers?.length || 0,
});

const FriendsSection = ({
  title,
  friends,
  isOnline,
  onViewProfile,
}: {
  title: string;
  friends: Friend[];
  isOnline: (id: string) => boolean;
  onViewProfile: (nickName: string) => void;
}) => {
  if (friends.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <span className="text-sm text-default-500">({friends.length})</span>
      </div>
      <Divider className="my-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends.map((friend) => (
          <Card key={friend.id} className="surface p-6 transition-shadow hover:shadow-lg">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar
                  src={friend.avatar || undefined}
                  name={friend.name?.trim() ? friend.name : "?"}
                  className="h-16 w-16"
                />
                <div>
                  <h4 className="text-xl font-semibold">{friend.name}</h4>
                  <p className="line-clamp-2 text-sm text-default-500">{friend.profession}</p>
                </div>
              </div>
              <Chip color={isOnline(friend.id) ? "success" : "default"} variant="flat" size="sm">
                {isOnline(friend.id) ? "Online" : "Offline"}
              </Chip>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-default-400" aria-hidden="true" />
                <span className="text-sm text-default-500">
                  {friend.followerCount} {friend.followerCount === 1 ? "follower" : "followers"}
                </span>
              </div>
              <Button
                size="sm"
                variant="flat"
                color="primary"
                onPress={() => friend.nickName && onViewProfile(friend.nickName)}
                isDisabled={!friend.nickName}
              >
                View Profile
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const MyFriendsPage = () => {
  const [following, setFollowing] = useState<Friend[]>([]);
  const [followers, setFollowers] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { onlineUsers } = useSocket();

  const isOnline = (id: string) => onlineUsers.includes(id);

  const fetchFriends = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await getFriends();

      if (response?.success && response?.data) {
        // API returns { following: [...], followers: [...] }
        const followingData = (response.data.following || []).map(transformFriend);
        const followersData = (response.data.followers || []).map(transformFriend);

        setFollowing(followingData);
        setFollowers(followersData);
        setError(null);
      } else {
        setFollowing([]);
        setFollowers([]);
      }
    } catch (err) {
      console.error("Error fetching friends:", err);
      setError("Failed to load friends. Please try again later.");
      setFollowing([]);
      setFollowers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFriends();
  }, [fetchFriends]);

  const handleViewProfile = (nickName: string) => {
    if (nickName) {
      router.push(`/profile/${nickName}`);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary-fg">
          <Users size={22} aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Friends</h1>
          <p className="text-sm text-default-500">People you follow and who follow you.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg bg-danger-50 p-8 text-center text-danger">
          <p>{error}</p>
          <Button color="primary" className="mt-4" onPress={() => void fetchFriends()}>
            Try Again
          </Button>
        </div>
      ) : following.length === 0 && followers.length === 0 ? (
        <div className="bg-content1 rounded-2xl border border-divider">
          <EmptyState
            type="friends"
            title="No Friends Yet"
            description="Start connecting with people who share your interests! Find and follow users to build your network."
            actionLabel="Discover People"
            onAction={() => router.push("/community")}
          />
        </div>
      ) : (
        <div className="space-y-8">
          <FriendsSection
            title="Following"
            friends={following}
            isOnline={isOnline}
            onViewProfile={handleViewProfile}
          />
          <FriendsSection
            title="Followers"
            friends={followers}
            isOnline={isOnline}
            onViewProfile={handleViewProfile}
          />
        </div>
      )}
    </div>
  );
};

export default MyFriendsPage;
