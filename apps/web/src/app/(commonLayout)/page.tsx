"use client";
import { TPost } from "@/types/TPost";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, Button, Card, CardBody, CardHeader, Divider, Chip, Skeleton } from "@nextui-org/react";
import { getPosts } from "@/services/PostService";
import CreatePost from "./components/modal/CreatePost";
import PostFilter from "./components/PostFilter";
import PostCard from "./components/PostCard";
import { StoriesSection } from "./components/stories/stories-section";
import { UserPlus, TrendingUp } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { PostCardSkeleton } from "@/components/ui/Skeleton";
import { useUser } from "@/context/user.provider";
import { useUpdateUser } from "@/hooks/user.hook";
import { IUser } from "@/types/IUser";
import envConfig from "@/config/envConfig";

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
  const loaderRef = useRef<HTMLDivElement>(null);
  
  // Dynamic data states
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [loadingTrending, setLoadingTrending] = useState(true);
  
  const { user: loggedInUser } = useUser();
  const { mutate: handleUserUpdate } = useUpdateUser();

  // Fetch suggested users using fetch API (client-safe)
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        setLoadingSuggestions(true);
        const response = await fetch(`${envConfig.baseApi}/users?limit=5`);
        const result = await response.json();
        const users = result?.data?.data || result?.data || [];
        // Filter out the logged-in user and users already followed
        const filteredUsers = users.filter((u: SuggestedUser) => 
          u._id !== loggedInUser?._id && 
          !loggedInUser?.following?.some((f: IUser) => f._id === u._id)
        ).slice(0, 3);
        setSuggestedUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching suggested users:', error);
        setSuggestedUsers([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchSuggestedUsers();
  }, [loggedInUser]);

  // Calculate trending topics from posts
  useEffect(() => {
    const calculateTrendingTopics = () => {
      setLoadingTrending(true);
      try {
        // Count tags from loaded posts
        const tagCounts = new Map<string, number>();
        
        data.forEach((post: TPost) => {
          if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach((tag: string) => {
              const normalizedTag = tag.startsWith('#') ? tag : `#${tag}`;
              tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1);
            });
          }
          // Also count categories
          if (post.category) {
            const categoryTag = `#${post.category.replace(/\s+/g, '')}`;
            tagCounts.set(categoryTag, (tagCounts.get(categoryTag) || 0) + 1);
          }
        });

        // Sort by count and take top 5
        const sortedTopics = Array.from(tagCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([tag, count]) => ({ tag, count }));

        // If we have less than 5, add some defaults
        const defaultTopics = ['#WebDevelopment', '#JavaScript', '#React', '#TypeScript', '#Programming'];
        while (sortedTopics.length < 5) {
          const defaultTag = defaultTopics[sortedTopics.length];
          if (!sortedTopics.find(t => t.tag === defaultTag)) {
            sortedTopics.push({ tag: defaultTag, count: Math.floor(Math.random() * 5000) + 1000 });
          }
        }

        setTrendingTopics(sortedTopics);
      } catch (error) {
        console.error('Error calculating trending topics:', error);
        setTrendingTopics([
          { tag: '#WebDevelopment', count: 10200 },
          { tag: '#JavaScript', count: 9400 },
          { tag: '#React', count: 8100 },
          { tag: '#TypeScript', count: 6500 },
          { tag: '#Programming', count: 4200 },
        ]);
      } finally {
        setLoadingTrending(false);
      }
    };

    if (data.length > 0) {
      calculateTrendingTopics();
    }
  }, [data]);

  const handleFollow = (userId: string) => {
    if (!loggedInUser) return;
    const userData = {
      loggedInUserId: loggedInUser._id,
    };
    handleUserUpdate({ userId, userData });
    // Remove from suggestions after following
    setSuggestedUsers(prev => prev.filter(u => u._id !== userId));
  };

  // Initial fetch on mount
  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        setInitialLoading(true);
        const limit = 10;
        const response = await getPosts(1, limit);
        const { data: postsData } = response?.data || {};
        const newPosts = postsData || [];
        setData(newPosts);
        setPage(2);
        setHasMore(newPosts.length >= limit);
      } catch (error) {
        console.error('Error fetching initial posts:', error);
        setData([]);
      } finally {
        setInitialLoading(false);
        setLoading(false);
      }
    };

    fetchInitialPosts();
  }, []);

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore || initialLoading) return;
    setLoading(true);
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
      console.error('Error loading more posts:', error);
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
      observer.observe(loaderRef.current);
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
            {/* Stories Section */}
            <div className="bg-content1 rounded-2xl shadow-sm border border-divider overflow-hidden">
              <StoriesSection />
            </div>

            {/* Create Post & Filter Section */}
            <div className="bg-content1 rounded-2xl shadow-sm border border-divider p-4">
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
                <div className="space-y-4">
                  {/* Skeleton loaders for initial load */}
                  {[1, 2, 3].map((i) => (
                    <PostCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <>
                  {data?.length > 0 ? (
                    data?.map((post: TPost) => (
                      <PostCard key={post._id} post={post} />
                    ))
                  ) : (
                    <div className="bg-content1 rounded-2xl border border-divider">
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

            {/* Infinite scroll trigger */}
            <div ref={loaderRef} className="h-10"></div>
          </div>

          {/* Right Sidebar - Friend Suggestions */}
          <aside className="hidden xl:block w-80 sticky top-20 h-fit">
            <Card className="shadow-sm border border-divider">
              <CardHeader className="flex justify-between items-center pb-3">
                <h3 className="text-lg font-semibold">Suggested For You</h3>
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
                ) : suggestedUsers.length === 0 ? (
                  <div className="text-center py-4 text-default-500">
                    <p className="text-sm">No suggestions available</p>
                  </div>
                ) : (
                  suggestedUsers.map((user) => (
                    <div key={user._id} className="flex items-start gap-3 group">
                      <Avatar
                        src={user.profilePhoto}
                        name={user.name?.charAt(0)}
                        size="md"
                        className="flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
                        isBordered
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
                          {user.name}
                        </p>
                        <p className="text-xs text-default-500 truncate">
                          {user.profession || user.nickName}
                        </p>
                        <p className="text-xs text-default-400 mt-1">
                          {user.followers?.length || 0} followers
                        </p>
                      </div>
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        startContent={<UserPlus size={14} />}
                        className="flex-shrink-0"
                        onPress={() => handleFollow(user._id)}
                      >
                        Follow
                      </Button>
                    </div>
                  ))
                )}

                <Divider className="my-2" />

                <Button
                  variant="light"
                  color="primary"
                  className="w-full font-semibold"
                  as="a"
                  href="/community"
                >
                  See All Suggestions
                </Button>
              </CardBody>
            </Card>

            {/* Trending Topics Card */}
            <Card className="shadow-sm border border-divider mt-4">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-primary" />
                  <h3 className="text-lg font-semibold">Trending Topics</h3>
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
                ) : (
                  trendingTopics.map((topic, index) => (
                    <button
                      key={topic.tag}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-default-100 transition-colors text-left group w-full"
                    >
                      <div>
                        <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                          {topic.tag}
                        </p>
                        <p className="text-xs text-default-400">
                          {topic.count >= 1000 
                            ? `${(topic.count / 1000).toFixed(1)}K` 
                            : topic.count} posts
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