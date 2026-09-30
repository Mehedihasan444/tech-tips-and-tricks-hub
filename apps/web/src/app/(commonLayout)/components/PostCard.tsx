/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Divider, Link, Tooltip, Avatar, Badge } from "@nextui-org/react";
import { ThumbsDown, ThumbsUp, Share2, MessageCircle, Bookmark, Clock, Crown, TrendingUp, MoreVertical, Eye } from "lucide-react";
import React, { useEffect, useState } from "react";
import MediaGallery from "./MediaGallery";
import parse from "html-react-parser";
import { useUpdatePost } from "@/hooks/post.hook";
import { useUser } from "@/context/user.provider";
import { useRouter } from "next/navigation";
import Message from "./message/Message";
import { toast } from "sonner";
import { getAllCommentsOfASinglePost } from "@/services/CommentService";
import { IUser } from "@/types/IUser";
import { formatDistanceToNow } from 'date-fns';
import { useSocket } from "@/context/socket.provider";

const CHARACTER_LIMIT = 300;

const PostCard = ({ post }: { post: any }) => {
  const [messageOpen, setMessageOpen] = useState(false);
  const [numberOfComments, setNumberOfComments] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const { user: loggedInUser } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: handleUpdatePost } = useUpdatePost();
  const { onlineUsers } = useSocket();
  const user = post?.author;
  const router = useRouter();

  const isAuthorOnline = user?._id && onlineUsers.includes(user._id);
  const isPremiumLocked = post?.isPremium && !loggedInUser?.isPremium && post?.author?.nickName !== loggedInUser?.nickName;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: `${window.location.origin}/posts/${post._id}`,
        });
        toast.success("Post shared successfully!");
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      await navigator.clipboard.writeText(`${window.location.origin}/posts/${post._id}`);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleReadMore = () => {
    if (isPremiumLocked) {
      router.push("/subscription");
      return;
    }
    setIsExpanded(!isExpanded);
  };

  const handleLikesAndDislikes = (type: 'like' | 'dislike') => {
    if (type === 'like') {
      setIsLiked(!isLiked);
      if (isDisliked) setIsDisliked(false);
    } else {
      setIsDisliked(!isDisliked);
      if (isLiked) setIsLiked(false);
    }

    const formData = new FormData();
    const updatedPostData: { likes?: number; dislikes?: number } = {};
    
    if (type === 'dislike') {
      updatedPostData.dislikes = post.dislikes + 1;
    } else if (type === 'like') {
      updatedPostData.likes = post.likes + 1;
    }
    
    formData.append("data", JSON.stringify(updatedPostData));
    handleUpdatePost({ formData, postId: post._id });
  };

  const handleMessage = () => {
    setMessageOpen(!messageOpen);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Removed from bookmarks" : "Added to bookmarks");
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await getAllCommentsOfASinglePost(post._id);
        setNumberOfComments(data?.length || 0);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    if (post._id) {
      fetchComments();
    }
  }, [post]);

  return (
    <div className="w-full">
      <Card className="w-full bg-content1 shadow-sm hover:shadow-lg transition-all duration-300 border border-divider">
        {/* Header */}
        <CardHeader className="flex-col gap-3 px-6 pt-6">
          <div className="flex justify-between items-start w-full">
            {/* User Info */}
            <div className="flex gap-3 flex-1">
              <Link href={`/profile/${user?.nickName}`}>
                <Badge
                  content=""
                  color="success"
                  size="sm"
                  placement="bottom-right"
                  isInvisible={!isAuthorOnline}
                  shape="circle"
                >
                  <Avatar
                    src={user?.profilePhoto}
                    size="lg"
                    isBordered
                    color={user?.isPremium ? 'warning' : 'primary'}
                    className="flex-shrink-0 hover:scale-105 transition-transform cursor-pointer"
                  />
                </Badge>
              </Link>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/profile/${user?.nickName}`}
                    className="font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {user?.name}
                  </Link>
                  {user?.isPremium && (
                    <Tooltip content="Premium User" placement="top">
                      <Crown className="w-4 h-4 text-warning fill-warning" />
                    </Tooltip>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-default-500">
                  <Link
                    href={`/profile/${user?.nickName}`}
                    className="hover:text-primary transition-colors"
                  >
                    @{user?.nickName}
                  </Link>
                  {user?.profession && (
                    <>
                      <span>•</span>
                      <span>{user?.profession}</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>

            {/* Post Meta */}
            <div className="flex items-center gap-2">
              {post.isPremium && (
                <Chip
                  startContent={<Crown size={14} />}
                  color="warning"
                  variant="flat"
                  size="sm"
                  className="font-semibold"
                >
                  Premium
                </Chip>
              )}
              {post.isTrending && (
                <Chip
                  startContent={<TrendingUp size={14} />}
                  color="danger"
                  variant="flat"
                  size="sm"
                  className="font-semibold"
                >
                  Trending
                </Chip>
              )}
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="hover:bg-default-100"
              >
                <MoreVertical size={18} />
              </Button>
            </div>
          </div>

          {/* Category Badge */}
          {post.category && (
            <div className="flex w-full">
              <Chip
                variant="bordered"
                size="sm"
                color="secondary"
                className="font-medium"
              >
                {post.category}
              </Chip>
            </div>
          )}
        </CardHeader>

        {/* Body */}
        <CardBody className="px-6 py-4 gap-4">
          {/* Title */}
          <div className="space-y-2">
            {isPremiumLocked ? (
              <h3 className="text-2xl font-bold text-foreground leading-tight">
                {post.title}
              </h3>
            ) : (
              <Link
                href={`/posts/${post._id}`}
                className="group"
              >
                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                  {post.title}
                </h3>
              </Link>
            )}
          </div>

          {/* Content */}
          <div className="relative">
            {isPremiumLocked ? (
              <>
                <div className="prose prose-sm max-w-none text-default-700 blur-sm select-none line-clamp-4">
                  {parse(post.content || '')}
                </div>
                <div className="flex flex-col items-center gap-3 py-4 bg-gradient-to-t from-warning-50 to-transparent rounded-lg mt-2">
                  <div className="flex items-center gap-2 text-warning">
                    <Crown size={20} className="fill-warning" />
                    <span className="font-semibold">Premium Content</span>
                  </div>
                  <Button
                    color="warning"
                    variant="shadow"
                    size="sm"
                    startContent={<Crown size={16} />}
                    onClick={() => router.push("/subscription")}
                    className="font-semibold"
                  >
                    Upgrade to Premium
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="prose prose-sm max-w-none text-default-700">
                  {isExpanded ? (
                    parse(post.content || '')
                  ) : (
                    <>
                      {parse(post.content?.slice(0, CHARACTER_LIMIT) || '')}
                      {post.content?.length > CHARACTER_LIMIT && (
                        <span className="text-default-500">... </span>
                      )}
                    </>
                  )}
                  {post.content?.length > CHARACTER_LIMIT && (
                    <button
                      onClick={handleReadMore}
                      className="text-default-600 hover:text-primary font-semibold ml-1 transition-colors"
                    >
                      {isExpanded ? 'See less' : 'See more'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Media Gallery */}
          {post?.images?.length > 0 && (
            <div className={`${isPremiumLocked ? 'blur-md select-none' : ''}`}>
              <MediaGallery media={post.images} />
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {post.tags.map((tag: string, index: number) => (
                <Chip
                  key={index}
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                >
                  #{tag}
                </Chip>
              ))}
            </div>
          )}
        </CardBody>

        <Divider />

        {/* Footer */}
        <CardFooter className="px-6 py-4">
          <div className="flex justify-between items-center w-full">
            {/* Action Buttons */}
            <div className="flex gap-1">
              <Tooltip content={isLiked ? "Unlike" : "Like"}>
                <Button
                  variant="light"
                  size="sm"
                  startContent={
                    <ThumbsUp 
                      className={`w-5 h-5 transition-colors ${isLiked ? 'fill-primary text-primary' : 'text-default-500'}`} 
                    />
                  }
                  onClick={() => handleLikesAndDislikes('like')}
                  className={`font-semibold ${isLiked ? 'text-primary' : 'text-default-600'}`}
                >
                  {post.likes + (isLiked ? 1 : 0)}
                </Button>
              </Tooltip>

              <Tooltip content={isDisliked ? "Remove dislike" : "Dislike"}>
                <Button
                  variant="light"
                  size="sm"
                  startContent={
                    <ThumbsDown 
                      className={`w-5 h-5 transition-colors ${isDisliked ? 'fill-danger text-danger' : 'text-default-500'}`} 
                    />
                  }
                  onClick={() => handleLikesAndDislikes('dislike')}
                  className={`font-semibold ${isDisliked ? 'text-danger' : 'text-default-600'}`}
                >
                  {post.dislikes + (isDisliked ? 1 : 0)}
                </Button>
              </Tooltip>

              <Tooltip content="Comments">
                <Button
                  variant="light"
                  size="sm"
                  startContent={<MessageCircle className={`w-5 h-5 ${messageOpen ? 'text-primary' : 'text-default-500'}`} />}
                  onClick={handleMessage}
                  className={`font-semibold ${messageOpen ? 'text-primary' : 'text-default-600'}`}
                >
                  {numberOfComments}
                </Button>
              </Tooltip>

              <Tooltip content="Views">
                <Button
                  variant="light"
                  size="sm"
                  startContent={<Eye className="w-5 h-5 text-default-500" />}
                  isDisabled
                  className="font-semibold text-default-600"
                >
                  {post.views || 0}
                </Button>
              </Tooltip>
            </div>

            {/* Share & Bookmark */}
            <div className="flex gap-1">
              <Tooltip content="Share">
                <Button
                  variant="flat"
                  size="sm"
                  color="primary"
                  startContent={<Share2 className="w-4 h-4" />}
                  onClick={handleShare}
                  className="font-semibold"
                >
                  Share
                </Button>
              </Tooltip>
              
              <Tooltip content={isBookmarked ? "Remove bookmark" : "Bookmark"}>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={handleBookmark}
                  className="hover:bg-default-100"
                >
                  <Bookmark 
                    className={`w-5 h-5 transition-all ${isBookmarked ? 'fill-primary text-primary' : 'text-default-500'}`}
                  />
                </Button>
              </Tooltip>
            </div>
          </div>
        </CardFooter>

        {/* Comments Section */}
        {messageOpen && (
          <>
            <Divider />
            <div className="px-6 py-4 bg-default-50">
              <Message user={loggedInUser as IUser} post={post} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default PostCard;