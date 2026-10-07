import { IUser } from "@/types/IUser";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AllFollowers = ({ user }: { user: IUser }) => {
  const followers = user?.followers ?? [];
  return (
    <div className="bg-default-50 shadow-md rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center gap-5 mb-4">
        <h2 className="text-xl font-semibold ">Followers</h2>
        {followers.length > 0 && (
          <span className="text-sm text-default-500">{followers.length}</span>
        )}
      </div>
      {followers.length ? (
        <div className="flex gap-3 items-start overflow-x-auto pb-1">
          {followers.slice(0, 8)?.map((follower) => (
            <div key={follower._id} className="shrink-0 w-20">
              {follower?.nickName ? (
                <Link
                  href={`/profile/${follower.nickName}`}
                  className="flex flex-col items-center gap-1"
                >
                  {follower?.profilePhoto ? (
                    <Image
                      src={follower.profilePhoto}
                      alt={follower?.name ?? "Follower"}
                      height={80}
                      width={80}
                      className="rounded-md object-cover h-20 w-20"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex rounded-md h-20 w-20 items-center justify-center bg-default-200 text-xl font-bold text-default-500"
                    >
                      {(follower?.name ?? "?").charAt(0)}
                    </span>
                  )}
                  <span className="text-center text-xs truncate w-full">
                    {follower?.name ?? "Unknown"}
                  </span>
                </Link>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <span
                    aria-hidden="true"
                    className="flex rounded-md h-20 w-20 items-center justify-center bg-default-200 text-xl font-bold text-default-500"
                  >
                    {(follower?.name ?? "?").charAt(0)}
                  </span>
                  <span className="text-center text-xs truncate w-full">
                    {follower?.name ?? "Unknown"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-default-500">No followers yet.</p>
      )}
    </div>
  );
};

export default AllFollowers;
