/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Tooltip,
  Avatar,
  Badge,
} from "@heroui/react";
import Link from "next/link";
import {
  ThumbsDown,
  ThumbsUp,
  Share2,
  MessageCircle,
  Bookmark,
  Clock,
  Crown,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import MediaGallery from "./MediaGallery";
import { useUpdatePost } from "@/hooks/post.hook";
import { useUser } from "@/context/user.provider";
import { useRouter } from "next/navigation";
import Message from "./message/Message";
import { toast } from "sonner";
import { IUser } from "@/types/IUser";
import { formatDistanceToNow } from "date-fns";
import { useSocket } from "@/context/socket.provider";
import { sanitizeParse } from "@/utils/sanitizeHtml";
import { formatHandle } from "@/utils/formatHandle";
import { isPostSaved, toggleSavedPost } from "@/utils/bookmarks";

const CHARACTER_LIMIT = 300;

/** Never let a missing/malformed timestamp crash the feed. */
const formatPostDate = (value: unknown): string => {
  try {
    const date = new Date(value as string);
    if (Number.isNaN(date.getTime())) return "Recently";
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "Recently";
  }
};

const PostCard = ({ post }: { post: any }) => {
  const [messageOpen, setMessageOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(() => isPostSaved(post?._id));
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const { user: loggedInUser } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);
  const { mutate: handleUpdatePost } = useUpdatePost();
  const { onlineUsers } = useSocket();
  const user = post?.author;
  const router = useRouter();

  const isAuthorOnline = user?._id && onlineUsers.includes(user._id);
  const isPremiumLocked =
    post?.isPremium &&
    !loggedInUser?.isPremium &&
    post?.author?.nickName !== loggedInUser?.nickName;

  const handleShare = async () => {
    const url = `${window.location.origin}/posts/${post._id}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.description,
          url,
        });
        toast.success("Post shared successfully!");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } else {
        toast.error("Sharing is not supported in this browser.");
      }
    } catch (error) {
      // User dismissing the share sheet throws AbortError — not a failure.
      if (error instanceof Error && error.name === "AbortError") return;
      toast.error("Could not share this post. Please try again.");
    }
  };

  const handleReadMore = () => {
    if (isPremiumLocked) {
      router.push("/subscription");
      return;
    }
    setIsExpanded(!isExpanded);
  };

  const handleLikesAndDislikes = (type: "like" | "dislike") => {
    // Base counts from the server never include this device's vote, so toggling
    // off returns to the base instead of incrementing again.
    const nextLiked = type === "like" ? !isLiked : false;
    const nextDisliked = type === "dislike" ? !isDisliked : false;
    setIsLiked(nextLiked);
    setIsDisliked(nextDisliked);

    const formData = new FormData();
    const updatedPostData: { likes?: number; dislikes?: number } = {};

    if (type === "dislike") {
      updatedPostData.dislikes = post.dislikes + (nextDisliked ? 1 : 0);
    } else if (type === "like") {
      updatedPostData.likes = post.likes + (nextLiked ? 1 : 0);
    }

    formData.append("data", JSON.stringify(updatedPostData));
    handleUpdatePost({ formData, postId: post._id, silent: true });
  };

  const handleMessage = () => {
    setMessageOpen(!messageOpen);
  };

  const handleBookmark = () => {
    // Persisted on this device so Saved Posts survives refresh.
    const nowSaved = toggleSavedPost(post);
    setIsBookmarked(nowSaved);
    toast.success(nowSaved ? "Added to bookmarks" : "Removed from bookmarks");
  };

  // `TPost.comments` already holds the comment ids, so the count is free.
  // Fetching the full comment body here only to read `.length` cost one extra
  // request per card and could resolve after unmount.
  const numberOfComments = post?.comments?.length ?? 0;

  return (
    <div className="w-full">
      <Card className="w-full bg-content1 surface hover-lift overflow-hidden">
        {/* Header */}
        <CardHeader className="flex-col gap-3 px-6 pt-6">
          <div className="flex justify-between items-start w-full">
            {/* User Info */}
            <div className="flex gap-3 flex-1 min-w-0">
              {user?.nickName ? (
                <Link
                  href={`/profile/${user.nickName}`}
                  aria-label={`View ${user?.name ?? "author"}'s profile`}
                  className="rounded-full transition-transform duration-300 hover:scale-105 motion-reduce:hover:scale-100"
                >
                  <Badge
                    content=""
                    color="success"
                    size="sm"
                    placement="bottom-right"
                    isInvisible={!isAuthorOnline}
                    shape="circle"
                    // `badge` is the dot element itself; `base` wraps the whole
                    // avatar, so the pulse has to go on `badge` or it would
                    // scale the avatar too.
                    classNames={{ badge: isAuthorOnline ? "animate-pulse-soft" : "" }}
                  >
                    <Avatar
                      name={user?.name?.trim() ? user.name : "?"}
                      src={user?.profilePhoto}
                      size="lg"
                      isBordered
                      color={user?.isPremium ? "warning" : "primary"}
                      className="flex-shrink-0"
                    />
                  </Badge>
                </Link>
              ) : (
                <Avatar
                  name={user?.name?.trim() ? user.name : "?"}
                  src={user?.profilePhoto}
                  size="lg"
                  isBordered
                  color={user?.isPremium ? "warning" : "primary"}
                  className="flex-shrink-0"
                />
              )}
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  {user?.nickName ? (
                    <Link
                      href={`/profile/${user.nickName}`}
                      className="font-semibold text-foreground hover:text-primary-fg transition-colors duration-200"
                    >
                      {user?.name ?? "Unknown author"}
                    </Link>
                  ) : (
                    <span className="font-semibold text-foreground">
                      {user?.name ?? "Unknown author"}
                    </span>
                  )}
                  {user?.isPremium && (
                    <Tooltip content="Premium User" placement="top">
                      <Crown className="w-4 h-4 text-warning fill-warning" />
                    </Tooltip>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-default-500">
                  {user?.nickName ? (
                    <Link
                      href={`/profile/${user.nickName}`}
                      className="hover:text-primary-fg transition-colors duration-200"
                    >
                      {formatHandle(user.nickName)}
                    </Link>
                  ) : (
                    <span>@unknown</span>
                  )}
                  {user?.profession && (
                    <>
                      <span>•</span>
                      <span>{user?.profession}</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatPostDate(post.createdAt)}
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
            </div>
          </div>

          {/* Category Badge */}
          {post.category && (
            <div className="flex w-full">
              <Chip
                variant="flat"
                size="sm"
                color="secondary"
                className="font-medium uppercase tracking-wide text-[11px]"
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
              <h3 className="text-2xl font-bold text-foreground leading-[1.2] tracking-tight text-balance">
                {post.title}
              </h3>
            ) : (
              <Link href={`/posts/${post._id}`} className="group inline-block">
                <h3 className="text-2xl font-bold text-foreground leading-[1.2] tracking-tight text-balance transition-colors duration-200 group-hover:text-primary-fg">
                  {post.title}
                </h3>
              </Link>
            )}
          </div>

          {/* Content */}
          <div className="relative">
            {isPremiumLocked ? (
              <>
                <div
                  className="prose prose-sm max-w-none text-default-700 blur-sm select-none line-clamp-4"
                  aria-hidden="true"
                >
                  {sanitizeParse(post.content || "")}
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
                    sanitizeParse(post.content || "")
                  ) : (
                    <>
                      {sanitizeParse(post.content?.slice(0, CHARACTER_LIMIT) || "")}
                      {post.content?.length > CHARACTER_LIMIT && (
                        <span className="text-default-500">... </span>
                      )}
                    </>
                  )}
                  {post.content?.length > CHARACTER_LIMIT && (
                    <button
                      type="button"
                      onClick={handleReadMore}
                      aria-expanded={isExpanded}
                      className="text-primary-700 dark:text-primary-300 hover:text-primary-fg font-semibold ml-1 transition-colors"
                    >
                      {isExpanded ? "See less" : "See more"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Media Gallery */}
          {post?.images?.length > 0 && (
            <div className={`${isPremiumLocked ? "blur-md select-none" : ""}`}>
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
                  className="text-xs cursor-pointer transition-transform duration-200 hover:bg-primary/20 hover:scale-105 motion-reduce:hover:scale-100"
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
            <div className="flex items-center gap-1 rounded-full border border-divider bg-default-100/60 p-1">
              <Tooltip content={isLiked ? "Unlike" : "Like"}>
                <Button
                  variant={isLiked ? "flat" : "light"}
                  size="sm"
                  color={isLiked ? "primary" : "default"}
                  aria-label={isLiked ? "Unlike this post" : "Like this post"}
                  aria-pressed={isLiked}
                  startContent={
                    <ThumbsUp
                      className={`w-5 h-5 transition-colors ${isLiked ? "fill-current" : "text-default-500"}`}
                    />
                  }
                  onClick={() => handleLikesAndDislikes("like")}
                  className={`font-semibold rounded-full transition-transform duration-200 active:scale-95 ${isLiked ? "" : "text-default-600"}`}
                >
                  {post.likes + (isLiked ? 1 : 0)}
                </Button>
              </Tooltip>

              <Tooltip content={isDisliked ? "Remove dislike" : "Dislike"}>
                <Button
                  variant={isDisliked ? "flat" : "light"}
                  size="sm"
                  color={isDisliked ? "danger" : "default"}
                  aria-label={isDisliked ? "Remove dislike" : "Dislike this post"}
                  aria-pressed={isDisliked}
                  startContent={
                    <ThumbsDown
                      className={`w-5 h-5 transition-colors ${isDisliked ? "fill-current" : "text-default-500"}`}
                    />
                  }
                  onClick={() => handleLikesAndDislikes("dislike")}
                  className={`font-semibold rounded-full transition-transform duration-200 active:scale-95 ${isDisliked ? "" : "text-default-600"}`}
                >
                  {post.dislikes + (isDisliked ? 1 : 0)}
                </Button>
              </Tooltip>

              <Tooltip content="Comments">
                <Button
                  variant={messageOpen ? "flat" : "light"}
                  size="sm"
                  color={messageOpen ? "primary" : "default"}
                  aria-label="Toggle comments"
                  aria-describedby="post-card-comment-count"
                  aria-pressed={messageOpen}
                  aria-expanded={messageOpen}
                  startContent={
                    <MessageCircle
                      className={`w-5 h-5 ${messageOpen ? "text-primary-fg" : "text-default-500"}`}
                    />
                  }
                  onPress={handleMessage}
                  className={`font-semibold rounded-full transition-transform duration-200 active:scale-95 ${messageOpen ? "" : "text-default-600"}`}
                >
                  <span id="post-card-comment-count">{numberOfComments}</span>
                </Button>
              </Tooltip>
            </div>

            {/* Share & Bookmark */}
            <div className="flex items-center gap-1">
              <Tooltip content="Share">
                <Button
                  isIconOnly
                  variant="flat"
                  size="sm"
                  color="primary"
                  aria-label="Share this post"
                  onPress={handleShare}
                  className="rounded-full transition-transform duration-200 active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </Tooltip>

              <Tooltip content={isBookmarked ? "Remove bookmark" : "Bookmark"}>
                <Button
                  isIconOnly
                  variant={isBookmarked ? "flat" : "light"}
                  size="sm"
                  color={isBookmarked ? "primary" : "default"}
                  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this post"}
                  aria-pressed={isBookmarked}
                  onPress={handleBookmark}
                  className={`rounded-full transition-transform duration-200 active:scale-95 ${isBookmarked ? "" : "text-default-500"}`}
                >
                  <Bookmark
                    className={`w-5 h-5 transition-all ${isBookmarked ? "fill-current" : ""}`}
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
            <div className="px-6 py-4 bg-default-50 animate-fade-up">
              <Message user={loggedInUser as IUser} post={post} />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default PostCard;
