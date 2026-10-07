"use client";

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
  Input,
  Select,
  SelectItem,
  Pagination,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "@heroui/react";
import { Search, MoreVertical, Flag, Check, X, Eye, MessageSquare } from "lucide-react";
import Link from "next/link";
import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";
import EmptyState from "@/components/ui/EmptyState";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { getPosts } from "@/services/PostService";
import { formatDistanceToNow } from "date-fns";
import { TPost } from "@/types/TPost";

interface Comment {
  id: string;
  postId: string;
  postTitle: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  status: "visible" | "hidden" | "flagged";
}

const COMMENT_STATUS_KEY = "tech-tips-comment-moderation";

const readCommentStatuses = (): Record<string, Comment["status"]> => {
  try {
    const raw = localStorage.getItem(COMMENT_STATUS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeCommentStatuses = (statuses: Record<string, Comment["status"]>) => {
  try {
    localStorage.setItem(COMMENT_STATUS_KEY, JSON.stringify(statuses));
  } catch {
    // storage unavailable
  }
};

const buildCommentList = (posts: TPost[]): Comment[] => {
  const comments: Comment[] = [];
  posts.forEach((post) => {
    (post.comments ?? []).forEach((comment: any) => {
      comments.push({
        id: comment._id || comment.id,
        postId: post._id,
        postTitle: post.title || "Untitled",
        authorName: comment.author?.name || "Unknown",
        authorAvatar: comment.author?.profilePhoto,
        content: comment.content || comment.text || "",
        createdAt: comment.createdAt,
        status: "visible",
      });
    });
  });
  return comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

const getStatusChip = (status: Comment["status"]) => {
  switch (status) {
    case "visible":
      return (
        <Chip color="success" variant="flat" size="sm">
          Visible
        </Chip>
      );
    case "hidden":
      return (
        <Chip color="default" variant="flat" size="sm">
          Hidden
        </Chip>
      );
    case "flagged":
      return (
        <Chip color="warning" variant="flat" size="sm" startContent={<Flag size={12} />}>
          Flagged
        </Chip>
      );
  }
};

export default function CommentsManagementPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [statuses, setStatuses] = useState<Record<string, Comment["status"]>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadError(false);
        const postsRes = await getPosts(1, 100);
        const posts = postsRes?.data?.data || [];
        if (!cancelled) {
          const built = buildCommentList(posts);
          setComments(built);
          setStatuses(readCommentStatuses());
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
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

  const statusOf = (id: string): Comment["status"] => statuses[id] ?? "visible";

  const filtered = comments.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.content.toLowerCase().includes(q) ||
      c.postTitle.toLowerCase().includes(q) ||
      c.authorName.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || statusOf(c.id) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleStatusChange = (id: string, newStatus: Comment["status"]) => {
    setStatuses((prev) => {
      const next = { ...prev, [id]: newStatus };
      writeCommentStatuses(next);
      return next;
    });
  };

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="p-6" role="status" aria-label="Loading comments...">
        <PageTitle title="Comments Management" />
        <TableRowSkeleton columns={5} />
        <TableRowSkeleton columns={5} />
        <TableRowSkeleton columns={5} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-6">
        <PageTitle title="Comments Management" />
        <div className="bg-content1 rounded-2xl border border-divider">
          <EmptyState
            type="custom"
            title="Couldn't load comments"
            description="Check your connection and try again."
            actionLabel="Try Again"
            onAction={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  const stats = {
    total: comments.length,
    visible: comments.filter((c) => statusOf(c.id) === "visible").length,
    hidden: comments.filter((c) => statusOf(c.id) === "hidden").length,
    flagged: comments.filter((c) => statusOf(c.id) === "flagged").length,
  };

  return (
    <div className="p-6">
      <PageTitle title="Comments Management" />
      <p className="text-sm text-default-500 mb-6 -mt-2">
        Moderate all community comments. Hidden comments are removed from public view.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="text-primary-fg" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <div className="p-2 bg-success/10 rounded-lg">
              <Check className="text-success" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Visible</p>
              <p className="text-2xl font-bold text-success">{stats.visible}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <div className="p-2 bg-default/10 rounded-lg">
              <X className="text-default-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Hidden</p>
              <p className="text-2xl font-bold">{stats.hidden}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Flag className="text-warning" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Flagged</p>
              <p className="text-2xl font-bold text-warning">{stats.flagged}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="mb-6">
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search comments, post, or author..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              startContent={<Search size={18} className="text-default-600" />}
              className="flex-1"
            />
            <Select
              placeholder="Filter by status"
              selectedKeys={new Set([statusFilter])}
              onSelectionChange={(keys) => {
                setStatusFilter((Array.from(keys)[0] as string) ?? "all");
                setPage(1);
              }}
              className="w-full md:w-48"
            >
              <SelectItem key="all">All</SelectItem>
              <SelectItem key="visible">Visible</SelectItem>
              <SelectItem key="hidden">Hidden</SelectItem>
              <SelectItem key="flagged">Flagged</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-0">
          <Table removeWrapper>
            <TableHeader>
              <TableColumn>COMMENT</TableColumn>
              <TableColumn>POST</TableColumn>
              <TableColumn>AUTHOR</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No comments found">
              {paginated.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <span className="line-clamp-2 max-w-[300px] block">{c.content}</span>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/posts/${c.postId}`}
                      className="text-primary hover:underline line-clamp-1 max-w-[150px] block"
                    >
                      {c.postTitle}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar src={c.authorAvatar} name={c.authorName} size="sm" />
                      <span className="font-medium">{c.authorName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-default-500">{formatTime(c.createdAt)}</span>
                  </TableCell>
                  <TableCell>{getStatusChip(statusOf(c.id))}</TableCell>
                  <TableCell>
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <Button isIconOnly variant="ghost" size="sm">
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu>
                        <DropdownItem
                          key="visible"
                          onClick={() => handleStatusChange(c.id, "visible")}
                          isDisabled={statusOf(c.id) === "visible"}
                          startContent={
                            statusOf(c.id) === "visible" ? (
                              <Check size={14} className="text-success" />
                            ) : undefined
                          }
                        >
                          Make Visible
                        </DropdownItem>
                        <DropdownItem
                          key="hidden"
                          onClick={() => handleStatusChange(c.id, "hidden")}
                          isDisabled={statusOf(c.id) === "hidden"}
                          startContent={
                            statusOf(c.id) === "hidden" ? (
                              <Check size={14} className="text-default" />
                            ) : undefined
                          }
                        >
                          Hide
                        </DropdownItem>
                        <DropdownItem
                          key="flagged"
                          onClick={() => handleStatusChange(c.id, "flagged")}
                          isDisabled={statusOf(c.id) === "flagged"}
                          color="warning"
                          startContent={
                            statusOf(c.id) === "flagged" ? (
                              <Check size={14} className="text-warning" />
                            ) : undefined
                          }
                        >
                          <Flag size={14} /> Flag
                        </DropdownItem>
                        <DropdownItem
                          key="view"
                          as={Link}
                          href={`/posts/${c.postId}`}
                          startContent={<Eye size={14} />}
                        >
                          View in Context
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

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
          />
        </div>
      )}
    </div>
  );
}
