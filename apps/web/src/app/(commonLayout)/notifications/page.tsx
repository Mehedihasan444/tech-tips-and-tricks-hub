"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button, Card, CardBody, Chip, Input, Tab, Tabs } from "@heroui/react";
import {
  AtSign,
  Bell,
  Check,
  Heart,
  MessageCircle,
  Reply,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useSocket, Notification } from "@/context/socket.provider";
import { formatDistanceToNow } from "date-fns";
import EmptyState from "@/components/ui/EmptyState";

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "like":
      return <Heart className="text-danger" size={16} />;
    case "comment":
      return <MessageCircle className="text-primary" size={16} />;
    case "follow":
      return <UserPlus className="text-success" size={16} />;
    case "mention":
      return <AtSign className="text-warning" size={16} />;
    case "reply":
      return <Reply className="text-secondary" size={16} />;
    default:
      return <Bell size={16} />;
  }
};

type FilterKey = "all" | "unread" | "like" | "comment" | "follow" | "mention" | "reply";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "like", label: "Likes" },
  { key: "comment", label: "Comments" },
  { key: "follow", label: "Follows" },
  { key: "mention", label: "Mentions" },
  { key: "reply", label: "Replies" },
];

export default function NotificationsPage() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    isConnected,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  } = useSocket();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notifications.filter((n) => {
      if (filter === "unread" && n.read) return false;
      if (filter !== "all" && filter !== "unread" && n.type !== filter) return false;
      if (q && !`${n.fromUser?.name ?? ""} ${n.message ?? ""}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [notifications, filter, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: notifications.length, unread: unreadCount };
    for (const n of notifications) c[n.type] = (c[n.type] ?? 0) + 1;
    return c;
  }, [notifications, unreadCount]);

  const handleOpen = (n: Notification) => {
    markNotificationAsRead(n.id);
    if (n.postId) router.push(`/posts/${n.postId}`);
    else if (n.type === "follow" && n.fromUser?._id) router.push(`/profile/${n.fromUser._id}`);
  };

  const formatTime = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Just now";
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Bell size={22} />
          </span>
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
              Notifications
              {unreadCount > 0 && (
                <Chip size="sm" color="danger" variant="flat">
                  {unreadCount} new
                </Chip>
              )}
            </h1>
            <p className="text-sm text-default-500">
              {isConnected ? "Live — updates in real time" : "Offline — reconnecting..."} ·{" "}
              {notifications.length} total
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="flat"
              color="primary"
              startContent={<Check size={14} />}
              onPress={markAllNotificationsAsRead}
            >
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              size="sm"
              variant="light"
              color="danger"
              startContent={<Trash2 size={14} />}
              onPress={clearNotifications}
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          startContent={<Search size={16} className="text-default-400" />}
          placeholder="Search notifications..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
          aria-label="Search notifications"
        />
      </div>

      <Tabs
        selectedKey={filter}
        onSelectionChange={(k) => setFilter(k as FilterKey)}
        color="primary"
        variant="underlined"
        className="mb-4"
      >
        {FILTERS.map((f) => (
          <Tab
            key={f.key}
            title={
              <span className="flex items-center gap-1.5">
                {f.label}
                {(counts[f.key] ?? 0) > 0 && (
                  <Chip size="sm" variant="flat">
                    {counts[f.key]}
                  </Chip>
                )}
              </span>
            }
          />
        ))}
      </Tabs>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-divider bg-content1">
          <EmptyState
            type="notifications"
            title={
              notifications.length === 0 ? "No notifications yet" : "Nothing matches this filter"
            }
            description={
              notifications.length === 0
                ? "Likes, comments, follows and mentions will appear here in real time."
                : "Try a different filter or search."
            }
            actionLabel={notifications.length === 0 ? "Explore posts" : undefined}
            onAction={notifications.length === 0 ? () => router.push("/explore") : undefined}
          />
        </div>
      ) : (
        <Card>
          <CardBody className="divide-y divide-divider p-0">
            {filtered.map((n) => (
              <button
                key={n.id}
                onClick={() => handleOpen(n)}
                className={`flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-default-100/70 ${
                  !n.read ? "bg-primary-50/40 dark:bg-primary-500/10" : ""
                }`}
              >
                <Avatar
                  src={n.fromUser?.profilePhoto}
                  name={n.fromUser?.name?.trim() ? n.fromUser.name : "?"}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-default-100">
                      {getNotificationIcon(n.type)}
                    </span>
                    <span className="min-w-0">
                      <span className="font-semibold">{n.fromUser?.name ?? "Someone"}</span>{" "}
                      <span className="text-default-600">{n.message}</span>
                    </span>
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-default-500">
                    <Chip size="sm" variant="flat" className="capitalize">
                      {n.type}
                    </Chip>
                    {formatTime(n.createdAt)}
                  </p>
                </div>
                {!n.read && (
                  <span
                    className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-primary"
                    aria-label="Unread"
                  />
                )}
              </button>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
