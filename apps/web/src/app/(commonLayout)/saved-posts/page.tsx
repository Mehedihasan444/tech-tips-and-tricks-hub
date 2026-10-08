"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Bookmark, Search } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import PageHeader from "@/components/ui/PageHeader";
import PostCard from "../components/PostCard";
import { TPost } from "@/types/TPost";
import { clearSavedPosts, getSavedPosts, SAVED_POSTS_EVENT } from "@/utils/bookmarks";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";

const SavedPosts = () => {
  const router = useRouter();
  const [savedPosts, setSavedPosts] = useState<TPost[]>([]);
  const [query, setQuery] = useState("");

  const refresh = useCallback(() => setSavedPosts(getSavedPosts()), []);

  useEffect(() => {
    refresh();
    // Stay in sync when bookmarks change in another tab, on the feed,
    // or when the user returns to this tab.
    window.addEventListener("storage", refresh);
    window.addEventListener(SAVED_POSTS_EVENT, refresh);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(SAVED_POSTS_EVENT, refresh);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  const [confirmClear, setConfirmClear] = useState(false);

  const handleClearAll = () => {
    clearSavedPosts();
    setSavedPosts([]);
    setConfirmClear(false);
  };

  const q = query.trim().toLowerCase();
  const visible = q
    ? savedPosts.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          (p.tags ?? []).some((t: string) => t.toLowerCase().includes(q)),
      )
    : savedPosts;

  return (
    <div className="mx-auto max-w-5xl p-4">
      <PageHeader
        title="Saved Posts"
        subtitle="Posts you bookmarked on this device."
        icon={Bookmark}
        actions={
          savedPosts.length > 0 ? (
            <Button size="sm" variant="light" color="danger" onPress={() => setConfirmClear(true)}>
              Clear all
            </Button>
          ) : undefined
        }
      />
      <ConfirmationModal
        isOpen={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={handleClearAll}
        title="Clear saved posts?"
        message="This removes all bookmarked posts from this device. This cannot be undone."
        confirmText="Clear all"
        type="danger"
      />

      {savedPosts.length === 0 ? (
        <div className="bg-content1 rounded-2xl border border-divider">
          <EmptyState
            type="bookmarks"
            title="No Saved Posts"
            description="Save posts you want to read later by clicking the bookmark icon. They'll appear here for easy access."
            actionLabel="Explore Posts"
            onAction={() => router.push("/explore")}
          />
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-default-500">
              {visible.length} of {savedPosts.length} saved{" "}
              {savedPosts.length === 1 ? "post" : "posts"} on this device
            </p>
            <Input
              startContent={<Search size={15} className="text-default-400" />}
              placeholder="Filter saved posts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              size="sm"
              className="max-w-xs"
              aria-label="Filter saved posts"
            />
          </div>
          {visible.length === 0 ? (
            <div className="bg-content1 rounded-2xl border border-divider p-10 text-center">
              <p className="font-semibold">No saved posts match &quot;{query}&quot;</p>
              <Button
                className="mt-4"
                size="sm"
                variant="flat"
                color="primary"
                onPress={() => setQuery("")}
              >
                Clear filter
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {visible.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SavedPosts;
