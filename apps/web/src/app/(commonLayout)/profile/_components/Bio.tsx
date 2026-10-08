"use client";
import { useUpdateUser } from "@/hooks/user.hook";
import { IUser } from "@/types/IUser";
import { PenBoxIcon, X } from "lucide-react";
import React, { useState } from "react";

const Bio = ({ user, showEditOption }: { user: IUser; showEditOption: boolean }) => {
  const [bioEditMode, setBioEditMode] = useState(false); // State to control bio edit mode
  const [bio, setBio] = useState(user?.bio || ""); // State to manage bio content
  const { mutate: handleUserUpdate, isPending: isSaving } = useUpdateUser();

  // Handle saving bio changes (stays in edit mode until the server confirms).
  const handleSaveBio = () => {
    const userData = {
      bio,
    };
    handleUserUpdate({ userId: user._id, userData }, { onSuccess: () => setBioEditMode(false) });
  };

  return (
    <div className="bg-default-50 shadow-md rounded-lg p-6 mb-6 flex-1">
      <div className="flex justify-between ">
        <h2 className="text-xl font-semibold ">Bio</h2>
        {showEditOption && (
          <button
            onClick={() => setBioEditMode(!bioEditMode)}
            aria-label={bioEditMode ? "Cancel bio editing" : "Edit bio"}
            className="mb-4 text-sm text-default-500 underline"
          >
            {bioEditMode ? <X /> : <PenBoxIcon />}
          </button>
        )}
      </div>
      <h2 className="text-xl font-semibold mb-4"></h2>

      {bioEditMode ? (
        <div className="mb-4">
          <label htmlFor="bio-textarea" className="sr-only">
            Bio
          </label>
          <textarea
            id="bio-textarea"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSaveBio}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-500 text-default-50 rounded-md mr-2 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setBioEditMode(false)}
              disabled={isSaving}
              className="px-4 py-2 bg-gray-500 text-default-50 rounded-md disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-4">{bio || "No bio available."}</p>
          {/* <button
            onClick={() => setBioEditMode(true)}
            className="text-sm text-primary-fg underline"
          >
            Edit Bio
          </button> */}
        </>
      )}
    </div>
  );
};

export default Bio;
