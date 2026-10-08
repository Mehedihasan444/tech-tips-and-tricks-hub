import Link from "next/link";
import { getMyPosts } from "@/services/PostService";
import PostTable from "./_components/PostTable";
import { getCurrentUser } from "@/services/AuthService";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { AuthRequiredState } from "@/components/ui/ErrorState";

export const dynamic = "force-dynamic";

export default async function ManagePosts() {
  const user = await getCurrentUser().catch(() => null);
  if (!user?._id) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <PageHeader title="Manage Posts" subtitle="Edit, unpublish or delete your posts." />
        <AuthRequiredState description="Please sign in to manage your posts." />
      </div>
    );
  }
  const { data: posts } = await getMyPosts(user._id).catch(() => ({ data: [] }));
  const list = posts ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <PageHeader title="Manage Posts" subtitle="Edit, unpublish or delete your posts." />
      {list.length === 0 ? (
        <div className="overflow-hidden rounded-2xl  border-divider ">
          <EmptyState
            type="posts"
            title="You haven't posted yet"
            description="Share your first tip with the community — it takes a minute."
          />
          <div className="flex justify-center pb-8">
            <Link
              href="/dashboard/create-post"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Create a Post
            </Link>
          </div>
        </div>
      ) : (
        <PostTable posts={list} />
      )}
    </div>
  );
}
