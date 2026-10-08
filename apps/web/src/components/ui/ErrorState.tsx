"use client";

import React from "react";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/ui/EmptyState";
import { LucideIcon } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  /** Called on retry. Defaults to router.refresh() (preserves scroll + form state). */
  onRetry?: () => void;
  retryLabel?: string;
  icon?: LucideIcon;
}

/**
 * Canonical error block — always prefers in-place retry over
 * `window.location.reload()` (which loses scroll, filters and draft state).
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  description = "Check your connection and try again.",
  onRetry,
  retryLabel = "Try again",
  icon,
}) => {
  const router = useRouter();
  const handleRetry = () => {
    if (onRetry) onRetry();
    else router.refresh();
  };

  return (
    <div className="overflow-hidden surface overflow-hidden rounded-2xl">
      <EmptyState
        type="custom"
        title={title}
        description={description}
        icon={icon}
        actionLabel={retryLabel}
        onAction={handleRetry}
      />
    </div>
  );
};

interface AuthRequiredStateProps {
  title?: string;
  description?: string;
  loginHref?: string;
}

/** Shown instead of rendering a blank page for logged-out visitors. */
export const AuthRequiredState: React.FC<AuthRequiredStateProps> = ({
  title = "Sign in required",
  description = "Please sign in to view this content.",
  loginHref = "/login",
}) => {
  const router = useRouter();
  return (
    <div className="overflow-hidden surface overflow-hidden rounded-2xl">
      <EmptyState
        type="custom"
        title={title}
        description={description}
        actionLabel="Sign in"
        onAction={() => router.push(loginHref)}
      />
    </div>
  );
};

export default ErrorState;
