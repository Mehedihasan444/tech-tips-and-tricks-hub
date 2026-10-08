"use client";

import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
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
  Button,
  Tabs,
  Tab,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { Flag, Search, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import Link from "next/link";
import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";
import EmptyState from "@/components/ui/EmptyState";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { getPosts } from "@/services/PostService";
import { TPost } from "@/types/TPost";

type ReviewStatus = "pending" | "resolved" | "dismissed";

interface ReviewItem {
  id: string;
  title: string;
  authorName: string;
  authorNick?: string;
  dislikes: number;
  likes: number;
  createdAt: string;
  href: string;
}

const STATUS_KEY = "tech-tips-review-status";

const readStatuses = (): Record<string, ReviewStatus> => {
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
};

// Review queue sourced ONLY from real community signals: posts the community
// disliked surface here for a human look. Nothing is invented — the signal
// shown is the post's own dislike count.
const buildQueue = (posts: TPost[]): ReviewItem[] =>
  (posts ?? [])
    .filter((post) => (post.dislikes ?? 0) > 0)
    .sort((a, b) => (b.dislikes ?? 0) - (a.dislikes ?? 0))
    .map((post) => ({
      id: post._id,
      title: post.title || "Untitled post",
      authorName: post.author?.name || "Unknown author",
      authorNick: post.author?.nickName,
      dislikes: post.dislikes ?? 0,
      likes: post.likes ?? 0,
      createdAt: post.createdAt,
      href: `/posts/${post._id}`,
    }));

const getStatusChip = (status: ReviewStatus) => {
  switch (status) {
    case "pending":
      return (
        <Chip color="warning" variant="flat" startContent={<Clock size={14} />}>
          Pending
        </Chip>
      );
    case "resolved":
      return (
        <Chip color="success" variant="flat" startContent={<CheckCircle size={14} />}>
          Resolved
        </Chip>
      );
    case "dismissed":
      return (
        <Chip color="default" variant="flat" startContent={<XCircle size={14} />}>
          Dismissed
        </Chip>
      );
  }
};

export default function ReportsPage() {
  const [queue, setQueue] = useState<ReviewItem[]>([]);
  const router = useRouter();
  const [statuses, setStatuses] = useState<Record<string, ReviewStatus>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadError(false);
        const postsRes = await getPosts(1, 50);
        const posts = postsRes?.data?.data || [];
        if (!cancelled) {
          setQueue(buildQueue(posts));
          setStatuses(readStatuses());
        }
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

  const handleStatusChange = (id: string, status: Exclude<ReviewStatus, "pending">) => {
    setStatuses((prev) => {
      const next = { ...prev, [id]: status };
      try {
        localStorage.setItem(STATUS_KEY, JSON.stringify(next));
      } catch {
        // Storage unavailable — status still applies for this session.
      }
      return next;
    });
  };

  const statusOf = (id: string): ReviewStatus => statuses[id] ?? "pending";

  const filtered = queue.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q || item.title.toLowerCase().includes(q) || item.authorName.toLowerCase().includes(q);
    const matchesTab = selectedTab === "all" || statusOf(item.id) === selectedTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: queue.length,
    pending: queue.filter((i) => statusOf(i.id) === "pending").length,
    resolved: queue.filter((i) => statusOf(i.id) === "resolved").length,
    dismissed: queue.filter((i) => statusOf(i.id) === "dismissed").length,
  };

  if (loading) {
    return (
      <div
        className="mx-auto w-full max-w-6xl px-4 py-6"
        role="status"
        aria-label="Loading review queue..."
      >
        <PageTitle title="Reports & Moderation" />
        <TableRowSkeleton columns={5} />
        <TableRowSkeleton columns={5} />
        <TableRowSkeleton columns={5} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <PageTitle title="Reports & Moderation" />
        <div className="surface overflow-hidden rounded-2xl">
          <EmptyState
            type="custom"
            title="Couldn't load the review queue"
            description="We couldn't fetch posts for review. Check your connection and try again."
            actionLabel="Try Again"
            onAction={() => router.refresh()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <PageTitle
        title="Reports & Moderation"
        subtitle="Review queue built from community signals. Decisions are stored locally on this device (demo)."
      />
      <p className="text-sm text-default-500 mb-6 -mt-2">
        Posts the community disliked surface here for human review. Decisions are saved on this
        device.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Flag className="text-primary-fg" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Flagged Posts</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Clock className="text-warning" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Pending</p>
              <p className="text-2xl font-bold text-warning">{stats.pending}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <div className="p-2 bg-success/10 rounded-lg">
              <CheckCircle className="text-success" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Resolved</p>
              <p className="text-2xl font-bold text-success">{stats.resolved}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <div className="p-2 bg-default/10 rounded-lg">
              <XCircle className="text-default-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Dismissed</p>
              <p className="text-2xl font-bold">{stats.dismissed}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search by title or author..."
              aria-label="Search review queue"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search size={18} className="text-default-600" />}
              className="flex-1"
            />
            <Select
              placeholder="Filter by status"
              aria-label="Filter by status"
              selectedKeys={new Set([selectedTab])}
              onSelectionChange={(keys) => setSelectedTab((Array.from(keys)[0] as string) ?? "all")}
              className="w-full md:w-48"
            >
              <SelectItem key="all">All Statuses</SelectItem>
              <SelectItem key="pending">Pending</SelectItem>
              <SelectItem key="resolved">Resolved</SelectItem>
              <SelectItem key="dismissed">Dismissed</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
        className="mb-4"
        aria-label="Review status filter"
      >
        <Tab key="all" title="All" />
        <Tab key="pending" title="Pending" />
        <Tab key="resolved" title="Resolved" />
        <Tab key="dismissed" title="Dismissed" />
      </Tabs>

      {/* Reports Table */}
      <Card>
        <CardBody className="p-0">
          <Table aria-label="Content review queue" removeWrapper>
            <TableHeader>
              <TableColumn>POST</TableColumn>
              <TableColumn>AUTHOR</TableColumn>
              <TableColumn>SIGNAL</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No content awaiting review. Posts the community dislikes will appear here.">
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <span className="font-medium line-clamp-1 max-w-[200px]">{item.title}</span>
                  </TableCell>
                  <TableCell>{item.authorName}</TableCell>
                  <TableCell>
                    <span className="text-default-500">
                      {item.dislikes} {item.dislikes === 1 ? "dislike" : "dislikes"} · {item.likes}{" "}
                      {item.likes === 1 ? "like" : "likes"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>{getStatusChip(statusOf(item.id))}</TableCell>
                  <TableCell>
                    {statusOf(item.id) === "pending" ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          color="success"
                          variant="flat"
                          onPress={() => handleStatusChange(item.id, "resolved")}
                        >
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          color="default"
                          variant="flat"
                          onPress={() => handleStatusChange(item.id, "dismissed")}
                        >
                          Dismiss
                        </Button>
                      </div>
                    ) : (
                      <Button
                        as={Link}
                        href={item.href}
                        size="sm"
                        variant="light"
                        isIconOnly
                        aria-label={`View ${item.title}`}
                      >
                        <Eye size={16} />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
