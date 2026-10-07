"use client";
import { getAllCommentsOfASinglePost } from "@/services/CommentService";
import React, { Dispatch, useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { TPost } from "@/types/TPost";
import { TComment } from "@/types/TComment";
import Comment from "./Comment";
import { CommentSkeleton } from "@/components/ui/Skeleton";

const Messages = ({
  post,
  setReplyTo,
  seeMore,
  setComment,
  setText,
  setUpdateComment,
  refreshKey,
  onCountChange,
}: {
  post: TPost;
  setReplyTo: Dispatch<string>;
  setComment: Dispatch<TComment>;
  seeMore: boolean;
  setText: Dispatch<string>;
  setUpdateComment: Dispatch<boolean>;
  refreshKey?: number;
  onCountChange?: (count: number) => void;
}) => {
  const [comments, setComments] = useState<TComment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchComments = async () => {
      try {
        setLoading(true);
        setLoadError(false);
        const { data } = await getAllCommentsOfASinglePost(post?._id);
        if (!cancelled) setComments(data || []);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (post?._id) {
      void fetchComments(); // Call the API to fetch comments only once when the component mounts
    }
    return () => {
      cancelled = true;
    };
  }, [post?._id, refreshKey, attempt]);

  useEffect(() => {
    onCountChange?.(comments.length);
  }, [comments.length, onCountChange]);

  if (loading) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading comments...">
        <CommentSkeleton />
        <CommentSkeleton />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-default-500 mb-2">Couldn&apos;t load comments.</p>
        <Button size="sm" variant="flat" color="primary" onPress={() => setAttempt((a) => a + 1)}>
          Retry
        </Button>
      </div>
    );
  }

  const visible = seeMore ? comments : comments.slice(0, 2);

  return (
    <div className="pl-7">
      {comments?.length > 0 ? (
        <div className="">
          {visible?.map((comment: TComment) => (
            <Comment
              key={comment._id}
              comment={comment}
              setReplyTo={setReplyTo}
              setComment={setComment}
              setText={setText}
              setUpdateComment={setUpdateComment}
              post={post}
            />
          ))}
        </div>
      ) : (
        <div className="text-sm text-default-500 py-2">No comments yet. Be the first!</div>
      )}
    </div>
  );
};

export default Messages;
