import { IUser } from "@/types/IUser";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AllFollowings = ({ user }: { user: IUser }) => {
  const following = user?.following ?? [];
  return (
    <div className="bg-default-50 shadow-md rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center gap-5 mb-4">
        <h2 className="text-xl font-semibold ">Following</h2>
        {following.length > 0 && (
          <span className="text-sm text-default-500">{following.length}</span>
        )}
      </div>
      {following.length ? (
        <div className="flex gap-3 items-start overflow-x-auto pb-1">
          {following.slice(0, 8)?.map((followed) => (
            <div key={followed._id} className="shrink-0 w-20">
              {followed?.nickName ? (
                <Link
                  href={`/profile/${followed.nickName}`}
                  className="flex flex-col items-center gap-1"
                >
                  {followed?.profilePhoto ? (
                    <Image
                      src={followed.profilePhoto}
                      alt={followed?.name ?? "Followed user"}
                      height={80}
                      width={80}
                      className="rounded-md object-cover h-20 w-20"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex rounded-md h-20 w-20 items-center justify-center bg-default-200 text-xl font-bold text-default-500"
                    >
                      {(followed?.name ?? "?").charAt(0)}
                    </span>
                  )}
                  <span className="text-center text-xs truncate w-full">
                    {followed?.name ?? "Unknown"}
                  </span>
                </Link>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <span
                    aria-hidden="true"
                    className="flex rounded-md h-20 w-20 items-center justify-center bg-default-200 text-xl font-bold text-default-500"
                  >
                    {(followed?.name ?? "?").charAt(0)}
                  </span>
                  <span className="text-center text-xs truncate w-full">
                    {followed?.name ?? "Unknown"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-default-500">Not following anyone yet.</p>
      )}
    </div>
  );
};

export default AllFollowings;
