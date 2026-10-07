"use client";
import { useUser } from "@/context/user.provider";
import { useUpdateProfilePhoto } from "@/hooks/user.hook";
import { CameraIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB

const UpdateProfilePhoto = () => {
  // Define the ref type as HTMLInputElement
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useUser();
  const { mutate, isPending } = useUpdateProfilePhoto();
  const [localError, setLocalError] = useState<string | null>(null);
  const handleCameraClick = () => {
    // Check if fileInputRef is not null and then trigger click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const updateProfilePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLocalError("Please choose an image file.");
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setLocalError("Image must be smaller than 5MB.");
      toast.error("Image must be smaller than 5MB.");
      return;
    }
    setLocalError(null);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("data", JSON.stringify({ userId: user?._id }));
    mutate(formData, {
      // Clear the input so the same file can be picked again after an error.
      onSettled: () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 h-24 w-24 rounded-full flex justify-center items-end">
      <div className="bg-black/30 px-8 py-1 rounded-b-full mb-1">
        <button
          onClick={handleCameraClick}
          disabled={isPending}
          aria-label={isPending ? "Uploading profile photo..." : "Change profile photo"}
          className="disabled:opacity-50"
        >
          <CameraIcon />
        </button>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          aria-label="Choose a profile photo"
          className="sr-only"
          onChange={updateProfilePhoto}
        />
      </div>
      {localError && (
        <span role="alert" className="sr-only">
          {localError}
        </span>
      )}
    </div>
  );
};

export default UpdateProfilePhoto;
