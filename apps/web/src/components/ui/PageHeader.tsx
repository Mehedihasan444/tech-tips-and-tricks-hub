"use client";

import React from "react";
import Link from "next/link";
import { Chip } from "@heroui/react";
import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@heroui/react";

export interface PageHeaderBreadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional leading icon in a tinted rounded tile */
  icon?: LucideIcon;
  /** Small badge shown next to the title (e.g. counts, "New") */
  badge?: React.ReactNode;
  /** Right-side actions (buttons, filters) */
  actions?: React.ReactNode;
  /** Breadcrumb trail rendered above the title */
  breadcrumbs?: PageHeaderBreadcrumb[];
  className?: string;
}

/**
 * Canonical page header — replaces all ad-hoc `text-3xl font-bold` blocks
 * and the legacy `PageTitle` (border-l-5) style.
 *
 * Usage:
 *   <PageHeader title="My Friends" subtitle="..." icon={Users} actions={...} />
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  badge,
  actions,
  breadcrumbs,
  className,
}) => {
  return (
    <div className={cn("mb-6", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1 text-sm">
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return (
              <span key={crumb.label} className="flex items-center gap-1">
                {i > 0 && (
                  <ChevronRight size={14} className="text-default-400" aria-hidden="true" />
                )}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="text-default-500 transition-colors hover:text-primary-fg"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={isLast ? "font-medium text-foreground" : "text-default-500"}
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          {Icon && (
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary-fg"
            >
              <Icon size={22} />
            </span>
          )}
          <div className="min-w-0">
            <h1 className="flex flex-wrap items-center gap-2 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {title}
              {badge}
            </h1>
            {subtitle && (
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-default-500">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
};

/** Small count badge used next to PageHeader titles */
export const CountBadge: React.FC<{ count: number; label?: string }> = ({ count, label }) => (
  <Chip size="sm" variant="flat" color="primary">
    {count}
    {label ? ` ${label}` : ""}
  </Chip>
);

export default PageHeader;
