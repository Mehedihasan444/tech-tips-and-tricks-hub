"use client";
import { useUser } from "@/context/user.provider";
import { useUpdateProfilePhoto } from "@/hooks/user.hook";
import { CameraIcon } from "lucide-react";
import React, { useRef } from "react";

const UpdateProfilePhoto = () => {
  // Define the ref type as HTMLInputElement
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useUser();
  const { mutate } = useUpdateProfilePhoto();
  const handleCameraClick = () => {
    // Check if fileInputRef is not null and then trigger click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const updateProfilePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the selected file
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("data", JSON.stringify({ userId: user?._id }));
      mutate(formData);
      // Handle the file upload logic here
      console.log("Selected file:", file);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 h-24 w-24 rounded-full flex justify-center items-end">
      <div className="bg-black bg-opacity-30 px-8 py-1 rounded-b-full mb-1">
        <button onClick={handleCameraClick}>
          <CameraIcon />
        </button>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={updateProfilePhoto}
        />
      </div>
    </div>
  );
};

export default UpdateProfilePhoto;
