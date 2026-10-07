"use client";
import clsx from "clsx";
import NextLink from "next/link";
import React from "react";
import { useSidebarContext } from "../../layout/layout-context";

interface Props {
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  href?: string;
}

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
      className="text-default-900 max-w-full"
      onClick={handleClick}
    >
      <div
        className={clsx(
          isActive
            ? // Left rail + tint + bolder label: a background tint alone is
              // indistinguishable from hover in dark mode.
              "bg-default-100 font-semibold text-foreground shadow-[inset_3px_0_0_0_var(--color-primary)] [&_svg]:stroke-primary-fg"
            : "text-default-500 hover:bg-default-100 hover:text-default-700",
          "flex gap-2 w-full min-h-[44px] h-full items-center px-3.5 rounded-xl transition-all duration-150",
        )}
      >
        {icon}
        <span className="truncate">{title}</span>
      </div>
    </NextLink>
  );
};
