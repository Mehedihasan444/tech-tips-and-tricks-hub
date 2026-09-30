"use client"
import React from "react";
import { User, BarChart2, FileText, DollarSign, Users, FolderOpen } from "lucide-react";
import { useUser } from "@/context/user.provider";
import Link from "next/link";

const DashboardPage = () => {
  const { user } = useUser()
  
  // Calculate real stats from user data
  const followersCount = user?.followers?.length || 0;
  const followingCount = user?.following?.length || 0;
  
  return (
    // bg-gradient-to-r from-blue-100 to-teal-100
    <div className="min-h-screen  p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-default-800 mb-2">
          Welcome back, {user?.name || 'User'}! 👋
        </h2>
        <p className="text-lg text-default-600">
          Here&apos;s an overview of your account and recent activities.
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="bg-default-50 shadow-lg hover:shadow-xl transition-shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <User className="text-teal-600 w-6 h-6 mr-2" />
            <h3 className="text-2xl font-semibold text-default-800">Profile Overview</h3>
          </div>
          <p className="text-default-600 mb-2">
            <strong>Name:</strong> {user?.name}
          </p>
          <p className="text-default-600 mb-2">
            <strong>Email:</strong> {user?.email}
          </p>
          <p className="text-default-600 mb-2">
            <strong>Username:</strong> @{user?.nickName || 'N/A'}
          </p>
          <p className="text-default-600">
            <strong>Member Since:</strong> {user?.createdAt?.split('T')[0]}
          </p>
        </div>

        {/* Analytics */}
        <div className="bg-default-50 shadow-lg hover:shadow-xl transition-shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <BarChart2 className="text-teal-600 w-6 h-6 mr-2" />
            <h3 className="text-2xl font-semibold text-default-800">Quick Stats</h3>
          </div>
          <p className="text-default-600 mb-2">
            <strong>Followers:</strong> {followersCount}
          </p>
          <p className="text-default-600 mb-2">
            <strong>Following:</strong> {followingCount}
          </p>
          <p className="text-default-600">
            <strong>Status:</strong> {user?.isPremium ? '⭐ Premium Member' : 'Free Account'}
          </p>
          <Link
            href="/dashboard/analytics"
            className="inline-block mt-3 text-teal-600 font-medium hover:underline hover:text-teal-800 transition duration-300"
          >
            View Full Analytics →
          </Link>
        </div>

        {/* My Posts */}
        <div className="bg-default-50 shadow-lg hover:shadow-xl transition-shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FileText className="text-teal-600 w-6 h-6 mr-2" />
            <h3 className="text-2xl font-semibold text-default-800">My Posts</h3>
          </div>
          <p className="text-default-600 mb-4">
            Manage your posts, view statistics, and create new content.
          </p>
          <Link
            href="/dashboard/my-posts"
            className="text-teal-600 font-medium hover:underline hover:text-teal-800 transition duration-300"
          >
            Go to My Posts →
          </Link>
        </div>

        {/* My Drafts */}
        <div className="bg-default-50 shadow-lg hover:shadow-xl transition-shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FolderOpen className="text-amber-600 w-6 h-6 mr-2" />
            <h3 className="text-2xl font-semibold text-default-800">My Drafts</h3>
          </div>
          <p className="text-default-600 mb-4">
            Continue working on your saved drafts and unpublished content.
          </p>
          <Link
            href="/dashboard/drafts"
            className="text-teal-600 font-medium hover:underline hover:text-teal-800 transition duration-300"
          >
            View Drafts →
          </Link>
        </div>

        {/* Payments */}
        <div className="bg-default-50 shadow-lg hover:shadow-xl transition-shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <DollarSign className="text-teal-600 w-6 h-6 mr-2" />
            <h3 className="text-2xl font-semibold text-default-800">Payments</h3>
          </div>
          <p className="text-default-600 mb-4">
            View your payment history and subscription status.
          </p>
          <Link
            href="/dashboard/payments"
            className="text-teal-600 font-medium hover:underline hover:text-teal-800 transition duration-300"
          >
            Go to Payments →
          </Link>
        </div>

        {/* Followed Activities */}
        <div className="bg-default-50 shadow-lg hover:shadow-xl transition-shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Users className="text-teal-600 w-6 h-6 mr-2" />
            <h3 className="text-2xl font-semibold text-default-800">Following Activity</h3>
          </div>
          <p className="text-default-600 mb-4">
            Stay updated with the activities of the {followingCount} people you&apos;re following.
          </p>
          <Link
            href="/dashboard/following-activity"
            className="text-teal-600 font-medium hover:underline hover:text-teal-800 transition duration-300"
          >
            View Activity →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
