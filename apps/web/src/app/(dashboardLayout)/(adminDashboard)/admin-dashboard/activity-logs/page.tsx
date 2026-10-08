/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Input,
  Select,
  SelectItem,
  Pagination,
  Avatar,
} from "@heroui/react";
import { Search, UserPlus, FileText, CreditCard } from "lucide-react";
import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";
import EmptyState from "@/components/ui/EmptyState";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { getUsers } from "@/services/UserService";
import { getPosts } from "@/services/PostService";
import { getPayments } from "@/services/PaymentService";
import { formatDistanceToNow } from "date-fns";
import { IUser } from "@/types/IUser";
import { TPost } from "@/types/TPost";

type ActivityType = "user_registered" | "post_created" | "payment_received";

interface ActivityLog {
  id: string;
  type: ActivityType;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  details: string;
  source: string;
  createdAt: string;
}

const activityConfig: Record<
  ActivityType,
  {
    icon: React.ReactNode;
    color: "primary" | "success" | "warning" | "danger" | "secondary" | "default";
    label: string;
  }
> = {
  user_registered: {
    icon: <UserPlus size={16} />,
    color: "success",
    label: "User Registered",
  },
  post_created: {
    icon: <FileText size={16} />,
    color: "primary",
    label: "Post Created",
  },
  payment_received: {
    icon: <CreditCard size={16} />,
    color: "success",
    label: "Payment Received",
  },
};

// Activity is derived ONLY from verifiable records: user accounts, published
// posts, and verified payments. Anything without a source record (logins,
// edits, bans, IPs) is not shown rather than invented.
const buildActivity = (users: IUser[], posts: TPost[], payments: any[]): ActivityLog[] => {
  const activities: ActivityLog[] = [];

  users.forEach((user) => {
    if (!user?.createdAt) return;
    activities.push({
      id: `user-${user._id}`,
      type: "user_registered",
      user: {
        name: user.name || "Unknown User",
        email: user.email || "",
        avatar: user.profilePhoto,
      },
      details: `${user.name || "A user"} created an account`,
      source: "User record",
      createdAt: user.createdAt,
    });
  });

  posts.forEach((post) => {
    if (!post?.createdAt) return;
    activities.push({
      id: `post-${post._id}`,
      type: "post_created",
      user: {
        name: post.author?.name || "Unknown User",
        email: post.author?.email || "",
        avatar: post.author?.profilePhoto,
      },
      details: `Published "${post.title || "Untitled post"}"`,
      source: "Post record",
      createdAt: post.createdAt,
    });
  });

  payments.forEach((payment: any, index: number) => {
    if (!payment?.createdAt) return;
    activities.push({
      id: `payment-${payment.transactionId ?? index}`,
      type: "payment_received",
      user: {
        name: payment.userId?.name || "Unknown User",
        email: payment.userId?.email || "",
        avatar: payment.userId?.profilePhoto,
      },
      details: `Premium payment ${payment.transactionId ?? ""} verified`,
      source: "Payment record",
      createdAt: payment.createdAt,
    });
  });

  return activities
    .filter((a) => !Number.isNaN(new Date(a.createdAt).getTime()))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export default function ActivityLogsPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadError(false);
        const [usersRes, postsRes, paymentsRes] = await Promise.all([
          getUsers(1, 50),
          getPosts(1, 50),
          getPayments("").catch(() => ({ data: [] })),
        ]);
        const users = usersRes?.data?.data || [];
        const posts = postsRes?.data?.data || [];
        const payments = (paymentsRes as any)?.data || [];
        if (!cancelled) setActivities(buildActivity(users, posts, payments));
      } catch (error) {
        console.error("Error fetching data:", error);
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchData();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredActivities = activities.filter((activity) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      activity.user.name.toLowerCase().includes(q) ||
      activity.details.toLowerCase().includes(q) ||
      activity.user.email.toLowerCase().includes(q);

    const matchesType = typeFilter === "all" || activity.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  if (loading) {
    return (
      <div
        className="mx-auto w-full max-w-6xl px-4 py-6"
        role="status"
        aria-label="Loading activity logs..."
      >
        <PageTitle title="Activity Logs" />
        <TableRowSkeleton columns={4} />
        <TableRowSkeleton columns={4} />
        <TableRowSkeleton columns={4} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <PageTitle title="Activity Logs" />
        <div className="surface overflow-hidden rounded-2xl">
          <EmptyState
            type="custom"
            title="Couldn't load activity"
            description="We couldn't fetch activity records. Check your connection and try again."
            actionLabel="Try Again"
            onAction={() => router.refresh()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <PageTitle title="Activity Logs" />
      <p className="text-sm text-default-500 mb-6 -mt-2">
        Built from account, post, and payment records only — no inferred events.
      </p>

      {/* Filters */}
      <Card className="mb-6">
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search by user or activity..."
              aria-label="Search activity logs"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              startContent={<Search size={18} className="text-default-600" />}
              className="flex-1"
            />
            <Select
              placeholder="Filter by type"
              aria-label="Filter by activity type"
              selectedKeys={new Set([typeFilter])}
              onSelectionChange={(keys) => {
                setTypeFilter((Array.from(keys)[0] as string) ?? "all");
                setPage(1);
              }}
              className="w-full md:w-56"
            >
              {(
                [
                  { key: "all", label: "All Activities" },
                  ...Object.entries(activityConfig).map(([key, config]) => ({
                    key,
                    label: config.label,
                  })),
                ] as { key: string; label: string }[]
              ).map((item) => (
                <SelectItem key={item.key}>{item.label}</SelectItem>
              ))}
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-3xl font-bold text-primary-fg">{activities.length}</p>
            <p className="text-sm text-default-500">Total Activities</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-3xl font-bold text-success">
              {activities.filter((a) => a.type === "user_registered").length}
            </p>
            <p className="text-sm text-default-500">New Registrations</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-3xl font-bold text-secondary-fg">
              {activities.filter((a) => a.type === "post_created").length}
            </p>
            <p className="text-sm text-default-500">Posts Created</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-3xl font-bold text-warning">
              {activities.filter((a) => a.type === "payment_received").length}
            </p>
            <p className="text-sm text-default-500">Payments</p>
          </CardBody>
        </Card>
      </div>

      {/* Activity Table */}
      <Card>
        <CardBody className="p-0">
          <Table aria-label="Activity logs table" removeWrapper>
            <TableHeader>
              <TableColumn>USER</TableColumn>
              <TableColumn>ACTIVITY</TableColumn>
              <TableColumn>DETAILS</TableColumn>
              <TableColumn>TIME</TableColumn>
              <TableColumn>SOURCE</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No activities found">
              {paginatedActivities.map((activity) => {
                const config = activityConfig[activity.type];
                return (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar src={activity.user.avatar} name={activity.user.name} size="sm" />
                        <div>
                          <p className="font-medium">{activity.user.name}</p>
                          <p className="text-xs text-default-600">{activity.user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={config.color}
                        variant="flat"
                        size="sm"
                        startContent={config.icon}
                      >
                        {config.label}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className="text-default-600 line-clamp-1 max-w-[250px]">
                        {activity.details}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-default-500">
                        {formatTime(activity.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-default-600">{activity.source}</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={totalPages}
            onChange={setPage}
            aria-label="Activity pages"
          />
        </div>
      )}
    </div>
  );
}
