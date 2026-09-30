import React from "react";
import { getMyPosts } from "@/services/PostService";
import PostTable from "./_components/PostTable";
import { getCurrentUser } from "@/services/AuthService";

export default async function ManagePosts() {
  const user = await getCurrentUser();
  if (!user) return;
  const { data: posts } = await getMyPosts(user._id);

  return (
    <div className="container mx-auto p-6 bg-default-50  rounded-lg">
      <h1 className="text-2xl mb-6 border-l-5 border-primary font-bold pl-5">
        Manage Posts
      </h1>
      <PostTable posts={posts} />
    </div>
  );
}
