import { TPost } from "@/types/TPost";
import React from "react";
import PostCard from "../../components/PostCard";
import EmptyState from "@/components/ui/EmptyState";

const PreviousPost = ({ posts, showEditOption }: { posts: TPost[]; showEditOption: boolean }) => {
  return (
    <div className="bg-default-50 shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">{showEditOption ? "Previous" : "Recent"} Posts</h2>
      <div className="grid grid-cols-1 gap-4">
        {posts?.length > 0 ? (
          posts?.map((post: TPost) => <PostCard key={post._id} post={post} />)
        ) : (
          <EmptyState
            type="posts"
            title={showEditOption ? "You haven't posted yet" : "No posts yet"}
            description={
              showEditOption
                ? "Share your first tip with the community."
                : "This user hasn't published any posts yet."
            }
          />
        )}
      </div>
    </div>
  );
};

export default PreviousPost;
