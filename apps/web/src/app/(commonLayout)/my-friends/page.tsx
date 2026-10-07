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
          <Card key={friend.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xl font-semibold">{friend.name}</h4>
                  <p className="text-sm text-gray-500">{friend.profession}</p>
                </div>
              </div>
              <Chip
                className={`${isOnline(friend.id) ? "bg-success-100 dark:bg-success-500/20 text-success-600 dark:text-success-300" : "bg-gray-100 dark:bg-default-500/10 text-gray-600 dark:text-default-600"}`}
                size="sm"
              >
                {isOnline(friend.id) ? "Online" : "Offline"}
              </Chip>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Users className="text-gray-400" />
                <span className="text-sm text-gray-500">
                  {friend.followerCount} {friend.followerCount === 1 ? "follower" : "followers"}
                </span>
              </div>
              <Button
                size="sm"
                variant="flat"
                color="primary"
                onClick={() => onViewProfile(friend.nickName!)}
                disabled={!friend.nickName}
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

  useEffect(() => {
    const fetchFriends = async () => {
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
    };

    fetchFriends();
  }, []);

  const handleViewProfile = (nickName: string) => {
    if (nickName) {
      router.push(`/profile/${nickName}`);
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <Users className="text-3xl text-primary-fg" />
        <h1 className="text-3xl font-bold">My Friends</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-danger-50 text-danger rounded-lg">
          <p>{error}</p>
          <Button color="primary" className="mt-4" onClick={() => window.location.reload()}>
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
