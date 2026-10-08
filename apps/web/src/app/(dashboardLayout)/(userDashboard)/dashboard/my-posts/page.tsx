"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMyPosts } from "@/services/PostService";
import Filter from "./_components/Filter";
import Paginate from "./_components/Paginate";
import { TPost } from "@/types/TPost";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  MessageSquare,
  PenSquare,
  ThumbsUp,
} from "lucide-react";
import { Button, Chip } from "@heroui/react";
import { PostCardSkeleton } from "@/components/ui/Skeleton";

const POSTS_PER_PAGE = 6;

const formatPostDate = (value?: string): string => {
  if (!value) return "Unknown date";
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "Unknown date";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
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

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(false);
      const { data: posts } = await getMyPosts("");
      setAllPosts(posts ?? []);
      setFilteredPosts(posts ?? []);
    } catch (error) {
      console.error("Error fetching my posts:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchPosts();
  }, [fetchPosts]);

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
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <PageHeader
        title="My Posts"
        subtitle="All posts published from your account."
        icon={FileText}
        actions={
          <Button
            size="sm"
            color="primary"
            startContent={<PenSquare size={15} />}
            onPress={() => router.push("/dashboard/create-post")}
          >
            New Post
          </Button>
        }
      />
      <div className="mb-6">
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
        <div className="surface overflow-hidden rounded-2xl">
          <EmptyState
            type="posts"
            title="Couldn't load your posts"
            description="Something went wrong. Check your connection and try again."
            actionLabel="Try Again"
            onAction={() => void fetchPosts()}
          />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="surface overflow-hidden rounded-2xl">
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
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {currentPosts?.map((post: TPost) => {
              const likes = Array.isArray(post.upvotes) ? post.upvotes.length : (post.likes ?? 0);
              const comments = post.comments?.length ?? 0;
              return (
                <article
                  key={post._id}
                  className="surface hover-lift flex flex-col overflow-hidden rounded-2xl"
                >
                  <div className="relative h-44 w-full overflow-hidden bg-default-100">
                    {post.images?.[0] ? (
                      <Image
                        width={600}
                        height={340}
                        src={post.images[0]}
                        alt={post.title ?? "Post image"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-500/15 via-default-100 to-secondary-500/15 text-4xl font-bold text-default-400"
                      >
                        {(post.title ?? "?").charAt(0)}
                      </span>
                    )}
                    <div className="absolute left-3 top-3 flex gap-1.5">
                      {post.category && (
                        <Chip size="sm" color="primary" variant="flat" className="backdrop-blur">
                          {post.category}
                        </Chip>
                      )}
                      {post.isPremium && (
                        <Chip size="sm" color="warning" variant="flat" className="backdrop-blur">
                          Premium
                        </Chip>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-2.5 p-5">
                    <h2 className="line-clamp-2 text-lg font-semibold leading-snug text-foreground">
                      <Link
                        href={`/posts/${post._id}`}
                        className="transition-colors hover:text-primary-fg"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="line-clamp-3 text-sm leading-relaxed text-default-500">
                      {excerpt(post.content, 160)}
                    </p>
                    {post.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 3).map((tag) => (
                          <Chip key={tag} size="sm" variant="bordered" className="text-xs">
                            #{tag}
                          </Chip>
                        ))}
                      </div>
                    )}
                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-divider pt-3">
                      <span className="flex items-center gap-1.5 text-xs text-default-500">
                        <CalendarDays size={13} aria-hidden="true" />
                        {formatPostDate(post.createdAt)}
                      </span>
                      <span className="flex items-center gap-3 text-xs text-default-500">
                        <span className="flex items-center gap-1">
                          <ThumbsUp size={13} aria-hidden="true" />
                          {likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={13} aria-hidden="true" />
                          {comments}
                        </span>
                      </span>
                    </div>
                    <Link
                      href={`/posts/${post._id}`}
                      className="group/link mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-fg"
                    >
                      Read More
                      <ArrowRight
                        size={15}
                        aria-hidden="true"
                        className="transition-transform group-hover/link:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </article>
              );
            })}
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
