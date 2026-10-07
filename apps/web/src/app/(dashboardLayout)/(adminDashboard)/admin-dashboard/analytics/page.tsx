"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Select,
  SelectItem,
  Spinner,
  Chip,
  Button,
} from "@heroui/react";
import {
  Users,
  TrendingUp,
  MessageSquare,
  DollarSign,
  Clock,
  Activity,
  RefreshCw,
  Download,
} from "lucide-react";
import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";
import { getUsers } from "@/services/UserService";
import { getPosts } from "@/services/PostService";
import { getPayments } from "@/services/PaymentService";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

const RANGE_OPTIONS = [
  { key: "7d", label: "Last 7 Days", days: 7 },
  { key: "30d", label: "Last 30 Days", days: 30 },
  { key: "90d", label: "Last 90 Days", days: 90 },
  { key: "1y", label: "Last Year", days: 365 },
];

interface AnalyticsData {
  users: { createdAt?: string; lastActiveAt?: string; isPremium?: boolean }[];
  posts: {
    createdAt?: string;
    category?: string;
    tags?: string[];
    comments?: { createdAt?: string }[];
    likes?: number;
    dislikes?: number;
  }[];
  payments: { createdAt?: string; amount?: number }[];
}

interface TimeSeriesPoint {
  date: string;
  users: number;
  posts: number;
  comments: number;
  reactions: number;
  premiumSignups: number;
  revenue: number;
  dau: number;
  mau: number;
  churn: number;
}

export default function AnalyticsDashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [range, setRange] = useState("30d");
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(false);
      const [usersRes, postsRes, paymentsRes] = await Promise.allSettled([
        getUsers(1, 5000),
        getPosts(1, 5000),
        getPayments("").catch(() => ({ data: [] })),
      ]);
      setData({
        users: usersRes.status === "fulfilled" ? usersRes.value?.data?.data || [] : [],
        posts: postsRes.status === "fulfilled" ? postsRes.value?.data?.data || [] : [],
        payments: paymentsRes.status === "fulfilled" ? paymentsRes.value?.data || [] : [],
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const days = RANGE_OPTIONS.find((r) => r.key === range)?.days ?? 30;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const series = useMemo((): TimeSeriesPoint[] => {
    if (!data) return [];
    const series: TimeSeriesPoint[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(day.getDate() - i);
      const next = new Date(day);
      next.setDate(next.getDate() + 1);
      const inDay = (v?: string) => {
        if (!v) return false;
        const t = new Date(v).getTime();
        return !Number.isNaN(t) && t >= day.getTime() && t < next.getTime();
      };
      const dayUsers = data.users.filter(
        (u: { createdAt?: string; lastActiveAt?: string; isPremium?: boolean }) =>
          inDay(u.createdAt),
      );
      const dayPosts = data.posts.filter((p: { createdAt?: string }) => inDay(p.createdAt));
      const dayPayments = data.payments.filter((p: { createdAt?: string; amount?: number }) =>
        inDay(p.createdAt),
      );
      const dayComments = data.posts.flatMap((p: { comments?: { createdAt?: string }[] }) =>
        (p.comments ?? []).filter((c: { createdAt?: string }) => inDay(c.createdAt)),
      ).length;
      const dayReactions = data.posts.reduce(
        (sum, p: { likes?: number; dislikes?: number }) => sum + (p.likes ?? 0) + (p.dislikes ?? 0),
        0,
      );
      series.push({
        date: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        users: dayUsers.length,
        posts: dayPosts.length,
        comments: dayComments,
        reactions: dayReactions,
        premiumSignups: dayPayments.length,
        revenue: dayPayments.reduce((sum, p: { amount?: number }) => sum + (p.amount ?? 20), 0),
        dau:
          dayUsers.filter((u: { lastActiveAt?: string }) => u.lastActiveAt && inDay(u.lastActiveAt))
            .length || dayUsers.length,
        mau: data.users.filter(
          (u: { lastActiveAt?: string }) =>
            u.lastActiveAt && new Date(u.lastActiveAt).getTime() >= day.getTime() - 29 * 86400000,
        ).length,
        churn: 0,
      });
    }
    return series;
  }, [data, days]);

  const totals = useMemo(() => {
    if (!data) return { users: 0, posts: 0, comments: 0, reactions: 0, premium: 0, revenue: 0 };
    const users = data.users;
    const posts = data.posts;
    const payments = data.payments;
    const comments = posts.flatMap((p) => p.comments ?? []).length;
    const reactions = posts.reduce((s, p) => s + (p.likes ?? 0) + (p.dislikes ?? 0), 0);
    const premium = users.filter((u) => u.isPremium).length;
    const revenue = payments.reduce((s, p) => s + (p.amount ?? 20), 0);
    return { users: users.length, posts: posts.length, comments, reactions, premium, revenue };
  }, [data]);

  const topCategories = useMemo(() => {
    if (!data) return [];
    const counts = new Map<string, number>();
    data.posts.forEach((p) => {
      if (p.category) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
      .slice(0, 6);
  }, [data]);

  const topTags = useMemo(() => {
    if (!data) return [];
    const counts = new Map<string, number>();
    data.posts.forEach((p) =>
      (p.tags ?? []).forEach((t: string) => counts.set(t, (counts.get(t) ?? 0) + 1)),
    );
    return Array.from(counts.entries())
      .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
      .slice(0, 10);
  }, [data]);

  const engagementRate = totals.posts
    ? Math.round((totals.reactions / totals.posts) * 100) / 100
    : 0;
  const avgCommentsPerPost = totals.posts
    ? Math.round((totals.comments / totals.posts) * 100) / 100
    : 0;
  const premiumRate = totals.users ? Math.round((totals.premium / totals.users) * 1000) / 10 : 0;

  const lineData = {
    labels: series.map((s) => s.date),
    datasets: [
      {
        label: "New Users",
        data: series.map((s) => s.users),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "New Posts",
        data: series.map((s) => s.posts),
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Comments",
        data: series.map((s) => s.comments),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barData = {
    labels: series.map((s) => s.date),
    datasets: [
      { label: "DAU", data: series.map((s) => s.dau), backgroundColor: "#8b5cf6" },
      { label: "MAU", data: series.map((s) => s.mau), backgroundColor: "#06b6d4" },
    ],
  };

  const revenueData = {
    labels: series.map((s) => s.date),
    datasets: [
      {
        label: "Revenue ($)",
        data: series.map((s) => s.revenue),
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Premium Signups",
        data: series.map((s) => s.premiumSignups),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const categoryData = {
    labels: topCategories.map(([c]) => c),
    datasets: [
      {
        data: topCategories.map(([, c]) => c),
        backgroundColor: ["#8b5cf6", "#06b6d4", "#f59e0b", "#22c55e", "#ef4444", "#ec4899"],
      },
    ],
  };

  if (loading) {
    return (
      <div className="p-6" role="status" aria-label="Loading analytics...">
        <PageTitle title="Analytics Dashboard" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-default-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="h-80 animate-pulse rounded-2xl bg-default-200" />
          <div className="h-80 animate-pulse rounded-2xl bg-default-200" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <PageTitle title="Analytics Dashboard" />
        <Card>
          <CardBody className="text-center py-12">
            <Activity size={48} className="mx-auto text-default-300 mb-4" />
            <p className="text-default-500">Failed to load analytics data.</p>
            <Button
              color="primary"
              className="mt-4"
              onPress={fetchData}
              startContent={<RefreshCw size={14} />}
            >
              Retry
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <PageTitle title="Analytics Dashboard" />
        <div className="flex items-center gap-3">
          <Select
            placeholder="Time Range"
            selectedKeys={new Set([range])}
            onSelectionChange={(keys) => setRange((Array.from(keys)[0] as string) ?? "30d")}
            className="w-48"
          >
            {RANGE_OPTIONS.map((o) => (
              <SelectItem key={o.key}>{o.label}</SelectItem>
            ))}
          </Select>
          <Button
            variant="flat"
            color="primary"
            size="sm"
            onPress={() => {
              setRefreshing(true);
              fetchData();
            }}
            startContent={<RefreshCw size={14} />}
            isLoading={refreshing}
            isDisabled={refreshing}
          >
            Refresh
          </Button>
          <Button variant="flat" color="default" size="sm" startContent={<Download size={14} />}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card className="bg-gradient-to-br from-violet-500 to-purple-600">
          <CardBody className="flex flex-row items-center gap-4 text-white p-5">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users size={28} />
            </div>
            <div>
              <p className="text-sm opacity-80">Total Users</p>
              <p className="text-3xl font-bold">{totals.users.toLocaleString()}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-gradient-to-br from-cyan-500 to-blue-600">
          <CardBody className="flex flex-row items-center gap-4 text-white p-5">
            <div className="p-3 bg-white/20 rounded-xl">
              <MessageSquare size={28} />
            </div>
            <div>
              <p className="text-sm opacity-80">Total Posts</p>
              <p className="text-3xl font-bold">{totals.posts.toLocaleString()}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-emerald-600">
          <CardBody className="flex flex-row items-center gap-4 text-white p-5">
            <div className="p-3 bg-white/20 rounded-xl">
              <Activity size={28} />
            </div>
            <div>
              <p className="text-sm opacity-80">Total Reactions</p>
              <p className="text-3xl font-bold">{totals.reactions.toLocaleString()}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-orange-600">
          <CardBody className="flex flex-row items-center gap-4 text-white p-5">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign size={28} />
            </div>
            <div>
              <p className="text-sm opacity-80">Revenue</p>
              <p className="text-3xl font-bold">${totals.revenue.toLocaleString()}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{engagementRate}x</p>
            <p className="text-sm text-default-500">Avg Reactions/Post</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-3xl font-bold text-secondary">{avgCommentsPerPost}</p>
            <p className="text-sm text-default-500">Avg Comments/Post</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-3xl font-bold text-warning">{premiumRate}%</p>
            <p className="text-sm text-default-500">Premium Conversion</p>
          </CardBody>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardBody className="p-5">
            <h3 className="text-lg font-bold mb-4">
              Growth Trends ({range === "7d" ? "Daily" : range === "30d" ? "Daily" : "Weekly"})
            </h3>
            <div className="h-64 bg-default-100 rounded-lg flex items-center justify-center text-default-400">
              Line Chart: Growth Trends
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-5">
            <h3 className="text-lg font-bold mb-4">Active Users (DAU/MAU)</h3>
            <div className="h-64 bg-default-100 rounded-lg flex items-center justify-center text-default-400">
              Bar Chart: DAU/MAU
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardBody className="p-5">
            <h3 className="text-lg font-bold mb-4">Revenue & Premium Signups</h3>
            <div className="h-64 bg-default-100 rounded-lg flex items-center justify-center text-default-400">
              Area Chart: Revenue & Signups
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-5">
            <h3 className="text-lg font-bold mb-4">Posts by Category</h3>
            <div className="h-64 bg-default-100 rounded-lg flex items-center justify-center text-default-400">
              Pie Chart: Category Distribution
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody className="p-5">
            <h3 className="text-lg font-bold mb-4">Top Tags</h3>
            <div className="flex flex-wrap gap-2">
              {topTags.length ? (
                topTags.map(([tag, count]) => (
                  <Chip
                    key={tag}
                    size="sm"
                    variant="flat"
                    color={count > 10 ? "primary" : "default"}
                  >
                    {tag} ({count})
                  </Chip>
                ))
              ) : (
                <p className="text-default-500">No tags yet</p>
              )}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-5">
            <h3 className="text-lg font-bold mb-4">Key Metrics Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-default-500">Total Comments</span>
                <span className="font-semibold">{totals.comments.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-default-500">Total Reactions</span>
                <span className="font-semibold">{totals.reactions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-default-500">Premium Users</span>
                <span className="font-semibold text-warning">
                  {totals.premium.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-default-500">Free Users</span>
                <span className="font-semibold">
                  {(totals.users - totals.premium).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-default-500">Avg Engagement/Post</span>
                <span className="font-semibold">{engagementRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-default-500">Avg Comments/Post</span>
                <span className="font-semibold">{avgCommentsPerPost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-default-500">Total Revenue</span>
                <span className="font-semibold text-success">
                  ${totals.revenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-default-500">Premium Rate</span>
                <span className="font-semibold text-warning">{premiumRate}%</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
