"use client";
import React from 'react';
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Chip } from '@nextui-org/react';
import { Bookmark, Heart, MessageCircle, Share2 } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { useRouter } from 'next/navigation';

const SavedPosts = () => {
    const router = useRouter();
    // This would normally come from an API/state
    const savedPosts: {
        id: number;
        title: string;
        content: string;
        author: { name: string; avatar: string; role: string };
        category: string;
        likes: number;
        comments: number;
        saved: boolean;
        timestamp: string;
    }[] = [];  // Empty array to show empty state

    return (
        <div className=" p-4 ">


            <div className="flex items-center gap-3 mb-8">
                <Bookmark className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold">Saved Posts</h1>
            </div>

            {savedPosts.length === 0 ? (
                <div className="bg-content1 rounded-2xl border border-divider">
                    <EmptyState
                        type="bookmarks"
                        title="No Saved Posts"
                        description="Save posts you want to read later by clicking the bookmark icon. They'll appear here for easy access."
                        actionLabel="Explore Posts"
                        onAction={() => router.push("/")}
                    />
                </div>
            ) : (
                <div className="grid gap-6">
                    {savedPosts.map((post) => (
                        <Card key={post.id} className="hover:shadow-lg transition-shadow p-4">
                            <CardHeader className="flex gap-4">
                                <Avatar src={post.author.avatar} size="lg" />
                                <div className="flex flex-col flex-grow">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-lg font-semibold">{post.author.name}</p>
                                            <p className="text-small text-default-500">{post.author.role}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Chip size="sm" color="primary">{post.category}</Chip>
                                            <span className="text-small text-default-500">{post.timestamp}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardBody>
                                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                                <p className="text-default-500">{post.content}</p>
                            </CardBody>
                            <CardFooter className="flex justify-between">
                                <div className="flex gap-6">
                                    <Button
                                        variant="light"
                                        startContent={<Heart size={20} />}
                                    >
                                        {post.likes}
                                    </Button>
                                    <Button
                                        variant="light"
                                        startContent={<MessageCircle size={20} />}
                                    >
                                        {post.comments}
                                    </Button>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="flat"
                                        color="primary"
                                        startContent={<Share2 size={20} />}
                                    >
                                        Share
                                    </Button>
                                    <Button
                                        variant="solid"
                                        color="primary"
                                        startContent={<Bookmark size={20} />}
                                    >
                                        Saved
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>


    );
};

export default SavedPosts;