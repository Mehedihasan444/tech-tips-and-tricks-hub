"use client";
import React from "react";
import { cn } from "@heroui/react";

interface SkeletonProps {
  className?: string;
  animated?: boolean;
}

// Base skeleton component
export const Skeleton: React.FC<SkeletonProps> = ({ className = "", animated = true }) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-default-200",
        // Each block only gets its own `animate-pulse` when it is the root of the
        // skeleton. Children pass `animated={false}` so a card of ~15 blocks
        // does not run 15 independent opacity pulses that drift out of phase and
        // read as flickering rather than loading.
        animated && "motion-safe:animate-pulse",
        className,
      )}
    >
      {animated && <span aria-hidden="true" className="shimmer absolute inset-0" />}
    </div>
  );
};

// Circle skeleton for avatars
export const SkeletonCircle: React.FC<SkeletonProps & { size?: "sm" | "md" | "lg" | "xl" }> = ({
  className = "",
  animated = true,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full bg-default-200",
        animated && "motion-safe:animate-pulse",
        sizeClasses[size],
        className,
      )}
    >
      {animated && <span aria-hidden="true" className="shimmer absolute inset-0" />}
    </div>
  );
};

// Text skeleton for single line text
export const SkeletonText: React.FC<SkeletonProps & { lines?: number; lastLineWidth?: string }> = ({
  className = "",
  animated = true,
  lines = 1,
  lastLineWidth = "75%",
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "relative h-4 overflow-hidden rounded bg-default-200",
            animated && "motion-safe:animate-pulse",
          )}
          style={{
            width: index === lines - 1 && lines > 1 ? lastLineWidth : "100%",
          }}
        >
          {animated && <span aria-hidden="true" className="shimmer absolute inset-0" />}
        </div>
      ))}
    </div>
  );
};

// Card skeleton wrapper
export const SkeletonCard: React.FC<SkeletonProps & { children?: React.ReactNode }> = ({
  className = "",
  animated = true,
  children,
}) => {
  return (
    <div
      className={cn(
        "bg-content1 rounded-2xl border border-divider p-6",
        animated && "motion-safe:animate-pulse",
        className,
      )}
    >
      {children}
    </div>
  );
};

// Post Card Skeleton. Decorative on purpose: the busy state belongs on the
// surrounding container (see `aria-busy`), so a grid of these is not announced
// once per row.
export const PostCardSkeleton: React.FC<{ animated?: boolean }> = ({ animated = true }) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-content1 rounded-2xl border border-divider p-6 space-y-4",
        animated && "motion-safe:animate-pulse",
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <SkeletonCircle size="lg" animated={false} />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" animated={false} />
          <Skeleton className="h-3 w-48" animated={false} />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" animated={false} />
      </div>

      {/* Category Badge */}
      <Skeleton className="h-6 w-24 rounded-full" animated={false} />

      {/* Title */}
      <Skeleton className="h-6 w-3/4" animated={false} />

      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" animated={false} />
        <Skeleton className="h-4 w-full" animated={false} />
        <Skeleton className="h-4 w-2/3" animated={false} />
      </div>

      {/* Image placeholder */}
      <Skeleton className="h-48 w-full rounded-xl" animated={false} />

      {/* Tags */}
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" animated={false} />
        <Skeleton className="h-6 w-20 rounded-full" animated={false} />
        <Skeleton className="h-6 w-14 rounded-full" animated={false} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-divider">
        <div className="flex gap-4">
          <Skeleton className="h-9 w-16 rounded-lg" animated={false} />
          <Skeleton className="h-9 w-16 rounded-lg" animated={false} />
          <Skeleton className="h-9 w-16 rounded-lg" animated={false} />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-lg" animated={false} />
          <Skeleton className="h-9 w-9 rounded-lg" animated={false} />
        </div>
      </div>
    </div>
  );
};

// Story Skeleton
export const StorySkeleton: React.FC<{ animated?: boolean }> = ({ animated = true }) => {
  return (
    <div
      className={cn("flex flex-col items-center gap-2", animated && "motion-safe:animate-pulse")}
    >
      <div className="w-16 h-16 rounded-full bg-default-200 ring-2 ring-default-200" />
      <Skeleton className="h-3 w-14" animated={false} />
    </div>
  );
};

// Stories Section Skeleton
export const StoriesSectionSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div aria-hidden="true" className="flex gap-4 p-4 overflow-hidden motion-safe:animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <StorySkeleton key={index} animated={false} />
      ))}
    </div>
  );
};

// User Card Skeleton
export const UserCardSkeleton: React.FC<{ animated?: boolean }> = ({ animated = true }) => {
  return (
    <div
      aria-hidden="true"
      className={cn("flex items-center gap-3 p-3", animated && "motion-safe:animate-pulse")}
    >
      <SkeletonCircle size="md" animated={false} />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" animated={false} />
        <Skeleton className="h-3 w-32" animated={false} />
      </div>
      <Skeleton className="h-8 w-20 rounded-lg" animated={false} />
    </div>
  );
};

// Comment Skeleton
export const CommentSkeleton: React.FC<{ animated?: boolean }> = ({ animated = true }) => {
  return (
    <div aria-hidden="true" className={cn("flex gap-3", animated && "motion-safe:animate-pulse")}>
      <SkeletonCircle size="sm" animated={false} />
      <div className="flex-1 space-y-2">
        <div className="bg-default-100 rounded-lg p-3 space-y-2">
          <Skeleton className="h-4 w-24" animated={false} />
          <Skeleton className="h-3 w-full" animated={false} />
          <Skeleton className="h-3 w-3/4" animated={false} />
        </div>
        <div className="flex gap-4 px-2">
          <Skeleton className="h-3 w-12" animated={false} />
          <Skeleton className="h-3 w-10" animated={false} />
        </div>
      </div>
    </div>
  );
};

// Table Row Skeleton
export const TableRowSkeleton: React.FC<{ columns?: number; animated?: boolean }> = ({
  columns = 4,
  animated = true,
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex items-center gap-4 p-4 border-b border-divider",
        animated && "motion-safe:animate-pulse",
      )}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} className="h-4 flex-1" animated={false} />
      ))}
    </div>
  );
};

// Sidebar Skeleton
export const SidebarSkeleton: React.FC = () => {
  return (
    <div aria-hidden="true" className="space-y-4 p-4 motion-safe:animate-pulse">
      {/* Profile section */}
      <div className="flex items-center gap-3 p-3">
        <SkeletonCircle size="lg" animated={false} />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" animated={false} />
          <Skeleton className="h-3 w-16" animated={false} />
        </div>
      </div>

      {/* Menu items */}
      <div className="space-y-2 mt-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 p-3">
            <Skeleton className="h-5 w-5 rounded" animated={false} />
            <Skeleton className="h-4 w-24" animated={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Dashboard Card Skeleton
export const DashboardCardSkeleton: React.FC<{ animated?: boolean }> = ({ animated = true }) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-content1 rounded-2xl border border-divider p-6 space-y-4",
        animated && "motion-safe:animate-pulse",
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-lg" animated={false} />
        <Skeleton className="h-6 w-16 rounded-full" animated={false} />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-20" animated={false} />
        <Skeleton className="h-4 w-32" animated={false} />
      </div>
    </div>
  );
};

export default Skeleton;
