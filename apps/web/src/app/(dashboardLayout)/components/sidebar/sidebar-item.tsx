"use client";
import NextLink from "next/link";
import React from "react";
import { cn } from "@heroui/react";
import { useSidebarContext } from "../../layout/layout-context";

interface Props {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  href?: string;
}

/** True for the route itself and any nested route (`/my-posts/123` keeps "My Posts" lit).
 *  Pass `exact` for section roots (`/dashboard`): without it every dashboard
 *  route would keep "Dashboard Home" lit via the prefix match. */
export const isActivePath = (pathname: string, href: string, exact = false) =>
  pathname === href || (!exact && pathname.startsWith(`${href}/`));

export const SidebarItem = ({ icon, title, isActive, href = "" }: Props) => {
  const { isOpen, setIsOpen } = useSidebarContext();
  const handleClick = () => {
    // Close the mobile drawer after navigation; harmless on desktop where
    // the sidebar is always visible.
    if (isOpen && window.innerWidth < 768) {
      setIsOpen(false);
    }
  };
  return (
    <NextLink
      href={href}
      aria-current={isActive ? "page" : undefined}
      onClick={handleClick}
      className="block max-w-full outline-none"
    >
      <span
        className={cn(
          "group flex min-h-[42px] w-full items-center gap-3 rounded-xl px-3 text-sm transition-all duration-200 motion-reduce:transition-none [&_svg]:size-[18px] [&_svg]:shrink-0",
          isActive
            ? "bg-primary font-semibold text-white shadow-glow-primary"
            : "text-default-600 hover:translate-x-0.5 hover:bg-default-100 hover:text-foreground",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex size-8 items-center justify-center rounded-lg transition-colors",
            isActive
              ? "bg-white/20"
              : "bg-default-100 text-default-500 group-hover:bg-primary/10 group-hover:text-primary-fg",
          )}
        >
          {icon}
        </span>
        <span className="truncate">{title}</span>
      </span>
    </NextLink>
  );
};
