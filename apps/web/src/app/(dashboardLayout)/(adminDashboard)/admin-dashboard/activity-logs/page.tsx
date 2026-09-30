/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
  Spinner,
  Input,
  Select,
  SelectItem,
  Pagination,
  Avatar,
} from "@nextui-org/react";
import {
  Search,
  UserPlus,
  FileText,
  Trash2,
  Edit,
  LogIn,
  CreditCard,
  MessageSquare,
  Heart,
  UserMinus,
  Shield,
} from "lucide-react";
import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";
import { getUsers } from "@/services/UserService";
import { formatDistanceToNow } from "date-fns";

type ActivityType =
  | "user_registered"
  | "user_login"
  | "post_created"
  | "post_deleted"
  | "post_updated"
  | "comment_added"
  | "user_followed"
  | "user_unfollowed"
  | "payment_received"
  | "user_banned"
  | "user_unbanned";

interface ActivityLog {
  id: string;
  type: ActivityType;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  details: string;
  metadata?: Record<string, any>;
  createdAt: string;
  ipAddress?: string;
}

const activityConfig: Record<
  ActivityType,
  { icon: React.ReactNode; color: "primary" | "success" | "warning" | "danger" | "secondary" | "default"; label: string }
> = {
  user_registered: {
    icon: <UserPlus size={16} />,
    color: "success",
    label: "User Registered",
  },
  user_login: {
    icon: <LogIn size={16} />,
    color: "primary",
    label: "User Login",
  },
  post_created: {
    icon: <FileText size={16} />,
    color: "primary",
    label: "Post Created",
  },
  post_deleted: {
    icon: <Trash2 size={16} />,
    color: "danger",
    label: "Post Deleted",
  },
  post_updated: {
    icon: <Edit size={16} />,
    color: "secondary",
    label: "Post Updated",
  },
  comment_added: {
    icon: <MessageSquare size={16} />,
    color: "default",
    label: "Comment Added",
  },
  user_followed: {
    icon: <Heart size={16} />,
    color: "success",
    label: "User Followed",
  },
  user_unfollowed: {
    icon: <UserMinus size={16} />,
    color: "warning",
    label: "User Unfollowed",
  },
  payment_received: {
    icon: <CreditCard size={16} />,
    color: "success",
    label: "Payment Received",
  },
  user_banned: {
    icon: <Shield size={16} />,
    color: "danger",
    label: "User Banned",
  },
  user_unbanned: {
    icon: <Shield size={16} />,
    color: "success",
    label: "User Unbanned",
  },
};

// Generate mock activity logs based on real users
const generateMockActivities = (users: any[]): ActivityLog[] => {
  const activities: ActivityLog[] = [];
  const types: ActivityType[] = Object.keys(activityConfig) as ActivityType[];

  users.forEach((user, index) => {
    // Generate 2-3 activities per user
    const numActivities = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numActivities; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const hoursAgo = Math.floor(Math.random() * 168); // Last 7 days

      let details = "";
      switch (type) {
        case "user_registered":
          details = `New user ${user.name} registered`;
          break;
        case "user_login":
          details = `${user.name} logged in`;
          break;
        case "post_created":
          details = `${user.name} created a new post`;
          break;
        case "post_deleted":
          details = `${user.name} deleted a post`;
          break;
        case "post_updated":
          details = `${user.name} updated their post`;
          break;
        case "comment_added":
          details = `${user.name} commented on a post`;
          break;
        case "user_followed":
          details = `${user.name} followed another user`;
          break;
        case "user_unfollowed":
          details = `${user.name} unfollowed a user`;
          break;
        case "payment_received":
          details = `Payment of $20 received from ${user.name}`;
          break;
        case "user_banned":
          details = `${user.name} was banned`;
          break;
        case "user_unbanned":
          details = `${user.name} was unbanned`;
          break;
      }

      activities.push({
        id: `activity-${index}-${i}`,
        type,
        user: {
          name: user.name || "Unknown User",
          email: user.email || "",
          avatar: user.profilePhoto,
        },
        details,
        createdAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      });
    }
  });

  return activities.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export default function ActivityLogsPage() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersRes = await getUsers(1, 50);
        const users = usersRes?.data?.data || [];
        const mockActivities = generateMockActivities(users);
        setActivities(mockActivities);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || activity.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
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
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageTitle title="Activity Logs" />

      {/* Filters */}
      <Card className="mb-6">
        <CardBody className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search by user or activity..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              startContent={<Search size={18} className="text-default-400" />}
              className="flex-1"
            />
            <Select
              placeholder="Filter by type"
              selectedKeys={[typeFilter]}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full md:w-56"
              items={[
                { key: "all", label: "All Activities" },
                ...Object.entries(activityConfig).map(([key, config]) => ({
                  key,
                  label: config.label,
                })),
              ]}
            >
              {(item) => (
                <SelectItem key={item.key} value={item.key}>
                  {item.label}
                </SelectItem>
              )}
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Activity Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{activities.length}</p>
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
            <p className="text-3xl font-bold text-secondary">
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
              <TableColumn>IP ADDRESS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No activities found">
              {paginatedActivities.map((activity) => {
                const config = activityConfig[activity.type];
                return (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={activity.user.avatar}
                          name={activity.user.name}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium">{activity.user.name}</p>
                          <p className="text-xs text-default-400">
                            {activity.user.email}
                          </p>
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
                      <code className="text-xs bg-default-100 px-2 py-1 rounded">
                        {activity.ipAddress}
                      </code>
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
          />
        </div>
      )}
    </div>
  );
}
