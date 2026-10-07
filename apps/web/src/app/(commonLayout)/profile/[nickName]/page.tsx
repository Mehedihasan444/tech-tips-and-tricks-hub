import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Divider } from "@/components/ui/heroui";
import { ClipboardPenLine } from "lucide-react";
import { getUser } from "@/services/UserService";
import { getMyPosts } from "@/services/PostService";
import PersonalInformation from "../_components/PersonalInformation";
import Media from "../_components/Media";
import PreviousPost from "../_components/PreviousPost";
import Followers from "../_components/Followers";
import Bio from "../_components/Bio";
import ShortBio from "../_components/ShortBio";
import { getCurrentUser } from "@/services/AuthService";
import AllFollowers from "../_components/AllFollowers";
import AllFollowings from "../_components/AllFollowings";
import UpdateProfilePhoto from "../_components/UpdateProfilePhoto";

interface IProps {
  params: Promise<{
    nickName: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { nickName } = await params;
  const user = await getUser(nickName).catch(() => ({ data: null }));

  if (!user?.data?._id) return { title: "Profile" };

  const name = user.data.name || nickName;

  return {
    title: `${name} (@${nickName})`,
    description: user.data.shortBio || `Posts and activity from ${name} on Tech Tips & Tricks Hub.`,
    openGraph: {
      title: `${name} (@${nickName})`,
      type: "profile",
      images: user.data.profilePhoto ? [{ url: user.data.profilePhoto }] : undefined,
    },
  };
}

const ProfilePage = async ({ params }: IProps) => {
  const { nickName } = await params;
  // Every fetch here is guarded: a guest, or a visitor holding an expired or
  // rotated token, must still get the profile page rather than a 500.
  const { data: user = {} } = await getUser(nickName).catch(() => ({ data: null }));
  if (!user?._id) {
    notFound();
  }
  const { data: posts = {} } = await getMyPosts(user._id).catch(() => ({ data: null }));
  const loggedInUser = await getCurrentUser().catch(() => null);
  const showEditOption = Boolean(loggedInUser?._id && loggedInUser._id === user._id);

  return (
    <div className=" mx-auto p-4 ">
      {/* Header Section */}
      <div className="sm:flex items-center justify-between mb-6 bg-default-50 p-3 shadow-md rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="relative ">
            {user?.isPremium ? (
              <Badge content="Verified" color="secondary" variant="solid">
                <Image
                  width={100}
                  height={100}
                  src={user?.profilePhoto}
                  alt={`${user?.name}'s profile`}
                  className="w-24 h-24 rounded-full object-cover object-center"
                />
              </Badge>
            ) : (
              <Image
                width={100}
                height={100}
                src={user?.profilePhoto}
                alt={`${user?.name}'s profile`}
                className="w-24 h-24 rounded-full object-cover object-center"
              />
            )}
            {showEditOption && <UpdateProfilePhoto />}
          </div>
          <div className="space-y-1 flex-1">
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            {/* shortBio */}
            <ShortBio user={user} showEditOption={showEditOption} />
            {/* <p className="bg-default-600">{user?.shortBio}</p> */}
          </div>
        </div>
        <div className="flex justify-center items-center">
          {/* Followers Section */}
          <Followers user={user} posts={posts} />
        </div>
      </div>{" "}
      <div className="my-3">
        <Divider />
      </div>
      <div className="flex justify-between items-center gap-5">
        {/* Bio Section */}
        <Bio user={user} showEditOption={showEditOption} />
      </div>
      <div className="sm:flex justify-between gap-5 h-full">
        <div className="flex-1 sm:max-w-80 ">
          <div className="sticky top-0">
            {/* Personal Information Section */}
            <PersonalInformation user={user} showEditOption={showEditOption} />
            {/* Media Section */}
            <Media posts={posts} />
            {/* followers */}
            <AllFollowers user={user} />
            {/* following */}
            <AllFollowings user={user} />
          </div>
        </div>
        <div className="flex-1">
          {/* Post Creation Option */}
          {showEditOption && (
            <div className="bg-default-50 shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>
              <Divider />
              <div className="flex justify-between gap-5 mt-2">
                {/* The editor itself lives at /dashboard/create-post. Rendering it
                    here behind `hidden` made the control unreachable (display:none
                    drops it from the tab order) while still shipping Quill. */}
                <Link
                  href="/dashboard/create-post"
                  className="flex gap-2 items-center rounded-full border border-divider p-3 w-full shadow-inner text-primary-700 dark:text-primary-300 hover:bg-default-100 transition-colors"
                >
                  <ClipboardPenLine aria-hidden="true" className="shrink-0" />
                  What&rsquo;s on your mind?&hellip;
                </Link>
              </div>
            </div>
          )}
          {/* Previous Posts Section */}
          <PreviousPost posts={posts} showEditOption={showEditOption} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
