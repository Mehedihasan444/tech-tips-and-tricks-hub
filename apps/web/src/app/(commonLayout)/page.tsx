"use client";
import { TPost } from "@/types/TPost";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, Button, Card, CardBody, CardHeader, Divider, Chip, Skeleton } from "@heroui/react";
import { getPosts } from "@/services/PostService";
import { getSuggestedUsers } from "@/services/UserService";
import { useRouter } from "next/navigation";
import CreatePost from "./components/modal/CreatePost";
import PostFilter from "./components/PostFilter";
import PostCard from "./components/PostCard";
import { StoriesSection } from "./components/stories/stories-section";
import { UserPlus, TrendingUp, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { PostCardSkeleton } from "@/components/ui/Skeleton";
import { useUser } from "@/context/user.provider";
import { useUpdateUser } from "@/hooks/user.hook";
import { POSTS_CHANGED_EVENT } from "@/hooks/post.hook";
import { IUser } from "@/types/IUser";

interface SuggestedUser {
  _id: string;
  name: string;
  nickName: string;
  profilePhoto: string;
  profession?: string;
  followers?: IUser[];
}

interface TrendingTopic {
  tag: string;
  count: number;
}

const NewsFeed = () => {
  const [data, setData] = useState<TPost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [feedError, setFeedError] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(false);
  const [followingId, setFollowingId] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Dynamic data states
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);

  const { user: loggedInUser } = useUser();
  const { mutate: handleUserUpdate } = useUpdateUser();

  // Suggested users come from a Server Action: calling the API from the browser
  // sent no Authorization header (the token lives in an httpOnly cookie) and
  // exposed the internal base URL.
  useEffect(() => {
    let cancelled = false;
    const fetchSuggestedUsers = async () => {
      try {
        setLoadingSuggestions(true);
        setSuggestionsError(false);
        const result = await getSuggestedUsers(5);
        const users = result?.data?.data || result?.data || [];
        // Filter out the logged-in user and users already followed
        const filteredUsers = users
          .filter(
            (u: SuggestedUser) =>
              u._id !== loggedInUser?._id &&
              !loggedInUser?.following?.some((f: IUser) => f._id === u._id),
          )
          .slice(0, 3);
        if (!cancelled) setSuggestedUsers(filteredUsers);
      } catch (error) {
        console.error("Error fetching suggested users:", error);
        if (!cancelled) {
          setSuggestedUsers([]);
          setSuggestionsError(true);
        }
      } finally {
        if (!cancelled) setLoadingSuggestions(false);
      }
    };

    fetchSuggestedUsers();
    return () => {
      cancelled = true;
    };
  }, [loggedInUser]);

  // Calculate trending topics from loaded posts (real counts only — no filler).
  useEffect(() => {
    if (data.length === 0) {
      setTrendingTopics([]);
      setLoadingTrending(false);
      return;
    }
    const calculateTrendingTopics = () => {
      setLoadingTrending(true);
      try {
        // Count tags from loaded posts
        const tagCounts = new Map<string, number>();

        data.forEach((post: TPost) => {
          if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach((tag: string) => {
              const normalizedTag = tag.startsWith("#") ? tag : `#${tag}`;
              tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1);
            });
          }
          // Also count categories
          if (post.category) {
            const categoryTag = `#${post.category.replace(/\s+/g, "")}`;
            tagCounts.set(categoryTag, (tagCounts.get(categoryTag) || 0) + 1);
          }
        });

        // Sort by count and take top 5
        const sortedTopics = Array.from(tagCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([tag, count]) => ({ tag, count }));

        setTrendingTopics(sortedTopics);
      } catch (error) {
        console.error("Error calculating trending topics:", error);
        setTrendingTopics([]);
      } finally {
        setLoadingTrending(false);
      }
    };

    calculateTrendingTopics();
  }, [data]);

  const handleFollow = (userId: string) => {
    if (!loggedInUser || followingId) return;
    const removed = suggestedUsers.find((u) => u._id === userId);
    const userData = {
      loggedInUserId: loggedInUser._id,
    };
    setFollowingId(userId);
    // Optimistic remove; restore on failure so a failed follow never vanishes.
    setSuggestedUsers((prev) => prev.filter((u) => u._id !== userId));
    handleUserUpdate(
      { userId, userData },
      {
        onError: () => {
          if (removed) setSuggestedUsers((prev) => [removed, ...prev]);
        },
        onSettled: () => setFollowingId(null),
      },
    );
  };

  // Initial fetch on mount
  const fetchFirstPage = useCallback(async () => {
    try {
      setInitialLoading(true);
      setFeedError(false);
      const limit = 10;
      const response = await getPosts(1, limit);
      const { data: postsData } = response?.data || {};
      const newPosts = postsData || [];
      setData(newPosts);
      setPage(2);
      setHasMore(newPosts.length >= limit);
    } catch (error) {
      console.error("Error fetching initial posts:", error);
      setData([]);
      setFeedError(true);
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFirstPage();
  }, [fetchFirstPage]);

  // Refetch when a post is created/updated/deleted. Previously this never
  // happened: the invalidation targeted a query key nothing registered.
  useEffect(() => {
    window.addEventListener(POSTS_CHANGED_EVENT, fetchFirstPage);
    return () => window.removeEventListener(POSTS_CHANGED_EVENT, fetchFirstPage);
  }, [fetchFirstPage]);

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore || initialLoading) return;
    setLoading(true);
    setLoadMoreError(false);
    try {
      const limit = 10;
      const response = await getPosts(page, limit);
      const { data: postsData } = response?.data || {};
      const newPosts = postsData || [];
      if (newPosts.length > 0) {
        setPage((prevPage) => prevPage + 1);
        setData((prevData) => [...prevData, ...newPosts]);
      }
      setHasMore(newPosts.length >= limit);
    } catch (error) {
      console.error("Error loading more posts:", error);
      setLoadMoreError(true);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading, initialLoading]);

  useEffect(() => {
    const currentLoader = loaderRef.current;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        loadMorePosts();
      }
    });

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loaderRef, loadMorePosts, hasMore, loading]);

  return (
    <div className="flex min-h-screen bg-default-50">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navigation Bar */}
        {/* <NavigationBar /> */}

        {/* Content Grid */}
        <div className="flex gap-6 px-6 py-4 max-w-[1600px] mx-auto w-full">
          {/* Main Feed */}
          <div className="flex-1 max-w-3xl mx-auto w-full space-y-6">
            {/* Welcome hero for visitors — hidden once logged in */}
            {!loggedInUser && (
              <section className="hero-premium relative overflow-hidden rounded-2xl shadow-card border border-white/10 animate-fade-up">
                <div
                  className="hero-grid pointer-events-none absolute inset-0"
                  aria-hidden="true"
                />
                <div className="relative p-6 sm:p-8">
                  <Chip
                    size="sm"
                    variant="flat"
                    startContent={<Sparkles size={14} />}
                    className="bg-white/10 text-white backdrop-blur border border-white/15"
                  >
                    Community-driven knowledge
                  </Chip>
                  <h1 className="mt-4 max-w-xl text-balance text-3xl sm:text-4xl font-extrabold leading-tight text-white">
                    Level up your stack, one tip at a time.
                  </h1>
                  <p className="mt-3 max-w-xl text-sm sm:text-base text-white/80">
                    Bite-size tutorials, real-world fixes, and premium deep-dives from engineers
                    shipping in production. Free forever — no spam, just signal.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      as="a"
                      href="/register"
                      className="bg-white font-semibold text-primary-800"
                      endContent={<ArrowRight size={16} />}
                    >
                      Join the community
                    </Button>
                    <Button
                      as="a"
                      href="/posts"
                      variant="bordered"
                      className="border-white/30 text-white font-semibold"
                    >
                      Explore posts
                    </Button>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-xs text-white/70">
                    <ShieldCheck size={14} />
                    <span>Free forever · Real engineers · New tips daily</span>
                  </div>
                </div>
              </section>
            )}

            {/* Stories Section */}
            <div className="bg-content1 rounded-2xl surface overflow-hidden">
              <StoriesSection />
            </div>

            {/* Create Post & Filter Section */}
            <div className="bg-content1 rounded-2xl surface p-4">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex-shrink-0">
                  <CreatePost />
                </div>
                <div className="flex-1 w-full sm:w-auto flex flex-row justify-end">
                  <PostFilter setData={setData} />
                </div>
              </div>
            </div>

            {/* Posts Section */}
            <div className="space-y-4">
              {initialLoading ? (
                <div className="space-y-4" role="status" aria-label="Loading posts...">
                  {/* Skeleton loaders for initial load */}
                  {[1, 2, 3].map((i) => (
                    <PostCardSkeleton key={i} />
                  ))}
                </div>
              ) : feedError ? (
                <div className="bg-content1 rounded-2xl surface overflow-hidden">
                  <EmptyState
                    type="posts"
                    title="Couldn't load posts"
                    description="Something went wrong while loading the feed. Check your connection and try again."
                    actionLabel="Try Again"
                    onAction={() => void fetchFirstPage()}
                  />
                </div>
              ) : (
                <>
                  {data?.length > 0 ? (
                    data?.map((post: TPost) => <PostCard key={post._id} post={post} />)
                  ) : (
                    <div className="bg-content1 rounded-2xl surface overflow-hidden">
                      <EmptyState
                        type="posts"
                        title="No Posts Found"
                        description="Be the first to share something amazing with the community! Your insights could help others."
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Loading More Indicator */}
            {loading && data?.length > 0 && (
              <div className="space-y-4">
                <PostCardSkeleton />
              </div>
            )}

            {/* Load-more failure */}
            {loadMoreError && !loading && (
              <div className="bg-content1 rounded-2xl surface p-6 text-center">
                <p className="text-sm text-default-500 mb-3">
                  Couldn&apos;t load more posts. Check your connection.
                </p>
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  onPress={() => void loadMorePosts()}
                >
                  Retry
                </Button>
              </div>
            )}

            {/* End of feed */}
            {!initialLoading && !feedError && !hasMore && data?.length > 0 && (
              <p className="text-center text-sm text-default-600 py-2">
                You&apos;re all caught up 🎉
              </p>
            )}

            {/* Infinite scroll trigger */}
            <div ref={loaderRef} className="h-10"></div>
          </div>

          {/* Right Sidebar - Friend Suggestions */}
          <aside className="hidden xl:block w-80 sticky top-20 h-fit space-y-4">
            <Card className="surface overflow-hidden">
              <CardHeader className="flex justify-between items-center pb-3">
                <h3 className="text-lg font-semibold tracking-tight">Suggested For You</h3>
                <Chip size="sm" variant="flat" color="primary">
                  New
                </Chip>
              </CardHeader>
              <Divider />
              <CardBody className="gap-4 p-4">
                {loadingSuggestions ? (
                  // Loading skeleton for suggestions
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Skeleton className="rounded-full w-10 h-10" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-24 rounded" />
                        <Skeleton className="h-2 w-16 rounded" />
                        <Skeleton className="h-2 w-20 rounded" />
                      </div>
                      <Skeleton className="h-8 w-16 rounded" />
                    </div>
                  ))
                ) : suggestionsError ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-default-500 mb-2">Couldn&apos;t load suggestions</p>
                    <Button
                      size="sm"
                      variant="light"
                      color="primary"
                      onPress={() => router.refresh()}
                    >
                      Retry
                    </Button>
                  </div>
                ) : suggestedUsers.length === 0 ? (
                  <div className="text-center py-4 text-default-500">
                    <p className="text-sm">No suggestions available</p>
                  </div>
                ) : (
                  suggestedUsers.map((user) => (
                    <div key={user._id} className="flex items-start gap-3 group">
                      <Avatar
                        src={user.profilePhoto}
                        name={user.name?.trim() ? user.name : "?"}
                        size="md"
                        className="flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary/30 transition-all duration-200"
                        isBordered
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate group-hover:text-primary-fg transition-colors">
                          {user.name}
                        </p>
                        <p className="text-xs text-default-500 truncate">
                          {user.profession || user.nickName}
                        </p>
                        <p className="text-xs text-default-600 mt-1">
                          {user.followers?.length || 0} followers
                        </p>
                      </div>
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        startContent={<UserPlus size={14} />}
                        className="flex-shrink-0"
                        isLoading={followingId === user._id}
                        isDisabled={followingId !== null}
                        onPress={() => handleFollow(user._id)}
                      >
                        {followingId === user._id ? "Following" : "Follow"}
                      </Button>
                    </div>
                  ))
                )}

                <Divider className="my-2" />

                <Button
                  variant="light"
                  color="primary"
                  radius="full"
                  className="w-full font-semibold"
                  as="a"
                  href="/community"
                >
                  See All Suggestions
                </Button>
              </CardBody>
            </Card>

            {/* Trending Topics Card */}
            <Card className="surface overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-primary-fg" />
                  <h3 className="text-lg font-semibold tracking-tight">Trending Topics</h3>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="gap-3 p-4">
                {loadingTrending ? (
                  // Loading skeleton for trending
                  [...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-2">
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-28 rounded" />
                        <Skeleton className="h-2 w-16 rounded" />
                      </div>
                      <Skeleton className="h-6 w-8 rounded" />
                    </div>
                  ))
                ) : trendingTopics.length === 0 ? (
                  <p className="text-sm text-default-600 text-center py-2">
                    No trending topics yet — check back after more posts are published.
                  </p>
                ) : (
                  trendingTopics.map((topic, index) => (
                    <button
                      key={topic.tag}
                      onClick={() =>
                        router.push(
                          `/posts?query=${encodeURIComponent(topic.tag.replace(/^#/, ""))}`,
                        )
                      }
                      aria-label={`Search posts about ${topic.tag}`}
                      className="flex items-center justify-between p-2.5 rounded-xl transition-colors duration-200 text-left group w-full hover:bg-default-200/60 focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <div>
                        <p className="text-sm font-semibold group-hover:text-primary-fg transition-colors">
                          {topic.tag}
                        </p>
                        <p className="text-xs text-default-600">
                          {topic.count >= 1000
                            ? `${(topic.count / 1000).toFixed(1)}K`
                            : topic.count}{" "}
                          posts
                        </p>
                      </div>
                      <Chip size="sm" variant="flat" color="warning">
                        #{index + 1}
                      </Chip>
                    </button>
                  ))
                )}
              </CardBody>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default NewsFeed;
