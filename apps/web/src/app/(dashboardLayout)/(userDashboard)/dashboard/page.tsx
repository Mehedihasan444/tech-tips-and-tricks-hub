"use client";
import React from "react";
import Link from "next/link";
import {
  User,
  BarChart2,
  FileText,
  DollarSign,
  Users,
  FolderOpen,
  Crown,
  PenSquare,
  ArrowRight,
} from "lucide-react";
import { useUser } from "@/context/user.provider";
import { formatHandle } from "@/utils/formatHandle";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import { DashboardCardSkeleton } from "@/components/ui/Skeleton";
import { Button, Chip } from "@heroui/react";
import { LayoutDashboard } from "lucide-react";

const DashboardPage = () => {
  const { user, isLoading } = useUser();

  const followersCount = user?.followers?.length || 0;
  const followingCount = user?.following?.length || 0;
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        <PageHeader
          title="Dashboard"
          subtitle="Here's an overview of your account and recent activity."
          icon={LayoutDashboard}
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <DashboardCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`}
        subtitle="Here's an overview of your account and recent activity."
        icon={LayoutDashboard}
        badge={
          user?.isPremium ? (
            <Chip size="sm" color="warning" variant="flat" startContent={<Crown size={13} />}>
              Premium
            </Chip>
          ) : undefined
        }
      />

      <section className="hero-premium relative mb-6 overflow-hidden rounded-2xl border border-white/10">
        <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              Have knowledge to share?
            </h2>
            <p className="mt-1 text-sm text-white/75">
              Publish your next tip in under two minutes — drafts save automatically.
            </p>
          </div>
          <Button
            as={Link}
            href="/dashboard/create-post"
            className="shrink-0 bg-white font-semibold text-primary-800"
            startContent={<PenSquare size={16} />}
            endContent={<ArrowRight size={16} />}
          >
            Create Post
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Profile"
          value={user?.name || "—"}
          subtitle={`${user?.nickName ? formatHandle(user.nickName) : "n/a"} · Member since ${memberSince}`}
          icon={User}
          tone="primary"
          href={user?.nickName ? `/profile/${user.nickName}` : undefined}
          linkLabel="View profile"
        />
        <StatCard
          title="Community"
          value={`${followersCount} followers · ${followingCount} following`}
          subtitle={user?.isPremium ? "Premium member" : "Free account"}
          icon={BarChart2}
          tone="secondary"
          href="/dashboard/analytics"
          linkLabel="Full analytics"
        />
        <StatCard
          title="My Posts"
          value="Manage content"
          subtitle="Create, edit and track your posts."
          icon={FileText}
          tone="primary"
          href="/dashboard/my-posts"
          linkLabel="Go to posts"
        />
        <StatCard
          title="Drafts"
          value="Unpublished work"
          subtitle="Continue where you left off."
          icon={FolderOpen}
          tone="warning"
          href="/dashboard/drafts"
          linkLabel="View drafts"
        />
        <StatCard
          title="Payments"
          value={user?.isPremium ? "Premium active" : "Free plan"}
          subtitle="Subscription and billing history."
          icon={DollarSign}
          tone="success"
          href="/dashboard/payments"
          linkLabel="Billing"
        />
        <StatCard
          title="Following activity"
          value={`${followingCount} followed`}
          subtitle="Latest posts from people you follow."
          icon={Users}
          tone="primary"
          href="/dashboard/following-activity"
          linkLabel="View activity"
        />
      </div>
    </div>
  );
};

export default DashboardPage;
