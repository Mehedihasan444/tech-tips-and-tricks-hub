"use client";
import React, { ReactNode } from "react";
import { Accordion, AccordionItem } from "@heroui/react";

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
  items: CollapseItem[];
}

export const CollapseItems = ({ icon, items, title, pathname }: Props) => {
  // Without this, landing directly on a child route leaves the section closed
  // and no item in the sidebar reads as active.
  const hasActiveChild = items.some((item) => item.href === pathname);
  // `selectedKeys` alone makes the accordion fully controlled with no way to
  // toggle it, so the section could never be opened by clicking its header.
  // Track openness locally, auto-opening whenever the route moves to a child.
  const [isOpen, setIsOpen] = React.useState(hasActiveChild);

  React.useEffect(() => {
    if (hasActiveChild) setIsOpen(true);
  }, [hasActiveChild, pathname]);

  return (
    <div className="flex gap-4 h-full items-center">
      <Accordion
        className="px-0"
        selectedKeys={isOpen ? new Set([title]) : new Set<string>([])}
        onSelectionChange={(keys) =>
          setIsOpen(keys === "all" ? true : (keys as Set<string>).has(title))
        }
      >
        <AccordionItem
          key={title}
          indicator={<ChevronRight />}
          classNames={{
            indicator: "data-[open=true]:rotate-90",
            trigger:
              "py-0 min-h-[44px] hover:bg-default-100 rounded-xl data-[open=true]:bg-default-100 transition-transform px-3.5",

            title: `px-0 flex text-base gap-2 h-full items-center cursor-pointer`,
            content: "bg-default-100 rounded-xl mt-1",
          }}
          aria-label={title}
          title={
            <div className="flex flex-row gap-2">
              <span>{icon}</span>
              <span>{title}</span>
            </div>
          }
        >
          <div className="pl-12 space-y-2">
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
    </div>
  );
};
