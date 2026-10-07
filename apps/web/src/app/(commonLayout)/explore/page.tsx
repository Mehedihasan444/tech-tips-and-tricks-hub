"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Input,
  Tab,
  Tabs,
} from "@heroui/react";
import { Compass, Flame, Hash, Search, TrendingUp, Users, UserPlus, Crown } from "lucide-react";
import { getPosts } from "@/services/PostService";
import { getSuggestedUsers } from "@/services/UserService";
import PostCard from "../components/PostCard";
import EmptyState from "@/components/ui/EmptyState";
import { PostCardSkeleton, UserCardSkeleton } from "@/components/ui/Skeleton";
import { useUser } from "@/context/user.provider";
import { useUpdateUser } from "@/hooks/user.hook";
import { TPost } from "@/types/TPost";
import { IUser } from "@/types/IUser";

interface TagCount {
  tag: string;
  count: number;
}

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab =
    searchParams.get("tab") === "people"
      ? "people"
      : searchParams.get("tab") === "tags"
        ? "tags"
        : "trending";
  const [tab, setTab] = useState<string>(initialTab);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [posts, setPosts] = useState<TPost[]>([]);
  const [people, setPeople] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [error, setError] = useState(false);
  const [followingId, setFollowingId] = useState<string | null>(null);
  const { user: loggedInUser } = useUser();
  const { mutate: handleUserUpdate } = useUpdateUser();

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await getPosts(1, 30);
        const list: TPost[] = res?.data?.data ?? res?.data ?? [];
        if (!cancelled) setPosts(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) {
          setError(true);
          setPosts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const fetchPeople = async () => {
      try {
        setPeopleLoading(true);
        const res = await getSuggestedUsers(12);
        const list = res?.data?.data ?? res?.data ?? [];
        if (!cancelled) setPeople(Array.isArray(list) ? list : []);
      } catch {
        if (!cancelled) setPeople([]);
      } finally {
        if (!cancelled) setPeopleLoading(false);
      }
    };
    void fetchPeople();
    return () => {
      cancelled = true;
    };
  }, []);

  const tags: TagCount[] = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((p) => {
      (p.tags ?? []).forEach((t: string) => {
        const key = t.startsWith("#") ? t : `#${t}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      });
      if (p.category) {
        const c = `#${p.category.replace(/\s+/g, "")}`;
        counts.set(c, (counts.get(c) ?? 0) + 1);
      }
    });
    return Array.from(counts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 24);
  }, [posts]);

  const trending = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...posts].sort(
      (a, b) =>
        (b.likes ?? 0) +
        (b.comments?.length ?? 0) * 2 -
        ((a.likes ?? 0) + (a.comments?.length ?? 0) * 2),
    );
    if (!q) return sorted.slice(0, 12);
    return sorted.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        (p.tags ?? []).some((t: string) => t.toLowerCase().includes(q)),
    );
  }, [posts, query]);

  const filteredPeople = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return people;
    return people.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.nickName?.toLowerCase().includes(q) ||
        u.profession?.toLowerCase().includes(q),
    );
  }, [people, query]);

  const handleFollow = (userId: string) => {
    if (!loggedInUser || followingId) return;
    setFollowingId(userId);
    handleUserUpdate(
      { userId, userData: { loggedInUserId: loggedInUser._id } },
      { onSettled: () => setFollowingId(null) },
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <Compass className="text-primary" size={28} />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore</h1>
          <p className="text-sm text-default-500">Trending posts, topics and people to follow</p>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          startContent={<Search size={16} className="text-default-400" />}
          placeholder="Search posts, tags or people..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xl"
          aria-label="Search explore"
        />
        <Tabs
          selectedKey={tab}
          onSelectionChange={(k) => setTab(String(k))}
          color="primary"
          variant="underlined"
        >
          <Tab
            key="trending"
            title={
              <span className="flex items-center gap-1.5">
                <Flame size={15} /> Trending
              </span>
            }
          />
          <Tab
            key="tags"
            title={
              <span className="flex items-center gap-1.5">
                <Hash size={15} /> Topics
              </span>
            }
          />
          <Tab
            key="people"
            title={
              <span className="flex items-center gap-1.5">
                <Users size={15} /> People
              </span>
            }
          />
        </Tabs>
      </div>

      {tab === "trending" && (
        <div className="space-y-4">
          {loading ? (
            [1, 2, 3].map((i) => <PostCardSkeleton key={i} />)
          ) : error ? (
            <div className="rounded-2xl border border-divider bg-content1">
              <EmptyState
                type="posts"
                title="Couldn't load trending"
                description="Check your connection and try again."
                actionLabel="Retry"
                onAction={() => window.location.reload()}
              />
            </div>
          ) : trending.length === 0 ? (
            <div className="rounded-2xl border border-divider bg-content1">
              <EmptyState
                type="search"
                title="Nothing found"
                description={query ? `No posts match "${query}".` : "No trending posts yet."}
                actionLabel="Browse feed"
                onAction={() => router.push("/")}
              />
            </div>
          ) : (
            <>
              <p className="flex items-center gap-2 text-sm text-default-500">
                <TrendingUp size={15} /> {trending.length} trending{" "}
                {trending.length === 1 ? "post" : "posts"}
              </p>
              {trending.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </>
          )}
        </div>
      )}

      {tab === "tags" && (
        <div>
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-default-200" />
              ))}
            </div>
          ) : tags.length === 0 ? (
            <div className="rounded-2xl border border-divider bg-content1">
              <EmptyState
                type="search"
                title="No topics yet"
                description="Topics appear once posts use tags or categories."
                actionLabel="Browse feed"
                onAction={() => router.push("/")}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {tags
                .filter(
                  (t) => !query.trim() || t.tag.toLowerCase().includes(query.trim().toLowerCase()),
                )
                .map((t, i) => (
                  <button
                    key={t.tag}
                    onClick={() =>
                      router.push(`/posts?query=${encodeURIComponent(t.tag.replace(/^#/, ""))}`)
                    }
                    className="group rounded-2xl border border-divider bg-content1 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Hash size={17} />
                      </span>
                      <Chip size="sm" variant="flat" color={i < 3 ? "warning" : "default"}>
                        #{i + 1}
                      </Chip>
                    </div>
                    <p className="mt-3 truncate font-semibold group-hover:text-primary">{t.tag}</p>
                    <p className="text-xs text-default-500">
                      {t.count} {t.count === 1 ? "post" : "posts"}
                    </p>
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {tab === "people" && (
        <div>
          {peopleLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <UserCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredPeople.length === 0 ? (
            <div className="rounded-2xl border border-divider bg-content1">
              <EmptyState
                type="friends"
                title="No people found"
                description={query ? `No people match "${query}".` : "No suggestions right now."}
                actionLabel="Browse feed"
                onAction={() => router.push("/")}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPeople.map((u) => {
                const alreadyFollowing = loggedInUser?.following?.some(
                  (f: IUser) => f._id === u._id,
                );
                const isSelf = loggedInUser?._id === u._id;
                return (
                  <Card key={u._id} className="p-5">
                    <CardHeader className="flex items-center gap-3 p-0">
                      <Avatar
                        src={u.profilePhoto}
                        name={u.name?.trim() ? u.name : "?"}
                        size="lg"
                        isBordered
                        color={u.isPremium ? "warning" : "primary"}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 truncate font-semibold">
                          <span className="truncate">{u.name}</span>
                          {u.isPremium && (
                            <Crown size={14} className="shrink-0 fill-warning text-warning" />
                          )}
                        </p>
                        <p className="truncate text-xs text-default-500">
                          @{u.nickName} {u.profession ? `· ${u.profession}` : ""}
                        </p>
                      </div>
                    </CardHeader>
                    <CardBody className="p-0 pt-4">
                      {u.bio && (
                        <p className="mb-3 line-clamp-2 text-sm text-default-600">{u.bio}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-default-500">
                          {u.followers?.length ?? 0} followers
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            onPress={() => router.push(`/profile/${u.nickName}`)}
                          >
                            View
                          </Button>
                          {!isSelf && !alreadyFollowing && (
                            <Button
                              size="sm"
                              color="primary"
                              startContent={<UserPlus size={14} />}
                              isLoading={followingId === u._id}
                              isDisabled={followingId !== null}
                              onPress={() => handleFollow(u._id)}
                            >
                              Follow
                            </Button>
                          )}
                          {alreadyFollowing && (
                            <Chip size="sm" variant="flat" color="success">
                              Following
                            </Chip>
                          )}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      <Divider className="my-8" />
      <p className="text-center text-xs text-default-400">
        Tip: follow topics by searching a tag, e.g. #react, #javascript
      </p>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl space-y-4 px-4 py-6">
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
