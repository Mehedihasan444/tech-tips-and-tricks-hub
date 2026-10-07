"use client";
import { Textarea } from "@heroui/react";
import React, { useState, useEffect, useRef } from "react";
import { SendHorizonal } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IUser } from "@/types/IUser";
import { useCreateComment, useReplyComment, useUpdateComment } from "@/hooks/comment.hook";
import Messages from "./_components/Messages";
import { TPost } from "@/types/TPost";
import { TComment } from "@/types/TComment";
import { useSocket } from "@/context/socket.provider";

const Message = ({ user, post }: { user: IUser; post: TPost }) => {
  const [comment, setComment] = useState<TComment>();
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [seeMore, setSeeMore] = useState(false);
  const [updateComment, setUpdateComment] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const { startTyping, stopTyping, typingUsers } = useSocket();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // data fetch or manipulate
  const { mutate: handleCreateComment, isPending: isCreating } = useCreateComment();
  const { mutate: handleReplyComment, isPending: isReplying } = useReplyComment();
  const { mutate: handleUpdateComment, isPending: isUpdating } = useUpdateComment();
  const isSubmitting = isCreating || isReplying || isUpdating;

  // Get typing users for this post
  const typingInThisPost = Array.from(typingUsers.values()).filter(
    (t) => t.postId === post._id && t.isTyping,
  );

  // Handle typing indicator
  const handleTextChange = (value: string) => {
    setText(value);

    // Start typing indicator
    if (value.length > 0) {
      startTyping(post._id);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(post._id);
      }, 2000);
    } else {
      stopTyping(post._id);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      stopTyping(post._id);
    };
  }, [post._id, stopTyping]);

  const resetForm = () => {
    setText("");
    setComment(undefined);
    setReplyTo("");
    setUpdateComment(false);
  };

  // handle comment
  const handleComment = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;
    // Stop typing when submitting
    stopTyping(post._id);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const refresh = () => setRefreshKey((k) => k + 1);

    if (replyTo && comment) {
      const commentData = {
        commentId: comment?._id,
        data: {
          postId: post?._id,
          commentText: trimmed,
          commentUser: {
            name: user?.name,
            photo: user?.profilePhoto,
            nickName: user?.nickName as string,
          },
          createdAt: new Date(),
        },
      };
      handleReplyComment(commentData, {
        onSuccess: () => {
          resetForm();
          refresh();
        },
      });
    } else if (updateComment && comment) {
      // edit comment logic here
      const updateCommentData = {
        commentId: comment?._id,
        data: {
          postId: post._id,
          commentText: trimmed,
          commentUser: {
            name: comment?.commentUser.name,
            photo: comment?.commentUser.photo,
            nickName: user?.nickName as string,
          },
          createdAt: new Date(),
        },
      };

      handleUpdateComment(updateCommentData, {
        onSuccess: () => {
          resetForm();
          refresh();
        },
      });
    } else {
      const commentData = {
        postId: post?._id,
        commentText: trimmed,
        commentUser: {
          name: user?.name,
          photo: user?.profilePhoto,
          nickName: user?.nickName as string,
        },
        createdAt: new Date(),
      };
      handleCreateComment(commentData, {
        onSuccess: () => {
          resetForm();
          refresh();
        },
      });
    }
  };

  // Guests see a sign-in prompt instead of a form that would crash on
  // missing profile data and submit undefined user fields.
  if (!user?._id) {
    return (
      <div>
        <Messages
          post={post}
          setReplyTo={setReplyTo}
          seeMore={seeMore}
          setComment={setComment}
          setText={setText}
          setUpdateComment={setUpdateComment}
          refreshKey={refreshKey}
        />
        <button
          onClick={() => router.push("/login")}
          className="mt-3 text-sm font-semibold text-primary-fg hover:underline"
        >
          Sign in to join the discussion
        </button>
      </div>
    );
  }

  return (
    <div className="">
      {/* Comment Section */}
      <Messages
        post={post}
        setReplyTo={setReplyTo}
        seeMore={seeMore}
        setComment={setComment}
        setText={setText}
        setUpdateComment={setUpdateComment}
        refreshKey={refreshKey}
        onCountChange={setCommentCount}
      />
      {commentCount > 2 && (
        <button
          onClick={() => setSeeMore(!seeMore)}
          aria-expanded={seeMore}
          className="mt-1 text-xs font-semibold text-default-500 hover:text-primary-fg transition-colors"
        >
          {seeMore ? "Show fewer comments" : `View all ${commentCount} comments`}
        </button>
      )}

      {/* Typing Indicator */}
      {typingInThisPost.length > 0 && (
        <div
          role="status"
          aria-live="polite"
          className="px-2 py-1 text-xs text-default-500 italic flex items-center gap-1"
        >
          <span className="flex gap-0.5" aria-hidden="true">
            <span
              className="w-1.5 h-1.5 bg-primary rounded-full motion-safe:animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-1.5 h-1.5 bg-primary rounded-full motion-safe:animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-1.5 h-1.5 bg-primary rounded-full motion-safe:animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </span>
          <span>
            {typingInThisPost.length === 1
              ? `${typingInThisPost[0].userName} is typing...`
              : `${typingInThisPost.length} people are typing...`}
          </span>
        </div>
      )}

      {/* comment textarea */}
      <div className="mt-2 flex gap-2">
        <div className="flex">
          {user?.profilePhoto ? (
            <Image
              src={user.profilePhoto}
              alt={user?.name ?? "Your avatar"}
              width={30}
              height={30}
              className="rounded-full h-[30px] w-[30px] object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex rounded-full h-[30px] w-[30px] items-center justify-center bg-default-200 text-xs font-bold text-default-500"
            >
              {(user?.name ?? "?").charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <Textarea
            value={text} // Use undefined instead of null
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                void handleComment();
              }
            }}
            aria-label={replyTo ? `Replying to ${replyTo}. Write a comment` : "Write a comment"}
            label={
              replyTo ? (
                <span className="text-xs text-primary-fg">replying to @{replyTo}</span>
              ) : null
            }
            variant="faded"
            placeholder="Write a comment (Ctrl+Enter to send)"
            disableAnimation
            disableAutosize
            endContent={
              text.trim() && (
                <button
                  onClick={() => void handleComment()}
                  disabled={isSubmitting}
                  aria-label={isSubmitting ? "Sending comment..." : "Send comment"}
                  className="disabled:opacity-50"
                >
                  <SendHorizonal className="text-primary-fg" />
                </button>
              )
            }
            classNames={{
              input: "resize-y",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Message;
