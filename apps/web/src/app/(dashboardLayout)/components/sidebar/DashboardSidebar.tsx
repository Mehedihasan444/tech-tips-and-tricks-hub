"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, Chip } from "@heroui/react";
import { ArrowUpRight, Crown, ShieldCheck } from "lucide-react";
import { useUser } from "@/context/user.provider";
import { formatHandle } from "@/utils/formatHandle";
import { useSidebarContext } from "../../layout/layout-context";
import { Sidebar } from "./sidebar.styles";
import { SidebarItem, isActivePath } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { CollapseItems } from "./collapse-items";

export interface SidebarChild {
  title: string;
  href: string;
  icon: ReactNode;
}

export interface SidebarEntry {
  title: string;
  href?: string;
  icon: ReactNode;
  /** Match the href exactly — required for section roots like `/dashboard`. */
  exact?: boolean;
  children?: SidebarChild[];
}

export interface SidebarSection {
  label: string;
  entries: SidebarEntry[];
}

interface DashboardSidebarProps {
  /** Caption under the wordmark, e.g. "Creator Studio" or "Admin Console". */
  caption: string;
  sections: SidebarSection[];
}

/**
 * Shared elegant sidebar for every dashboard.
 * User + admin sidebars are thin configs over this shell — one visual
 * language, one behavior (drawer, active states, footer) to maintain.
 */
export const DashboardSidebar = ({ caption, sections }: DashboardSidebarProps) => {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebarContext();
  const { user } = useUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <aside id="dashboard-sidebar" className="sticky top-0 z-[20] h-screen shrink-0">
      {isOpen ? (
        <div className={Sidebar.Overlay()} onClick={() => setIsOpen(false)} aria-hidden="true" />
      ) : null}
      <div className={Sidebar({ isOpen })}>
        {/* Brand */}
        <div className={Sidebar.Header()}>
          <Link
            href="/"
            className="group flex items-center gap-2.5 outline-none"
            aria-label="Back to site home"
          >
            <span className="relative flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 via-primary-500 to-secondary-500 shadow-glow-primary transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100">
              <span className="text-lg font-bold leading-none text-white">T</span>
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/25 to-transparent"
              />
            </span>
            <span className="leading-tight">
              <span className="text-gradient block text-[17px] font-bold tracking-tight">
                Tech Tips &amp; Tricks
              </span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-default-400">
                {caption}
              </span>
            </span>
          </Link>
        </div>
        <div
          aria-hidden="true"
          className="mx-5 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent"
        />

        {/* Nav */}
        <div className={Sidebar.Body()}>
          {sections.map((section) => (
            <SidebarMenu key={section.label} title={section.label}>
              {section.entries.map((entry) =>
                entry.children ? (
                  <CollapseItems
                    key={entry.title}
                    icon={entry.icon}
                    title={entry.title}
                    pathname={pathname}
                    isActive={entry.href ? isActivePath(pathname, entry.href) : undefined}
                    items={entry.children}
                  />
                ) : (
                  <SidebarItem
                    key={entry.href ?? entry.title}
                    title={entry.title}
                    icon={entry.icon}
                    href={entry.href}
                    isActive={entry.href ? isActivePath(pathname, entry.href, entry.exact) : false}
                  />
                ),
              )}
            </SidebarMenu>
          ))}
        </div>

        {/* Profile footer */}
        <div className={Sidebar.Footer()}>
          <div className="rounded-2xl border border-divider bg-default-50 p-3">
            <div className="flex items-center gap-2.5">
              <Avatar
                src={user?.profilePhoto || undefined}
                name={user?.name?.trim() ? user.name : "?"}
                size="sm"
                className="shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user?.name || "Welcome"}
                </p>
                <p className="truncate text-xs text-default-500">
                  {user?.nickName ? formatHandle(user.nickName) : "Sign in for more"}
                </p>
              </div>
              {isAdmin ? (
                <Chip
                  size="sm"
                  color="primary"
                  variant="flat"
                  startContent={<ShieldCheck size={12} />}
                >
                  Admin
                </Chip>
              ) : user?.isPremium ? (
                <Chip size="sm" color="warning" variant="flat" startContent={<Crown size={12} />}>
                  Pro
                </Chip>
              ) : null}
            </div>
            <Link
              href="/"
              className="mt-2.5 flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-medium text-default-500 transition-colors hover:bg-primary/10 hover:text-primary-fg"
            >
              View site
              <ArrowUpRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
