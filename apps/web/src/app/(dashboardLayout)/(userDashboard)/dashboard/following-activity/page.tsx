"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/react";
import { FileText } from "lucide-react";
import { getMyPosts } from "@/services/PostService";
import { TPost } from "@/types/TPost";
import EmptyState from "@/components/ui/EmptyState";
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

  useEffect(() => {
    let cancelled = false;
    const fetchActivity = async () => {
      try {
        setLoading(true);
        setLoadError(false);
        const { data: posts } = await getMyPosts("");
        // Real activity derived from the user's own publishing history.
        const entries = ((posts ?? []) as TPost[])
          .slice()
          .sort(
            (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
          )
          .slice(0, 20)
          .map((post) => ({
            id: post._id,
            action: "Published a post",
            date: post.createdAt,
            description: post.title || "Untitled post",
            href: `/posts/${post._id}`,
          }));
        if (!cancelled) setActivities(entries);
      } catch (error) {
        console.error("Error fetching activity:", error);
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void fetchActivity();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container mx-auto p-6 bg-default-50 shadow-lg rounded-lg">
      <h1 className="text-2xl mb-6 border-l-5 border-primary font-bold pl-5">Recent Activities</h1>

      {loading ? (
        <div className="space-y-4" role="status" aria-label="Loading activity...">
          <CommentSkeleton />
          <CommentSkeleton />
          <CommentSkeleton />
        </div>
      ) : loadError ? (
        <div className="bg-content1 rounded-2xl border border-divider">
          <EmptyState
            type="custom"
            title="Couldn't load activity"
            description="We couldn't fetch your recent activity. Check your connection and try again."
            actionLabel="Try Again"
            onAction={() => window.location.reload()}
          />
        </div>
      ) : activities.length === 0 ? (
        <div className="bg-content1 rounded-2xl border border-divider">
          <EmptyState
            type="posts"
            title="No activity yet"
            description="Your publishing activity will show up here once you create posts."
            actionLabel="Create a Post"
            onAction={() => router.push("/dashboard/create-post")}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-md transition-shadow duration-300">
              <CardBody className="flex flex-row items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <FileText className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="font-semibold">{activity.action}</span>
                    <span className="text-sm text-default-500">
                      {formatActivityDate(activity.date)}
                    </span>
                  </div>
                  {activity.href ? (
                    <Link
                      href={activity.href}
                      className="text-default-700 hover:text-primary-fg transition-colors"
                    >
                      {activity.description}
                    </Link>
                  ) : (
                    <p className="text-default-700">{activity.description}</p>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityPage;
