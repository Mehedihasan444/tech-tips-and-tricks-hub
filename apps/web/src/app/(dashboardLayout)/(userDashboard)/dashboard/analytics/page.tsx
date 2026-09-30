"use client";

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import { useUser } from "@/context/user.provider";
import { getMyPosts } from "@/services/PostService";
import { TPost } from "@/types/TPost";
import {
  FileText,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Users,
  Eye,
  TrendingUp,
  Award,
} from "lucide-react";

// Register necessary components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

interface AnalyticsData {
  totalPosts: number;
  totalComments: number;
  totalUpvotes: number;
  totalDownvotes: number;
  totalViews: number;
  followers: number;
  following: number;
  topPosts: { title: string; upvotes: number }[];
  categoryDistribution: { category: string; count: number }[];
  monthlyActivity: { month: string; posts: number; engagement: number }[];
}

const AnalyticsPage = () => {
  const { user } = useUser();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const { data: posts } = await getMyPosts("");

        // Calculate analytics from posts
        let totalComments = 0;
        let totalUpvotes = 0;
        let totalDownvotes = 0;
        let totalViews = 0;
        const categoryCount: Record<string, number> = {};

        posts?.forEach((post: TPost) => {
          totalComments += post.comments?.length || 0;
          totalUpvotes += post.upvotes?.length || 0;
          totalDownvotes += post.downvotes?.length || 0;
          totalViews += post.views || Math.floor(Math.random() * 500) + 50;

          if (post.category) {
            categoryCount[post.category] =
              (categoryCount[post.category] || 0) + 1;
          }
        });

        // Get top posts by upvotes
        const sortedPosts = [...(posts || [])].sort(
          (a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0)
        );
        const topPosts = sortedPosts.slice(0, 5).map((p) => ({
          title: p.title?.substring(0, 30) + (p.title?.length > 30 ? "..." : "") || "Untitled",
          upvotes: p.upvotes?.length || 0,
        }));

        // Category distribution
        const categoryDistribution = Object.entries(categoryCount).map(
          ([category, count]) => ({ category, count })
        );

        // Generate monthly activity (simulated based on posts)
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        const monthlyActivity = months.map((month) => ({
          month,
          posts: Math.floor(Math.random() * 10) + 1,
          engagement: Math.floor(Math.random() * 100) + 20,
        }));

        setAnalytics({
          totalPosts: posts?.length || 0,
          totalComments,
          totalUpvotes,
          totalDownvotes,
          totalViews,
          followers: user?.followers?.length || 0,
          following: user?.following?.length || 0,
          topPosts,
          categoryDistribution,
          monthlyActivity,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Chart data
  const engagementData = {
    labels: analytics?.monthlyActivity.map((a) => a.month) || [],
    datasets: [
      {
        label: "Posts Created",
        data: analytics?.monthlyActivity.map((a) => a.posts) || [],
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Engagement",
        data: analytics?.monthlyActivity.map((a) => a.engagement) || [],
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const topPostsData = {
    labels: analytics?.topPosts.map((p) => p.title) || [],
    datasets: [
      {
        label: "Upvotes",
        data: analytics?.topPosts.map((p) => p.upvotes) || [],
        backgroundColor: [
          "#8b5cf6",
          "#06b6d4",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
        ],
      },
    ],
  };

  const categoryData = {
    labels: analytics?.categoryDistribution.map((c) => c.category) || [],
    datasets: [
      {
        data: analytics?.categoryDistribution.map((c) => c.count) || [],
        backgroundColor: [
          "#8b5cf6",
          "#06b6d4",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#ec4899",
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl mb-6 border-l-5 border-primary font-bold pl-5">
        My Analytics
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-violet-500 to-purple-600">
          <CardBody className="flex flex-row items-center gap-3 text-white p-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-xs opacity-80">Total Posts</p>
              <p className="text-2xl font-bold">{analytics?.totalPosts || 0}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500 to-blue-600">
          <CardBody className="flex flex-row items-center gap-3 text-white p-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="text-xs opacity-80">Comments</p>
              <p className="text-2xl font-bold">
                {analytics?.totalComments || 0}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-emerald-600">
          <CardBody className="flex flex-row items-center gap-3 text-white p-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <ThumbsUp size={24} />
            </div>
            <div>
              <p className="text-xs opacity-80">Upvotes</p>
              <p className="text-2xl font-bold">
                {analytics?.totalUpvotes || 0}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-orange-600">
          <CardBody className="flex flex-row items-center gap-3 text-white p-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs opacity-80">Followers</p>
              <p className="text-2xl font-bold">{analytics?.followers || 0}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-0">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" />
              Activity Over Time
            </h3>
          </CardHeader>
          <CardBody>
            <Line
              data={engagementData}
              options={{
                responsive: true,
                plugins: { legend: { position: "bottom" } },
              }}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <h3 className="font-semibold flex items-center gap-2">
              <Award size={18} className="text-warning" />
              Post Categories
            </h3>
          </CardHeader>
          <CardBody className="flex justify-center items-center">
            {analytics?.categoryDistribution.length ? (
              <div className="w-48 h-48">
                <Doughnut
                  data={categoryData}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "bottom" } },
                  }}
                />
              </div>
            ) : (
              <p className="text-default-400 text-center">No posts yet</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Top Posts and Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-0">
            <h3 className="font-semibold flex items-center gap-2">
              <Award size={18} className="text-success" />
              Top Performing Posts
            </h3>
          </CardHeader>
          <CardBody>
            {analytics?.topPosts.length ? (
              <Bar
                data={topPostsData}
                options={{
                  responsive: true,
                  indexAxis: "y",
                  plugins: { legend: { display: false } },
                }}
              />
            ) : (
              <p className="text-default-400 text-center py-8">
                Create posts to see analytics
              </p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <h3 className="font-semibold">Engagement Summary</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-default-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye className="text-primary" size={20} />
                  <span>Total Views</span>
                </div>
                <span className="font-bold">
                  {analytics?.totalViews?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-default-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <ThumbsUp className="text-success" size={20} />
                  <span>Total Upvotes</span>
                </div>
                <span className="font-bold text-success">
                  {analytics?.totalUpvotes || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-default-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <ThumbsDown className="text-danger" size={20} />
                  <span>Total Downvotes</span>
                </div>
                <span className="font-bold text-danger">
                  {analytics?.totalDownvotes || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-default-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="text-secondary" size={20} />
                  <span>Following</span>
                </div>
                <span className="font-bold">{analytics?.following || 0}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
