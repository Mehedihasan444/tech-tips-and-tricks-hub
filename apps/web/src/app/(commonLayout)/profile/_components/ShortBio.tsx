"use client";
import { useUpdateUser } from "@/hooks/user.hook";
import { IUser } from "@/types/IUser";
import { Input } from "@heroui/react";
import { Check, PenBoxIcon, X } from "lucide-react";
import React, { useState } from "react";

const ShortBio = ({ user, showEditOption }: { user: IUser; showEditOption: boolean }) => {
  const [shortBioEditMode, setShortBioEditMode] = useState(false); // State to control bio edit mode
  const [shortBio, setShortBio] = useState(user?.shortBio || ""); // State to manage shortBio content
  const { mutate: handleUserUpdate, isPending: isSaving } = useUpdateUser();

  // Handle saving shortBio changes (stays in edit mode until the server confirms).
  const handleSaveShortBio = () => {
    const userData = {
      shortBio,
    };
    handleUserUpdate(
      { userId: user._id, userData },
      { onSuccess: () => setShortBioEditMode(false) },
    );
  };

  return (
    <div className="">
      {shortBioEditMode ? (
        <div className=" flex gap-2">
          <Input
            key={"flat"}
            variant={"flat"}
            size="sm"
            labelPlacement="outside"
            aria-label="Short bio"
            placeholder="Enter your description"
            className="col-span-12 md:col-span-8 mb-6 md:mb-0"
            value={shortBio}
            onChange={(e) => setShortBio(e.target.value)}
          />
          <div className="flex justify-end mt-2 ">
            <button
              onClick={handleSaveShortBio}
              disabled={isSaving}
              aria-label="Save short bio"
              className=" text-sm text-default-500 underline disabled:opacity-50"
            >
              <Check />
            </button>
            <button
              onClick={() => setShortBioEditMode(false)}
              disabled={isSaving}
              aria-label="Cancel short bio editing"
              className=" text-sm text-default-500 underline disabled:opacity-50"
            >
              <X />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-end ">
            <p className="text-wrap">{shortBio || "No short bio available."}</p>
            {/* Toggle edit mode */}
            {showEditOption && (
              <button
                onClick={() => setShortBioEditMode(!shortBioEditMode)}
                aria-label={shortBioEditMode ? "Cancel short bio editing" : "Edit short bio"}
                className=" text-sm text-default-500 underline"
              >
                {shortBioEditMode ? <X /> : <PenBoxIcon />}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ShortBio;
