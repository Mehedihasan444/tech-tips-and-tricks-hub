"use client";
import { useGetSearchedPosts } from "@/hooks/search.hook";
import { useSearchParams, useRouter } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import PostCard from "../components/PostCard";
import { TPost } from "@/types/TPost";
import EmptyState from "@/components/ui/EmptyState";
import { PostCardSkeleton } from "@/components/ui/Skeleton";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const search = searchParams.get("query")?.trim() ?? "";
  const { mutate: handleSearch, data, isPending, isError } = useGetSearchedPosts();

  useEffect(() => {
    if (!search) return;
    handleSearch(search);
  }, [search, handleSearch]);

  const retry = () => {
    if (search) handleSearch(search);
  };

  if (isPending) {
    return (
      <div className="max-w-5xl mx-auto px-4 my-8">
        <div className="mb-6">
          <div className="h-8 w-64 bg-default-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-32 bg-default-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-5">
          {[1, 2, 3].map((i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!search) {
    return (
      <div className="max-w-5xl mx-auto px-4 my-8">
        <div className="bg-content1 rounded-2xl border border-divider">
          <EmptyState
            type="search"
            title="Search posts"
            description="Type a keyword in the search bar above to find tech tips, tutorials, and guides."
            actionLabel="Browse All Posts"
            onAction={() => router.push("/")}
          />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-5xl mx-auto px-4 my-8">
        <div className="bg-content1 rounded-2xl border border-divider">
          <EmptyState
            type="search"
            title="Search failed"
            description="We couldn't run your search right now. Check your connection and try again."
            actionLabel="Try Again"
            onAction={retry}
            secondaryActionLabel="Go Back"
            onSecondaryAction={() => router.back()}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto px-4 my-8">
      {/* Search Results Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Search Results for &quot;{search}&quot;
        </h1>
        <p className="text-default-500 mt-1">
          {data?.data?.length || 0} {data?.data?.length === 1 ? "result" : "results"} found
        </p>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 gap-5">
        {data?.data?.length > 0 ? (
          data?.data?.map((post: TPost) => <PostCard key={post._id} post={post} />)
        ) : (
          <div className="bg-content1 rounded-2xl border border-divider">
            <EmptyState
              type="search"
              title="No Results Found"
              description={`We couldn't find any posts matching "${search}". Try different keywords or check your spelling.`}
              actionLabel="Go Back"
              onAction={() => router.back()}
              secondaryActionLabel="Browse All"
              onSecondaryAction={() => router.push("/")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Next 16 requires useSearchParams() behind a Suspense boundary during prerender.
const Page = () => (
  <Suspense
    fallback={
      <div className="max-w-5xl mx-auto px-4 my-8">
        <div className="grid grid-cols-1 gap-5">
          {[1, 2, 3].map((i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      </div>
    }
  >
    <SearchResults />
  </Suspense>
);

export default Page;
