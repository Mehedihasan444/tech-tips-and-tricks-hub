/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from 'react';
import { Card, Avatar, Button, Chip } from '@nextui-org/react';
import { Users } from "lucide-react";
import { getFriends } from '@/services/FriendsService';
import EmptyState from '@/components/ui/EmptyState';
import { useRouter } from 'next/navigation';
import { UserCardSkeleton } from '@/components/ui/Skeleton';

// Define the Friend type
interface Friend {
    id: string;
    name: string;
    status: string;
    avatar: string;
    profession: string;
    mutualFriends: number;
}

const MyFriendsPage = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                setLoading(true);
                const response = await getFriends();
                console.log(response);
                
                // getFriends returns { success, data } from axios
                if (response?.success && response?.data) {
                    // Transform the data to match the Friend interface
                    const friendsData = response.data.map((friend: any) => ({
                        id: friend._id,
                        name: friend.name || friend.nickName || 'Unknown',
                        status: 'Offline', // You can implement online status check
                        avatar: friend.profilePhoto || `https://i.pravatar.cc/150?u=${friend._id}`,
                        profession: friend.bio || 'Tech Enthusiast',
                        mutualFriends: friend.followers?.length || 0
                    }));
                    setFriends(friendsData);
                    setError(null);
                } else {
                    setFriends([]);
                }
            } catch (err) {
                console.error('Error fetching friends:', err);
                setError('Failed to load friends. Please try again later.');
                setFriends([]);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, []);

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
                <Users className="text-3xl text-primary" />
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
                    <Button 
                        color="primary" 
                        className="mt-4"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </Button>
                </div>
            ) : friends.length === 0 ? (
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {friends.map(friend => (
                                <Card key={friend.id} className="p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar
                                                src={friend.avatar}
                                                className="w-16 h-16"
                                                alt={friend.name}
                                            />
                                            <div>
                                                <h4 className="text-xl font-semibold">{friend.name}</h4>
                                                <p className="text-sm text-gray-500">{friend.profession}</p>
                                            </div>
                                        </div>
                                        <Chip
                                            className={`${friend.status === 'Online' ? 'bg-success-100 text-success-600' : 'bg-gray-100 text-gray-600'}`}
                                            size="sm"
                                        >
                                            {friend.status}
                                        </Chip>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-2">
                                            <Users className="text-gray-400" />
                                            <span className="text-sm text-gray-500">
                                                {friend.mutualFriends} mutual friends
                                            </span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="flat"
                                            color="primary"
                                            href={`/profile/${friend.id}`}
                                        >
                                            View Profile
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
        </div>
    );
};

export default MyFriendsPage;