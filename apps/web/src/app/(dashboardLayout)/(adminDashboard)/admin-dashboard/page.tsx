"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import PageTitle from "../../components/_page-title/PageTitle";
import { Card, CardBody } from "@heroui/react";
import EmptyState from "@/components/ui/EmptyState";
import { DashboardCardSkeleton } from "@/components/ui/Skeleton";
import { Users, FileText, MessageSquare, TrendingUp, DollarSign, Eye } from "lucide-react";
import { getUsers } from "@/services/UserService";
import { getPosts } from "@/services/PostService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalReactions: number;
  premiumUsers: number;
  recentActivity: { date: string; users: number; posts: number }[];
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalReactions: 0,
    premiumUsers: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(false);

      // Fetch users
      const usersResponse = await getUsers(1, 1000);
      const users = usersResponse?.data?.data || [];
      const totalUsers = users.length;
      const premiumUsers = users.filter((u: { isPremium: boolean }) => u.isPremium).length;

      // Fetch posts
      const postsResponse = await getPosts(1, 1000);
      const posts = postsResponse?.data?.data || postsResponse?.data || [];
      const totalPosts = posts.length;

      // Reactions and comments from real post data (arrays where present,
      // numeric counters otherwise).
      let totalReactions = 0;
      let totalComments = 0;
      posts.forEach(
        (post: {
          upvotes?: string[];
          downvotes?: string[];
          comments?: string[];
          likes?: number;
          dislikes?: number;
        }) => {
          totalReactions +=
            (Array.isArray(post.upvotes) ? post.upvotes.length : (post.likes ?? 0)) +
            (Array.isArray(post.downvotes) ? post.downvotes.length : (post.dislikes ?? 0));
          totalComments += post.comments?.length || 0;
        },
      );

      // Real per-day activity for the last 7 days, bucketed from createdAt.
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const recentActivity = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(day.getDate() - i);
        const next = new Date(day);
        next.setDate(next.getDate() + 1);
        const inDay = (value?: string) => {
          if (!value) return false;
          const time = new Date(value).getTime();
          return !Number.isNaN(time) && time >= day.getTime() && time < next.getTime();
        };
        recentActivity.push({
          date: day.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          users: users.filter((u: { createdAt?: string }) => inDay(u.createdAt)).length,
          posts: posts.filter((p: { createdAt?: string }) => inDay(p.createdAt)).length,
        });
      }

      setStats({
        totalUsers,
        totalPosts,
        totalComments,
        totalReactions,
        premiumUsers,
        recentActivity,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  // Chart data
  const activityData = {
    labels: stats.recentActivity.map((a) => a.date),
    datasets: [
      {
        label: "New Users",
        data: stats.recentActivity.map((a) => a.users),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: "New Posts",
        data: stats.recentActivity.map((a) => a.posts),
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const userTypeData = {
    labels: ["Free Users", "Premium Users"],
    datasets: [
      {
        data: [stats.totalUsers - stats.premiumUsers, stats.premiumUsers],
        backgroundColor: ["#64748b", "#f59e0b"],
        borderWidth: 0,
      },
    ],
  };

  const engagementData = {
    labels: ["Upvotes", "Comments", "Posts"],
    datasets: [
      {
        label: "Engagement",
        data: [stats.totalReactions, stats.totalComments, stats.totalPosts],
        backgroundColor: ["#22c55e", "#3b82f6", "#8b5cf6"],
      },
    ],
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <PageTitle title="Admin Dashboard" />
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
          role="status"
          aria-label="Loading dashboard..."
        >
          {[1, 2, 3, 4].map((i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <PageTitle title="Admin Dashboard" />
        <div className="surface overflow-hidden rounded-2xl">
          <EmptyState
            type="custom"
            title="Couldn't load dashboard"
            description="We couldn't fetch the latest stats. Check your connection and try again."
            actionLabel="Try Again"
            onAction={() => void fetchStats()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <PageTitle title="Admin Dashboard" />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card className="bg-gradient-to-br from-violet-500 to-purple-600">
          <CardBody className="flex flex-row items-center gap-4 text-white p-5">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users size={28} />
            </div>
            <div>
              <p className="text-sm opacity-80">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500 to-blue-600">
          <CardBody className="flex flex-row items-center gap-4 text-white p-5">
            <div className="p-3 bg-white/20 rounded-xl">
              <FileText size={28} />
            </div>
            <div>
              <p className="text-sm opacity-80">Total Posts</p>
              <p className="text-3xl font-bold">{stats.totalPosts.toLocaleString()}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600">
          <CardBody className="flex flex-row items-center gap-4 text-white p-5">
            <div className="p-3 bg-white/20 rounded-xl">
              <MessageSquare size={28} />
            </div>
            <div>
              <p className="text-sm opacity-80">Total Comments</p>
              <p className="text-3xl font-bold">{stats.totalComments.toLocaleString()}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-orange-600">
          <CardBody className="flex flex-row items-center gap-4 text-white p-5">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp size={28} />
            </div>
            <div>
              <p className="text-sm opacity-80">Total Reactions</p>
              <p className="text-3xl font-bold">{stats.totalReactions.toLocaleString()}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Activity Trend */}
        <Card className="lg:col-span-2">
          <CardBody className="p-5">
            <h3 className="text-lg font-bold mb-4 text-default-800">
              Activity Trend (Last 7 Days)
            </h3>
            <div
              role="img"
              aria-label={`New users and posts per day for the last 7 days. Total ${stats.totalUsers} users and ${stats.totalPosts} posts.`}
            >
              <Line
                data={activityData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </CardBody>
        </Card>

        {/* User Distribution */}
        <Card>
          <CardBody className="p-5">
            <h3 className="text-lg font-bold mb-4 text-default-800">User Distribution</h3>
            <div
              role="img"
              aria-label={`${stats.premiumUsers} premium users out of ${stats.totalUsers} total users.`}
              className="flex justify-center"
            >
              <div className="w-48 h-48">
                <Doughnut
                  data={userTypeData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-default-500">
                <span className="text-amber-500 font-semibold">{stats.premiumUsers}</span> Premium
                Users
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Engagement Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody className="p-5">
            <h3 className="text-lg font-bold mb-4 text-default-800">Platform Engagement</h3>
            <div
              role="img"
              aria-label={`${stats.totalReactions} reactions, ${stats.totalComments} comments, ${stats.totalPosts} posts.`}
            >
              <Bar
                data={engagementData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            </div>
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardBody className="p-5">
            <h3 className="text-lg font-bold mb-4 text-default-800">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/admin-dashboard/users-management"
                className="p-4 bg-default-100 rounded-xl hover:bg-default-200 transition-colors text-center"
              >
                <Users className="mx-auto mb-2 text-primary-fg" size={24} />
                <p className="text-sm font-medium">Manage Users</p>
              </Link>
              <Link
                href="/admin-dashboard/posts-management"
                className="p-4 bg-default-100 rounded-xl hover:bg-default-200 transition-colors text-center"
              >
                <FileText className="mx-auto mb-2 text-secondary-fg" size={24} />
                <p className="text-sm font-medium">Manage Posts</p>
              </Link>
              <Link
                href="/admin-dashboard/author-transactions"
                className="p-4 bg-default-100 rounded-xl hover:bg-default-200 transition-colors text-center"
              >
                <DollarSign className="mx-auto mb-2 text-success" size={24} />
                <p className="text-sm font-medium">Transactions</p>
              </Link>
              <Link
                href="/admin-dashboard/reports"
                className="p-4 bg-default-100 rounded-xl hover:bg-default-200 transition-colors text-center"
              >
                <Eye className="mx-auto mb-2 text-warning" size={24} />
                <p className="text-sm font-medium">View Reports</p>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
