import { IUser } from "@/types/IUser";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const AllFollowers = ({ user }: { user: IUser }) => {
  return (
    <div className="bg-default-50 shadow-md rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center gap-5 mb-4">
        <h2 className="text-xl font-semibold ">Followers</h2>
        <Button
          variant="ghost"
          className="border-secondary text-secondary hover:text-default-50 hover:bg-secondary"
        >
          See All
        </Button>
      </div>
      <div className="flex gap-2 justify-between items-center">
        {user?.followers?.length ? (
          user?.followers?.slice(0, 4)?.map((follower) => (
            <div key={follower._id}>
              <Link href={`/profile/${follower?.nickName}`}>
                <Image
                  src={follower?.profilePhoto}
                  alt={follower?.name}
                  height={80}
                  width={100}
                  className="rounded-md object-cover"
                />
                <h3 className="text-center">{follower?.name}</h3>
              </Link>
            </div>
          ))
        ) : (
          <div>No followers yet</div>
        )}
      </div>
    </div>
  );
};

export default AllFollowers;
