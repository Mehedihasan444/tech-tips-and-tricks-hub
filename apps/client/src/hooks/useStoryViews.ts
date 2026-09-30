"use client";

import { useEffect, useState, useCallback } from "react";
import { useSocket } from "@/context/socket.provider";

interface StoryView {
  storyId: string;
  viewerId: string;
  viewerName: string;
  viewerPhoto: string;
  viewedAt: Date;
}

interface StoryViewsState {
  [storyId: string]: {
    count: number;
    viewers: StoryView[];
  };
}

export const useStoryViews = (storyId?: string) => {
  const { socket, viewStory } = useSocket();
  const [viewsData, setViewsData] = useState<StoryViewsState>({});
  const [isLoading, setIsLoading] = useState(false);

  // Get views for a specific story
  const getStoryViews = useCallback((id: string) => {
    return viewsData[id] || { count: 0, viewers: [] };
  }, [viewsData]);

  // Mark story as viewed
  const markAsViewed = useCallback((id: string) => {
    viewStory(id);
  }, [viewStory]);

  // Listen for story view updates
  useEffect(() => {
    if (!socket) return;

    const handleStoryViewUpdate = (data: {
      storyId: string;
      viewCount: number;
      newViewer?: StoryView;
    }) => {
      setViewsData((prev) => {
        const existing = prev[data.storyId] || { count: 0, viewers: [] };
        return {
          ...prev,
          [data.storyId]: {
            count: data.viewCount,
            viewers: data.newViewer
              ? [...existing.viewers, data.newViewer]
              : existing.viewers,
          },
        };
      });
    };

    const handleStoryViewsResponse = (data: {
      storyId: string;
      viewCount: number;
      viewers: StoryView[];
    }) => {
      setViewsData((prev) => ({
        ...prev,
        [data.storyId]: {
          count: data.viewCount,
          viewers: data.viewers,
        },
      }));
      setIsLoading(false);
    };

    socket.on("story-view-update", handleStoryViewUpdate);
    socket.on("story-views-response", handleStoryViewsResponse);

    // Request views for specific story if provided
    if (storyId) {
      setIsLoading(true);
      socket.emit("get-story-views", storyId);
    }

    return () => {
      socket.off("story-view-update", handleStoryViewUpdate);
      socket.off("story-views-response", handleStoryViewsResponse);
    };
  }, [socket, storyId]);

  return {
    viewsData,
    getStoryViews,
    markAsViewed,
    isLoading,
  };
};

export default useStoryViews;
