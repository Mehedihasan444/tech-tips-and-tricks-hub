"use client";
import { useUpdateUser } from "@/hooks/user.hook";
import { IUser } from "@/types/IUser";
import { Input } from "@nextui-org/react";
import { Check, PenBoxIcon, X } from "lucide-react";
import React, { useState } from "react";

const ShortBio = ({
  user,
  showEditOption,
}: {
  user: IUser;
  showEditOption: boolean;
}) => {
  const [shortBioEditMode, setShortBioEditMode] = useState(false); // State to control bio edit mode
  const [shortBio, setShortBio] = useState(user?.shortBio || ""); // State to manage shortBio content
  const { mutate: handleUserUpdate } = useUpdateUser();

  // Handle saving shortBio changes
  const handleSaveShortBio = () => {
    // Simulate save functionality, this can be replaced with an API call
    console.log("Saving updated shortBio:", shortBio);
    const userData = {
      shortBio,
    };
    handleUserUpdate({ userId: user._id, userData });
    setShortBioEditMode(false); // Exit edit mode after saving
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
            placeholder="Enter your description"
            className="col-span-12 md:col-span-8 mb-6 md:mb-0"
            value={shortBio}
            onChange={(e) => setShortBio(e.target.value)}
          />
          <div className="flex justify-end mt-2 ">
            <button
              onClick={handleSaveShortBio}
              className=" text-sm text-default-500 underline"
            >
              <Check />
            </button>
            <button
              onClick={() => setShortBioEditMode(false)}
              className=" text-sm text-default-500 underline"
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
