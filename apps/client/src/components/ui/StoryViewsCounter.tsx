"use client";

import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Avatar,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { Eye, Users } from "lucide-react";
import { useStoryViews } from "@/hooks/useStoryViews";
import { formatDistanceToNow } from "date-fns";

interface StoryViewsCounterProps {
  storyId: string;
  initialCount?: number;
  showViewers?: boolean;
}

export default function StoryViewsCounter({
  storyId,
  initialCount = 0,
  showViewers = true,
}: StoryViewsCounterProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { getStoryViews, markAsViewed, isLoading } = useStoryViews(
    isOpen ? storyId : undefined
  );

  const { count, viewers } = getStoryViews(storyId);
  const displayCount = count || initialCount;

  // Mark story as viewed when component mounts
  useEffect(() => {
    markAsViewed(storyId);
  }, [storyId, markAsViewed]);

  const formatTime = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Just now";
    }
  };

  return (
    <>
      <Button
        variant="light"
        size="sm"
        startContent={<Eye size={16} />}
        onPress={showViewers ? onOpen : undefined}
        className="text-white/90 hover:text-white"
      >
        {displayCount} {displayCount === 1 ? "view" : "views"}
      </Button>

      {showViewers && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex items-center gap-2">
                  <Users size={20} className="text-primary" />
                  <span>Story Views</span>
                  <span className="text-default-400 text-sm font-normal">
                    ({displayCount})
                  </span>
                </ModalHeader>
                <ModalBody className="pb-6">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Spinner />
                    </div>
                  ) : viewers.length === 0 ? (
                    <div className="text-center py-8">
                      <Eye className="mx-auto text-default-300 mb-3" size={40} />
                      <p className="text-default-500">No viewers yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                      {viewers.map((viewer, index) => (
                        <div
                          key={`${viewer.viewerId}-${index}`}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-default-100 transition-colors"
                        >
                          <Avatar
                            src={viewer.viewerPhoto}
                            name={viewer.viewerName}
                            size="sm"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {viewer.viewerName}
                            </p>
                            <p className="text-xs text-default-400">
                              {formatTime(viewer.viewedAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
