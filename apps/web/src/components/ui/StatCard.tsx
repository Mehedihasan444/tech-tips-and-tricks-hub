"use client";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import { LucideIcon, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@heroui/react";

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon: LucideIcon;
  /** Accent for the icon tile: primary | secondary | success | warning | danger */
  tone?: "primary" | "secondary" | "success" | "warning" | "danger";
  href?: string;
  linkLabel?: string;
  className?: string;
}

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "bg-primary/10 text-primary-fg",
  secondary: "bg-secondary/10 text-secondary-fg",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
};

/**
 * Canonical dashboard stat / nav card.
 * Replaces the six hand-rolled `bg-default-50 shadow-lg` boxes on /dashboard.
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = "primary",
  href,
  linkLabel,
  className,
}) => {
  const body = (
    <CardBody className="p-5">
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className={cn("flex h-10 w-10 items-center justify-center rounded-xl", toneClasses[tone])}
        >
          <Icon size={20} />
        </span>
        {href && linkLabel ? (
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-fg">
            {linkLabel}
            <ArrowUpRight size={15} aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {subtitle && <p className="mt-1 text-xs leading-relaxed text-default-500">{subtitle}</p>}
    </CardBody>
  );

  if (href) {
    return (
      <Card
        as={Link}
        href={href}
        isPressable
        className={cn("surface hover-lift overflow-hidden", className)}
      >
        {body}
      </Card>
    );
  }

  return <Card className={cn("surface overflow-hidden", className)}>{body}</Card>;
};

export default StatCard;
