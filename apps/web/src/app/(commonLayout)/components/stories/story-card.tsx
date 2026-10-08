"use client";

import { useCreateStory } from "@/hooks/story.hook";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Avatar,
} from "@heroui/react";
import { CloudUpload } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface StoryCardProps {
  imageUrl: string;
  userImage: string;
  username: string;
  isAddStory?: boolean;
  timestamp: string;
  onClick?: () => void;
}

export function StoryCard({
  imageUrl,
  userImage,
  username,
  isAddStory,
  timestamp,
  onClick,
}: StoryCardProps) {
  const safeInitial = (username ?? "?").charAt(0) || "?";
  // View tiles are real buttons (keyboard + screen-reader operable). The
  // create tile is a plain container: its upload modal owns the interaction.
  const Wrapper = isAddStory ? "div" : "button";
  return (
    <Wrapper
      {...(!isAddStory
        ? {
            onClick,
            "aria-label": `View ${username}'s story`,
          }
        : {})}
      className="relative flex-shrink-0 cursor-pointer group w-[120px] h-[200px] rounded-xl overflow-hidden transition-transform duration-200 ease-in-out hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-primary text-left"
    >
      <Image
        width={100}
        height={200}
        src={imageUrl}
        alt={isAddStory ? "Create a story" : `${username}'s story`}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />

      {!isAddStory ? (
        <>
          <div className="absolute top-4 left-4">
            <div className="rounded-full bg-gradient-to-br from-primary via-purple-500 to-secondary p-[2px]">
              <Avatar
                src={userImage}
                className="w-10 h-10 border-2 border-white"
                fallback={safeInitial}
              />
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white text-sm font-medium truncate">{username}</p>
            <span className="text-white/80 text-xs ">{timestamp}</span>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <AddStoryModal />
          </div>
          <p className="text-sm font-medium">Create Story</p>
        </div>
      )}
    </Wrapper>
  );
}

const AddStoryModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { mutate: handleCreateStory, isPending: isCreateStoryPending } = useCreateStory();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setError(null);
    if (preview) URL.revokeObjectURL(preview);
    setFile(selectedFile);

    // Create preview URL
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
  };

  const resetSelection = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
  };

  // Handle story upload
  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first");
      return;
    }

    try {
      setError(null);
      // Create form data
      const formData = new FormData();
      formData.append("image", file);

      handleCreateStory(formData, {
        onSuccess: () => {
          toast.success("Story added successfully!");
          resetSelection();
          onClose();
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : "Failed to upload story");
        },
      });
    } catch (err) {
      console.error("Error uploading story:", err);
      setError(err instanceof Error ? err.message : "Failed to upload story");
    }
  };

  // Clean up preview URL when component unmounts or when preview changes
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button onPress={() => onOpen()} className="bg-transparent text-white ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
        </Button>
      </div>

      <Modal isOpen={isOpen} size={"md"} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add Story</ModalHeader>
              <ModalBody>
                {error && (
                  <div role="alert" className="text-red-500 text-sm mb-2">
                    {error}
                  </div>
                )}

                {preview ? (
                  <div className="relative w-full h-[240px] rounded-lg mb-2 overflow-hidden">
                    <Image src={preview} alt="Story preview" fill className="object-cover" />
                    <Button
                      isIconOnly
                      color="danger"
                      size="sm"
                      aria-label="Remove selected image"
                      className="absolute top-2 right-2"
                      onClick={resetSelection}
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  <div className="group relative mb-2 h-[160px] w-full rounded-lg border-2 border-dashed border-primary/40 transition-colors hover:border-primary">
                    <input
                      type="file"
                      accept="image/*"
                      aria-label="Choose a story image"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <span className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary-fg transition-colors group-hover:bg-primary/20">
                        <CloudUpload />
                      </span>
                      <span className="text-sm text-default-500">Click to upload</span>
                      <span className="mt-1 text-xs text-default-400">or drag and drop</span>
                    </div>
                  </div>
                )}

                <p className="mt-1 text-xs text-default-500">
                  Your story will be visible for 24 hours
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleUpload}
                  isLoading={isCreateStoryPending}
                  isDisabled={!file || isCreateStoryPending}
                >
                  {isCreateStoryPending ? "Uploading..." : "Add Story"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
