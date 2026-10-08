"use client";
import React, { ReactNode } from "react";
import { Accordion, AccordionItem, cn } from "@heroui/react";

import { ChevronRight } from "lucide-react";

import { SidebarItem } from "./sidebar-item";

interface CollapseItem {
  title: string;
  icon: ReactNode;
  href?: string;
}

interface Props {
  icon: ReactNode;
  title: string;
  /** The current pathname, used to open this section when a child route is active. */
  pathname?: string;
  /** True when any child route is active — tints the group header. */
  isActive?: boolean;
  items: CollapseItem[];
}

export const CollapseItems = ({ icon, items, title, pathname, isActive }: Props) => {
  // Without this, landing directly on a child route leaves the section closed
  // and no item in the sidebar reads as active.
  const hasActiveChild = items.some((item) => item.href === pathname);
  // `selectedKeys` alone makes the accordion fully controlled with no way to
  // toggle it, so the section could never be opened by clicking its header.
  // Track openness locally, auto-opening whenever the route moves to a child.
  const [isOpen, setIsOpen] = React.useState(hasActiveChild);
  const open = isOpen || hasActiveChild;

  React.useEffect(() => {
    if (hasActiveChild) setIsOpen(true);
  }, [hasActiveChild, pathname]);

  const highlighted = isActive || hasActiveChild;

  return (
    <Accordion
      className="px-0"
      selectedKeys={open ? new Set([title]) : new Set<string>([])}
      onSelectionChange={(keys) =>
        setIsOpen(keys === "all" ? true : (keys as Set<string>).has(title))
      }
    >
      <AccordionItem
        key={title}
        indicator={<ChevronRight size={16} />}
        classNames={{
          indicator: "text-default-400 transition-transform data-[open=true]:rotate-90",
          trigger: cn(
            "group min-h-[42px] rounded-xl px-3 py-0 transition-all duration-200 hover:bg-default-100 motion-reduce:transition-none data-[open=true]:bg-default-100 [&_svg]:shrink-0",
            highlighted && "bg-primary/10",
          ),
          title: "text-sm",
          content: "pt-1",
        }}
        aria-label={title}
        title={
          <span className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={cn(
                "flex size-8 items-center justify-center rounded-lg transition-colors [&_svg]:size-[18px]",
                highlighted
                  ? "bg-primary/15 text-primary-fg"
                  : "bg-default-100 text-default-500 group-hover:bg-primary/10 group-hover:text-primary-fg",
              )}
            >
              {icon}
            </span>
            <span
              className={cn(
                "truncate",
                highlighted ? "font-semibold text-primary-fg" : "text-default-600",
              )}
            >
              {title}
            </span>
          </span>
        }
      >
        {/* Tree rail: children hang off a hairline so the grouping reads at a glance. */}
        <div className="mb-1 ml-[22px] space-y-1 border-l border-divider pl-3">
          {items.map((item) => (
            <SidebarItem
              key={item.href ?? item.title}
              isActive={pathname === item.href}
              title={item.title}
              icon={item.icon}
              href={item.href}
            />
          ))}
        </div>
      </AccordionItem>
    </Accordion>
  );
};
