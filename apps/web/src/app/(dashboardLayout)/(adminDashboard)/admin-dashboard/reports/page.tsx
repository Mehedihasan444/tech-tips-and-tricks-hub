/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Spinner,
  Tabs,
  Tab,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {
  AlertTriangle,
  Flag,
  FileText,
  User,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
} from "lucide-react";
import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";
import { getPosts } from "@/services/PostService";
import { getUsers } from "@/services/UserService";

interface Report {
  id: string;
  type: "post" | "user" | "comment";
  reason: string;
  status: "pending" | "resolved" | "dismissed";
  reportedItem: string;
  reportedBy: string;
  createdAt: string;
}

// Simulated reports data (in production, this would come from an API)
const generateMockReports = (posts: any[], users: any[]): Report[] => {
  const reasons = [
    "Spam content",
    "Inappropriate language",
    "Misleading information",
    "Copyright violation",
    "Harassment",
    "Off-topic content",
  ];
  const statuses: ("pending" | "resolved" | "dismissed")[] = [
    "pending",
    "resolved",
    "dismissed",
  ];

  const reports: Report[] = [];

  // Generate some mock reports based on real posts and users
  posts.slice(0, 5).forEach((post, index) => {
    reports.push({
      id: `report-post-${index}`,
      type: "post",
      reason: reasons[index % reasons.length],
      status: statuses[index % statuses.length],
      reportedItem: post.title || `Post ${index + 1}`,
      reportedBy: users[index % users.length]?.name || "Anonymous",
      createdAt: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  });

  users.slice(0, 3).forEach((user, index) => {
    reports.push({
      id: `report-user-${index}`,
      type: "user",
      reason: reasons[(index + 2) % reasons.length],
      status: statuses[(index + 1) % statuses.length],
      reportedItem: user.name || `User ${index + 1}`,
      reportedBy: users[(index + 1) % users.length]?.name || "Anonymous",
      createdAt: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
    });
  });

  return reports.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTab, setSelectedTab] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [postsRes, usersRes] = await Promise.all([
          getPosts(1, 20),
          getUsers(1, 20),
        ]);

        const posts = postsRes?.data || [];
        const users = usersRes?.data?.data || [];

        const mockReports = generateMockReports(posts, users);
        setReports(mockReports);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = (reportId: string, newStatus: "resolved" | "dismissed") => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
    );
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.reportedItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;

    const matchesTab =
      selectedTab === "all" || report.type === selectedTab;

    return matchesSearch && matchesStatus && matchesTab;
  });

  const getStatusChip = (status: string) => {
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
      default:
        return <Chip>{status}</Chip>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "post":
        return <FileText size={16} className="text-primary" />;
      case "user":
        return <User size={16} className="text-secondary" />;
      case "comment":
        return <Flag size={16} className="text-warning" />;
      default:
        return <AlertTriangle size={16} />;
    }
  };

  const stats = {
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
    dismissed: reports.filter((r) => r.status === "dismissed").length,
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
      <PageTitle title="Reports & Moderation" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardBody className="flex flex-row items-center gap-3 p-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Flag className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Total Reports</p>
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
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Search size={18} className="text-default-400" />}
              className="flex-1"
            />
            <Select
              placeholder="Filter by status"
              selectedKeys={[statusFilter]}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48"
            >
              <SelectItem key="all" value="all">
                All Status
              </SelectItem>
              <SelectItem key="pending" value="pending">
                Pending
              </SelectItem>
              <SelectItem key="resolved" value="resolved">
                Resolved
              </SelectItem>
              <SelectItem key="dismissed" value="dismissed">
                Dismissed
              </SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <Tabs
        selectedKey={selectedTab}
        onSelectionChange={(key) => setSelectedTab(key as string)}
        className="mb-4"
      >
        <Tab key="all" title="All Reports" />
        <Tab key="post" title="Post Reports" />
        <Tab key="user" title="User Reports" />
        <Tab key="comment" title="Comment Reports" />
      </Tabs>

      {/* Reports Table */}
      <Card>
        <CardBody className="p-0">
          <Table aria-label="Reports table" removeWrapper>
            <TableHeader>
              <TableColumn>TYPE</TableColumn>
              <TableColumn>REPORTED ITEM</TableColumn>
              <TableColumn>REASON</TableColumn>
              <TableColumn>REPORTED BY</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No reports found">
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(report.type)}
                      <span className="capitalize">{report.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium line-clamp-1 max-w-[200px]">
                      {report.reportedItem}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-default-500">{report.reason}</span>
                  </TableCell>
                  <TableCell>{report.reportedBy}</TableCell>
                  <TableCell>
                    {new Date(report.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusChip(report.status)}</TableCell>
                  <TableCell>
                    {report.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          color="success"
                          variant="flat"
                          onPress={() => handleStatusChange(report.id, "resolved")}
                        >
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          color="default"
                          variant="flat"
                          onPress={() => handleStatusChange(report.id, "dismissed")}
                        >
                          Dismiss
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="light" isIconOnly>
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
