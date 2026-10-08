"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody } from "@heroui/react";
import { ChevronRight, FileText, PenSquare } from "lucide-react";
import { getMyPosts } from "@/services/PostService";
import { TPost } from "@/types/TPost";
import EmptyState from "@/components/ui/EmptyState";
import PageHeader from "@/components/ui/PageHeader";
import { Activity } from "lucide-react";
import { CommentSkeleton } from "@/components/ui/Skeleton";

interface ActivityEntry {
  id: string;
  action: string;
  date: string;
  description: string;
  href?: string;
}

const formatActivityDate = (value?: string): string => {
  if (!value) return "Unknown date";
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "Unknown date";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ActivityPage = () => {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const fetchActivity = React.useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(false);
      const { data: posts } = await getMyPosts("");
      // Real activity derived from the user's own publishing history.
      const entries = ((posts ?? []) as TPost[])
        .slice()
        .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
        .slice(0, 20)
        .map((post) => ({
          id: post._id,
          action: "Published a post",
          date: post.createdAt,
          description: post.title || "Untitled post",
          href: `/posts/${post._id}`,
        }));
      setActivities(entries);
    } catch (error) {
      console.error("Error fetching activity:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchActivity();
  }, [fetchActivity]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <PageHeader
        title="My Recent Activity"
        subtitle="Your latest publishing activity — newest first."
        icon={Activity}
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

      {loading ? (
        <div className="space-y-4" role="status" aria-label="Loading activity...">
          <CommentSkeleton />
          <CommentSkeleton />
          <CommentSkeleton />
        </div>
      ) : loadError ? (
        <div className="surface overflow-hidden rounded-2xl">
          <EmptyState
            type="custom"
            title="Couldn't load activity"
            description="We couldn't fetch your recent activity. Check your connection and try again."
            actionLabel="Try Again"
            onAction={() => void fetchActivity()}
          />
        </div>
      ) : activities.length === 0 ? (
        <div className="surface overflow-hidden rounded-2xl">
          <EmptyState
            type="posts"
            title="No activity yet"
            description="Your publishing activity will show up here once you create posts."
            actionLabel="Create a Post"
            onAction={() => router.push("/dashboard/create-post")}
          />
        </div>
      ) : (
        <ol className="space-y-3">
          {activities.map((activity) => (
            <li key={activity.id}>
              <Card className="surface hover-lift overflow-hidden">
                <CardBody className="flex flex-row items-center gap-4 p-4">
                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-fg"
                  >
                    <FileText size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-default-400">
                      {activity.action} · {formatActivityDate(activity.date)}
                    </p>
                    {activity.href ? (
                      <Link
                        href={activity.href}
                        className="group mt-0.5 flex items-center gap-1 font-semibold text-foreground transition-colors hover:text-primary-fg"
                      >
                        <span className="truncate">{activity.description}</span>
                        <ChevronRight
                          size={15}
                          aria-hidden="true"
                          className="shrink-0 text-default-400 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-fg"
                        />
                      </Link>
                    ) : (
                      <p className="mt-0.5 truncate font-semibold text-foreground">
                        {activity.description}
                      </p>
                    )}
                  </div>
                </CardBody>
              </Card>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default ActivityPage;
