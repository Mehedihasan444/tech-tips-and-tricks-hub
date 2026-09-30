/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, EllipsisVertical, X, Clock } from "lucide-react";
import { StoryCard } from "./story-card";
import { getStories } from "@/services/StoryService";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Skeleton,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Progress,
} from "@nextui-org/react";

import { useDeleteStory } from "@/hooks/story.hook";
import Image from "next/image";
import { useUser } from "@/context/user.provider";

const SCROLL_AMOUNT = 300;

interface TStory {
  id: string;
  imageUrl: string;
  userId: string;
  userImage: string;
  username: string;
  isAddStory?: boolean;
  timestamp: string;
}

const createStoryItem = {
  id: "add-story",
  imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  userImage: "",
  username: "Create Story",
  userId: "",
  isAddStory: true,
  timestamp: "2h ago",
};

const StoryCardSkeleton = () => (
  <div className="flex-shrink-0 w-32">
    <Skeleton className="rounded-2xl h-48 w-full" />
  </div>
);

export function StoriesSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedStory, setSelectedStory] = useState<TStory | null>(null);
  const [stories, setStories] = useState<TStory[]>([createStoryItem]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { mutate: handleDeleteStory, isPending: isStoryLoading } = useDeleteStory();
  const [storyToDelete, setStoryToDelete] = useState<string | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const { user } = useUser()

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const response = await getStories();

        const fetchedStories = response.data.map((story: any) => ({
          id: story.id,
          imageUrl: story.imageUrl,
          userId: story.userId,
          userImage: story.userImage,
          username: story.username,
          timestamp: story.timestamp,
        }));

        setStories([createStoryItem, ...fetchedStories]);
        setError(null);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError('Failed to load stories');
        setStories([createStoryItem]);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Auto-progress story viewing
  useEffect(() => {
    if (selectedStory) {
      setStoryProgress(0);
      const interval = setInterval(() => {
        setStoryProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            closeStoryView();
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [selectedStory]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleStoryClick = (story: TStory) => {
    setSelectedStory(story);
  };

  const closeStoryView = () => {
    setSelectedStory(null);
    setStoryProgress(0);
  };

  const confirmDeleteStory = (id: string) => {
    setStoryToDelete(id);
    onOpen();
  };

  const handleDelete = () => {
    if (storyToDelete) {
      handleDeleteStory({ storyId: storyToDelete }, {
        onSuccess: () => {
          setStories(prevStories =>
            prevStories.filter(story => story.id !== storyToDelete)
          );
          closeStoryView();
        }
      });
    }
  };

  return (
    <div className="relative w-full px-4 py-6">
      {loading ? (
        <div className="flex gap-3 overflow-x-hidden">
          <StoryCardSkeleton />
          {Array(5).fill(0).map((_, index) => (
            <StoryCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}
          <div className="relative group">
            <div
              ref={scrollContainerRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {stories.map((story) => (
                <StoryCard
                  key={story.id}
                  imageUrl={story.imageUrl}
                  userImage={story.userImage}
                  username={story.username}
                  isAddStory={story.isAddStory}
                  timestamp={story.timestamp}
                  onClick={() => handleStoryClick(story)}
                />
              ))}
            </div>

            {stories.length > 5 && (
              <>
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 
                           transition-opacity shadow-lg bg-white hover:bg-default-50 z-10"
                  onClick={() => scroll("left")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 
                           transition-opacity shadow-lg bg-white hover:bg-default-50 z-10"
                  onClick={() => scroll("right")}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </>
      )}

      {/* Story Viewer Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
          {/* Progress Bar */}
          <div className="absolute top-4 left-0 right-0 px-16 z-10">
            <Progress
              value={storyProgress}
              color="primary"
              size="sm"
              className="max-w-2xl mx-auto"
            />
          </div>

          {/* Close Button */}
          <Button
            isIconOnly
            variant="light"
            onClick={closeStoryView}
            className="absolute top-6 right-6 text-white hover:bg-white/10 z-10"
          >
            <X size={24} />
          </Button>

          {/* Story Content */}
          <div className="relative max-w-lg w-full h-[85vh] mx-4">
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={selectedStory.imageUrl}
                alt={`${selectedStory.username}'s story`}
                className="w-full h-full object-cover"
                fill
              />

              {/* Story Header */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src={selectedStory.userImage}
                      alt={selectedStory.username}
                      className="w-12 h-12 rounded-full border-2 border-white ring-2 ring-white/20"
                      height={48}
                      width={48}
                    />
                    <div className="text-white">
                      <div className="font-semibold text-base">{selectedStory.username}</div>
                      <div className="text-sm opacity-90 flex items-center gap-1">
                        <Clock size={12} />
                        {selectedStory?.timestamp}
                      </div>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  {!selectedStory.isAddStory && selectedStory.userId === user?._id && (
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <Button
                          isIconOnly
                          variant="light"
                          className="text-white hover:bg-white/10"
                        >
                          <EllipsisVertical size={20} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Story Actions">
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          onClick={() => confirmDeleteStory(selectedStory.id)}
                        >
                          Delete Story
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete Story
              </ModalHeader>
              <ModalBody>
                <p className="text-default-600">
                  Are you sure you want to delete this story? This action cannot be undone.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onClick={handleDelete}
                  isLoading={isStoryLoading}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}