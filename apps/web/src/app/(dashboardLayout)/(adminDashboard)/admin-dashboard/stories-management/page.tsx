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
  Input,
  Select,
  SelectItem,
  Pagination,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";
import {
  Search,
  MoreVertical,
  Flag,
  Check,
  X,
  Eye,
  Image as ImageIcon,
  Trash2,
  Clock,
} from "lucide-react";
import Link from "next/link";
import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";
import EmptyState from "@/components/ui/EmptyState";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { getStories } from "@/services/StoryService";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

interface Story {
  id: string;
  imageUrl: string;
  userId: string;
  userImage: string;
  username: string;
  createdAt: string;
  status: "visible" | "hidden" | "flagged";
  views: number;
}

const STORY_STATUS_KEY = "tech-tips-story-moderation";

const readStoryStatuses = (): Record<string, Story["status"]> => {
  try {
    const raw = localStorage.getItem(STORY_STATUS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeStoryStatuses = (statuses: Record<string, Story["status"]>) => {
  try {
    localStorage.setItem(STORY_STATUS_KEY, JSON.stringify(statuses));
  } catch {}
};

export default function StoriesManagementPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const router = useRouter();
  const [statuses, setStatuses] = useState<Record<string, Story["status"]>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [previewStory, setPreviewStory] = useState<Story | null>(null);
  const itemsPerPage = 20;

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadError(false);
        const res = await getStories();
        type StoryDTO = {
          id?: string;
          imageUrl?: string;
          userId?: string;
          userImage?: string;
          username?: string;
          timestamp?: string;
          createdAt?: string;
          views?: number;
        };
        const fetched: Story[] = ((res?.data ?? []) as StoryDTO[]).map((s, i) => ({
          id: s.id ?? `story-${i}`,
          imageUrl: s.imageUrl ?? "",
          userId: s.userId ?? "",
          userImage: s.userImage ?? "",
          username: s.username ?? "Unknown",
          createdAt: s.timestamp || s.createdAt || new Date().toISOString(),
          status: "visible" as const,
          views: s.views ?? 0,
        }));
        if (!cancelled) {
          setStories(
            fetched.sort(
              (a: Story, b: Story) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            ),
          );
          setStatuses(readStoryStatuses());
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
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

  const statusOf = (id: string): Story["status"] => statuses[id] ?? "visible";

  const filtered = stories.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch = !q || s.username.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || statusOf(s.id) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleStatusChange = (id: string, newStatus: Story["status"]) => {
    setStatuses((prev) => {
      const next = { ...prev, [id]: newStatus };
      writeStoryStatuses(next);
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
      <div
        className="mx-auto w-full max-w-6xl px-4 py-6"
        role="status"
        aria-label="Loading stories..."
      >
        <PageTitle title="Stories Management" />
        <TableRowSkeleton columns={5} />
        <TableRowSkeleton columns={5} />
        <TableRowSkeleton columns={5} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <PageTitle title="Stories Management" />
        <div className="surface overflow-hidden rounded-2xl">
          <EmptyState
            type="custom"
            title="Couldn't load stories"
            description="Check your connection and try again."
            actionLabel="Try Again"
            onAction={() => router.refresh()}
          />
        </div>
      </div>
    );
  }

  const stats = {
    total: stories.length,
    visible: stories.filter((s) => statusOf(s.id) === "visible").length,
    hidden: stories.filter((s) => statusOf(s.id) === "hidden").length,
    flagged: stories.filter((s) => statusOf(s.id) === "flagged").length,
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <PageTitle
        title="Stories Management"
        subtitle="Review expiring stories. Decisions are stored locally on this device (demo)."
      />
      <p className="text-sm text-default-500 mb-6 -mt-2">
        Moderate all user stories. Hidden stories are removed from the feed.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ImageIcon className="text-primary-fg" size={20} />
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
              placeholder="Search by author..."
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
              <TableColumn>PREVIEW</TableColumn>
              <TableColumn>AUTHOR</TableColumn>
              <TableColumn>VIEWS</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No stories found">
              {paginated.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="w-16 h-10 rounded-lg overflow-hidden relative bg-default-100">
                      <Image
                        src={s.imageUrl}
                        alt={s.username}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar src={s.userImage} alt={s.username} size="sm" />
                      <span className="font-medium">{s.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-default-500">{s.views} views</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-default-500">{formatTime(s.createdAt)}</span>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={
                        statusOf(s.id) === "visible"
                          ? "success"
                          : statusOf(s.id) === "hidden"
                            ? "default"
                            : "warning"
                      }
                    >
                      {statusOf(s.id) === "flagged" && <Flag size={12} className="mr-1" />}
                      {statusOf(s.id).charAt(0).toUpperCase() + statusOf(s.id).slice(1)}
                    </Chip>
                  </TableCell>
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
                          onClick={() => handleStatusChange(s.id, "visible")}
                          isDisabled={statusOf(s.id) === "visible"}
                          startContent={
                            statusOf(s.id) === "visible" ? (
                              <Check size={14} className="text-success" />
                            ) : undefined
                          }
                        >
                          Make Visible
                        </DropdownItem>
                        <DropdownItem
                          key="hidden"
                          onClick={() => handleStatusChange(s.id, "hidden")}
                          isDisabled={statusOf(s.id) === "hidden"}
                          startContent={
                            statusOf(s.id) === "hidden" ? (
                              <Check size={14} className="text-default" />
                            ) : undefined
                          }
                        >
                          Hide
                        </DropdownItem>
                        <DropdownItem
                          key="flagged"
                          onClick={() => handleStatusChange(s.id, "flagged")}
                          isDisabled={statusOf(s.id) === "flagged"}
                          color="warning"
                          startContent={
                            statusOf(s.id) === "flagged" ? (
                              <Check size={14} className="text-warning" />
                            ) : undefined
                          }
                        >
                          <Flag size={14} /> Flag
                        </DropdownItem>
                        <DropdownItem
                          key="preview"
                          onClick={() => setPreviewStory(s)}
                          startContent={<Eye size={14} />}
                        >
                          Preview
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          color="danger"
                          onClick={() => {
                            if (confirm("Delete this story permanently?"))
                              handleStatusChange(s.id, "hidden");
                          }}
                          startContent={<Trash2 size={14} />}
                        >
                          Delete
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

      {/* Preview Modal */}
      {previewStory && (
        <Modal
          isOpen={true}
          onOpenChange={() => setPreviewStory(null)}
          placement="center"
          backdrop="blur"
        >
          <ModalContent>
            <ModalHeader>Story Preview</ModalHeader>
            <ModalBody className="p-0">
              <div className="relative w-full aspect-[9/16] bg-default-900">
                <Image
                  src={previewStory.imageUrl}
                  alt={previewStory.username}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex items-center gap-3 text-white">
                    <Avatar src={previewStory.userImage} alt={previewStory.username} size="md" />
                    <div>
                      <p className="font-semibold">{previewStory.username}</p>
                      <p className="text-sm opacity-80">
                        {formatTime(previewStory.createdAt)} · {previewStory.views} views
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
