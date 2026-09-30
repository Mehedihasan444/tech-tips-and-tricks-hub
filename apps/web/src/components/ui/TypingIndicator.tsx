"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSocket, TypingIndicator as TypingData } from "@/context/socket.provider";

interface TypingIndicatorProps {
  postId: string;
  className?: string;
}

export default function TypingIndicator({ postId, className = "" }: TypingIndicatorProps) {
  const { typingUsers } = useSocket();
  const [typingList, setTypingList] = useState<TypingData[]>([]);

  useEffect(() => {
    // Filter typing users for this specific post
    const usersTypingInPost = Array.from(typingUsers.values()).filter(
      (user) => user.postId === postId && user.isTyping
    );
    setTypingList(usersTypingInPost);
  }, [typingUsers, postId]);

  if (typingList.length === 0) return null;

  const getTypingText = () => {
    if (typingList.length === 1) {
      return `${typingList[0].userName} is typing`;
    } else if (typingList.length === 2) {
      return `${typingList[0].userName} and ${typingList[1].userName} are typing`;
    } else {
      return `${typingList[0].userName} and ${typingList.length - 1} others are typing`;
    }
  };

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 text-sm text-default-500 animate-pulse ${className}`}
    >
      {/* Animated dots */}
      <div className="flex gap-1">
        <span
          className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <span>{getTypingText()}...</span>
    </div>
  );
}

// Hook for managing typing state in comment input
interface UseCommentTypingOptions {
  postId: string;
  debounceMs?: number;
}

export function useCommentTyping({ postId, debounceMs = 1000 }: UseCommentTypingOptions) {
  const { startTyping, stopTyping } = useSocket();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const handleTypingStart = useCallback(() => {
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      startTyping(postId);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing after debounce period
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      stopTyping(postId);
    }, debounceMs);
  }, [postId, startTyping, stopTyping, debounceMs]);

  const handleTypingStop = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    isTypingRef.current = false;
    stopTyping(postId);
  }, [postId, stopTyping]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTypingRef.current) {
        stopTyping(postId);
      }
    };
  }, [postId, stopTyping]);

  return {
    handleTypingStart,
    handleTypingStop,
  };
}
