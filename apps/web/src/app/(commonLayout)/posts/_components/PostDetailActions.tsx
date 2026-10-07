"use client";
import { Button, Tooltip } from "@heroui/react";
import { Link2, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUpdatePost } from "@/hooks/post.hook";

interface PostDetailActionsProps {
  postId: string;
  title: string;
  initialLikes: number;
  initialDislikes: number;
}

export default function PostDetailActions({
  postId,
  title,
  initialLikes,
  initialDislikes,
}: PostDetailActionsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const { mutate: handleUpdatePost } = useUpdatePost();

  const vote = (type: "like" | "dislike") => {
    const nextLiked = type === "like" ? !isLiked : false;
    const nextDisliked = type === "dislike" ? !isDisliked : false;
    setIsLiked(nextLiked);
    setIsDisliked(nextDisliked);

    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify(
        type === "like"
          ? { likes: initialLikes + (nextLiked ? 1 : 0) }
          : { dislikes: initialDislikes + (nextDisliked ? 1 : 0) },
      ),
    );
    handleUpdatePost({ formData, postId, silent: true });
  };

  const shareUrl = () =>
    typeof window !== "undefined" ? `${window.location.origin}/posts/${postId}` : "";

  const handleShare = async () => {
    const url = shareUrl();
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        toast.success("Post shared successfully!");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } else {
        toast.error("Sharing is not supported in this browser.");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      toast.error("Could not share this post. Please try again.");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Could not copy the link. Please try again.");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tooltip content={isLiked ? "Unlike" : "Like"}>
        <Button
          variant="light"
          aria-label={isLiked ? "Unlike this post" : "Like this post"}
          aria-pressed={isLiked}
          startContent={
            <ThumbsUp
              className={`w-5 h-5 ${isLiked ? "fill-primary text-primary-fg" : "text-default-500"}`}
            />
          }
          onClick={() => vote("like")}
          className={`font-semibold ${isLiked ? "text-primary-fg" : "text-default-600"}`}
        >
          {initialLikes + (isLiked ? 1 : 0)}
        </Button>
      </Tooltip>

      <Tooltip content={isDisliked ? "Remove dislike" : "Dislike"}>
        <Button
          variant="light"
          aria-label={isDisliked ? "Remove dislike" : "Dislike this post"}
          aria-pressed={isDisliked}
          startContent={
            <ThumbsDown
              className={`w-5 h-5 ${isDisliked ? "fill-danger text-danger" : "text-default-500"}`}
            />
          }
          onClick={() => vote("dislike")}
          className={`font-semibold ${isDisliked ? "text-danger" : "text-default-600"}`}
        >
          {initialDislikes + (isDisliked ? 1 : 0)}
        </Button>
      </Tooltip>

      <Tooltip content="Share this post">
        <Button
          variant="flat"
          color="primary"
          aria-label="Share this post"
          startContent={<Share2 className="w-4 h-4" />}
          onClick={handleShare}
          className="font-semibold"
        >
          Share
        </Button>
      </Tooltip>

      <Tooltip content="Copy link">
        <Button variant="light" isIconOnly aria-label="Copy post link" onClick={handleCopy}>
          <Link2 className="w-4 h-4" />
        </Button>
      </Tooltip>
    </div>
  );
}
