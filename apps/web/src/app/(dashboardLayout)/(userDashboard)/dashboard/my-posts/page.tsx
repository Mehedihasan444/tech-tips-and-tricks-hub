"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMyPosts } from "@/services/PostService";
import Filter from "./_componets/Filter";
import Paginate from "./_componets/Paginate";
import { TPost } from "@/types/TPost";
import EmptyState from "@/components/ui/EmptyState";
import { PostCardSkeleton } from "@/components/ui/Skeleton";

const POSTS_PER_PAGE = 6;

const formatPostDate = (value?: string): string => {
  if (!value) return "Unknown date";
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "Unknown date";
  return value.split("T")[0];
};

const excerpt = (html: string, limit = 200): string => {
  const text = (html ?? "").replace(/<[^>]+>/g, "");
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
};

const MyPosts = () => {
  const router = useRouter();
  const [allPosts, setAllPosts] = useState<TPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<TPost[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setLoadError(false);
        const { data: posts } = await getMyPosts("");
        if (!cancelled) {
          setAllPosts(posts ?? []);
          setFilteredPosts(posts ?? []);
        }
      } catch (error) {
        console.error("Error fetching my posts:", error);
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void fetchPosts();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleFilter = useCallback((filtered: TPost[]) => {
    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const currentPosts = filteredPosts.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE,
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background py-5 px-5 md:px-20">
      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-5 mb-8">
        <div className="flex items-center">
          <h1 className="text-2xl border-l-5 border-primary font-bold pl-5 text-default-800 dark:text-foreground">
            My Posts
          </h1>
        </div>
        <Filter posts={allPosts} onFilter={handleFilter} />
      </div>

      {loading ? (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          role="status"
          aria-label="Loading your posts..."
        >
          {[1, 2, 3].map((i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : loadError ? (
        <div className="bg-content1 rounded-2xl border border-divider">
          <EmptyState
            type="posts"
            title="Couldn't load your posts"
            description="Something went wrong. Check your connection and try again."
            actionLabel="Try Again"
            onAction={() => window.location.reload()}
          />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-content1 rounded-2xl border border-divider">
          <EmptyState
            type="posts"
            title={allPosts.length === 0 ? "You haven't posted yet" : "No posts match your filters"}
            description={
              allPosts.length === 0
                ? "Share your first tip with the community."
                : "Try a different search term, category, or date."
            }
            actionLabel={allPosts.length === 0 ? "Create a Post" : undefined}
            onAction={
              allPosts.length === 0 ? () => router.push("/dashboard/create-post") : undefined
            }
          />
        </div>
      ) : (
        <>
          <p className="text-sm text-default-500 mb-4" role="status">
            Showing {(safePage - 1) * POSTS_PER_PAGE + 1}–
            {Math.min(safePage * POSTS_PER_PAGE, filteredPosts.length)} of {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "post" : "posts"}
          </p>
          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts?.map((post: TPost) => (
              <div
                key={post._id}
                className="bg-content1 rounded-lg shadow-lg overflow-hidden flex flex-col"
              >
                {post.images?.[0] ? (
                  <Image
                    width={300}
                    height={300}
                    src={post.images[0]}
                    alt={post.title ?? "Post image"}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex w-full h-48 items-center justify-center bg-default-100 text-4xl font-bold text-default-600"
                  >
                    {(post.title ?? "?").charAt(0)}
                  </span>
                )}
                <div className="p-6 space-y-2 flex-1 flex flex-col">
                  <h2 className="text-2xl font-semibold text-default-800 dark:text-foreground">
                    {post.title}
                  </h2>
                  <div className="text-default-600 ">{excerpt(post.content, 200)}</div>

                  <p className="text-sm text-default-500">
                    <span className="font-semibold text-sm text-default-500">Posted at: </span>
                    {formatPostDate(post.createdAt)}
                  </p>

                  {/* Displaying category and tags */}
                  {post.category && (
                    <div className="">
                      <span className="font-semibold text-sm text-default-500">Category: </span>
                      <span className="text-sm text-default-600">{post.category}</span>
                    </div>
                  )}
                  {post.tags?.length > 0 && (
                    <div className="">
                      <span className="font-semibold text-sm text-default-500">Tags: </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-default-200 text-default-700 text-xs font-medium py-1 px-2 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="pt-2 mt-auto">
                    <Link
                      href={`/dashboard/my-posts/${post._id}`}
                      className="inline-block bg-secondary/80 hover:bg-secondary text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Section */}
          <Paginate
            total={filteredPosts.length}
            page={safePage}
            perPage={POSTS_PER_PAGE}
            onChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default MyPosts;
