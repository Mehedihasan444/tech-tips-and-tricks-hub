"use client";

import React from "react";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { LucideIcon } from "lucide-react";
import { cn } from "@heroui/react";

interface ContentCardProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

/**
 * Canonical content card — one surface, one padding, one header pattern.
 * Use for forms, info panels, settings sections, contact info, etc.
 */
export const ContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  actions,
  children,
  className,
  bodyClassName,
}) => {
  return (
    <Card className={cn("surface overflow-hidden", className)}>
      {title && (
        <>
          <CardHeader className="flex items-start justify-between gap-3 pb-3">
            <div className="flex items-center gap-2.5">
              {Icon && (
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary-fg"
                >
                  <Icon size={18} />
                </span>
              )}
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
                {subtitle && <p className="text-sm text-default-500">{subtitle}</p>}
              </div>
            </div>
            {actions}
          </CardHeader>
          <Divider />
        </>
      )}
      <CardBody className={cn("gap-4 p-5", bodyClassName)}>{children}</CardBody>
    </Card>
  );
};

export default ContentCard;
