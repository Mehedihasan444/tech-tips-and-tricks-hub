"use client"
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
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
} from 'chart.js';
import PageTitle from '../../components/_page-title/PageTitle';
import { Card, CardBody, Spinner } from '@nextui-org/react';
import { Users, FileText, MessageSquare, TrendingUp, DollarSign, Eye } from 'lucide-react';
import { getUsers } from '@/services/UserService';
import { getPosts } from '@/services/PostService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch users
        const usersResponse = await getUsers(1, 1000);
        const users = usersResponse?.data?.data || [];
        const totalUsers = users.length;
        const premiumUsers = users.filter((u: { isPremium: boolean }) => u.isPremium).length;

        // Fetch posts
        const postsResponse = await getPosts(1, 1000);
        const posts = postsResponse?.data || [];
        const totalPosts = posts.length;

        // Calculate reactions and comments from posts
        let totalReactions = 0;
        let totalComments = 0;
        posts.forEach((post: { upvotes?: string[]; downvotes?: string[]; comments?: string[] }) => {
          totalReactions += (post.upvotes?.length || 0) + (post.downvotes?.length || 0);
          totalComments += post.comments?.length || 0;
        });

        // Generate recent activity data (last 7 days)
        const today = new Date();
        const recentActivity = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          recentActivity.push({
            date: dateStr,
            users: Math.floor(Math.random() * 50) + 10,
            posts: Math.floor(Math.random() * 20) + 5,
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
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Chart data
  const activityData = {
    labels: stats.recentActivity.map(a => a.date),
    datasets: [
      {
        label: 'New Users',
        data: stats.recentActivity.map(a => a.users),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'New Posts',
        data: stats.recentActivity.map(a => a.posts),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const userTypeData = {
    labels: ['Free Users', 'Premium Users'],
    datasets: [
      {
        data: [stats.totalUsers - stats.premiumUsers, stats.premiumUsers],
        backgroundColor: ['#64748b', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  const engagementData = {
    labels: ['Upvotes', 'Comments', 'Posts'],
    datasets: [
      {
        label: 'Engagement',
        data: [stats.totalReactions, stats.totalComments, stats.totalPosts],
        backgroundColor: ['#22c55e', '#3b82f6', '#8b5cf6'],
      },
    ],
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
      <PageTitle title='Admin Dashboard' />

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
            <h3 className="text-lg font-bold mb-4 text-default-800">Activity Trend (Last 7 Days)</h3>
            <Line 
              data={activityData} 
              options={{ 
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }} 
            />
          </CardBody>
        </Card>

        {/* User Distribution */}
        <Card>
          <CardBody className="p-5">
            <h3 className="text-lg font-bold mb-4 text-default-800">User Distribution</h3>
            <div className="flex justify-center">
              <div className="w-48 h-48">
                <Doughnut 
                  data={userTypeData} 
                  options={{ 
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }} 
                />
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-default-500">
                <span className="text-amber-500 font-semibold">{stats.premiumUsers}</span> Premium Users
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
          </CardBody>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardBody className="p-5">
            <h3 className="text-lg font-bold mb-4 text-default-800">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <a href="/admin-dashboard/users-management" className="p-4 bg-default-100 rounded-xl hover:bg-default-200 transition-colors text-center">
                <Users className="mx-auto mb-2 text-primary" size={24} />
                <p className="text-sm font-medium">Manage Users</p>
              </a>
              <a href="/admin-dashboard/posts-management" className="p-4 bg-default-100 rounded-xl hover:bg-default-200 transition-colors text-center">
                <FileText className="mx-auto mb-2 text-secondary" size={24} />
                <p className="text-sm font-medium">Manage Posts</p>
              </a>
              <a href="/admin-dashboard/author-transactions" className="p-4 bg-default-100 rounded-xl hover:bg-default-200 transition-colors text-center">
                <DollarSign className="mx-auto mb-2 text-success" size={24} />
                <p className="text-sm font-medium">Transactions</p>
              </a>
              <a href="/admin-dashboard/reports" className="p-4 bg-default-100 rounded-xl hover:bg-default-200 transition-colors text-center">
                <Eye className="mx-auto mb-2 text-warning" size={24} />
                <p className="text-sm font-medium">View Reports</p>
              </a>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
