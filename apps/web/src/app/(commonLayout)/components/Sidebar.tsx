"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Tooltip } from "@heroui/react";
import {
  Home,
  Users,
  Star,
  Settings,
  Menu,
  X,
  NotebookTabs,
  Store,
  Handshake,
  Bookmark,
  ChevronRight,
  Compass,
  MessageSquareText,
  Bell,
} from "lucide-react";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Compass, label: "Explore", href: "/explore" },
  { icon: MessageSquareText, label: "Messages", href: "/messages" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Handshake, label: "Friends", href: "/my-friends" },
  { icon: Bookmark, label: "Saved Posts", href: "/saved-posts" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: Star, label: "Premium", href: "/subscription", isPremium: true },
  { icon: Store, label: "About Us", href: "/about-us" },
  { icon: NotebookTabs, label: "Contact Us", href: "/contact-us" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside
      aria-label="Primary"
      className={`glass sticky top-0 h-dvh max-w-[80vw] shrink-0 border-r border-divider/70 transition-[width] duration-300 ease-out ${
        collapsed ? "w-20" : "w-72"
      } flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-divider/70 min-h-[73px]">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 via-primary-500 to-secondary-500 flex items-center justify-center shadow-glow-primary transition-transform duration-300 group-hover:scale-105 motion-reduce:group-hover:scale-100">
              <span className="text-white font-bold text-lg leading-none">T</span>
              {/* Sheen: the highlight that makes a flat gradient read as glass. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/25 to-transparent"
              />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gradient">TechNest</h1>
          </Link>
        )}
        <Button
          isIconOnly
          variant="light"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={`ml-auto rounded-full transition-all duration-200 hover:bg-default-200/70 ${
            collapsed ? "" : "mr-1"
          }`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          const linkContent = (
            <Link
              key={item.label}
              href={item.href}
              aria-label={collapsed ? item.label : undefined}
              aria-current={active ? "page" : undefined}
              className={`
                group relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 overflow-hidden
                ${
                  active
                    ? "bg-gradient-to-r from-primary to-primary-700 text-white shadow-glow-primary"
                    : "text-default-600 hover:bg-default-200/60 hover:text-foreground"
                }
                ${item.isPremium && !active ? "hover:bg-warning/10 hover:text-warning" : ""}
              `}
            >
              {/* Active indicator */}
              {active && !collapsed && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/90 rounded-r-full" />
              )}

              {/* Icon */}
              <item.icon
                size={19}
                strokeWidth={active ? 2.2 : 1.9}
                className={`
                  flex-shrink-0 transition-transform duration-200
                  ${active ? "" : "group-hover:scale-110 motion-reduce:group-hover:scale-100"}
                  ${item.isPremium && !active ? "text-warning" : ""}
                `}
              />

              {/* Label */}
              {!collapsed && <span className="flex-1 truncate">{item.label}</span>}

              {/* Arrow indicator for active state */}
              {!collapsed && active && <ChevronRight size={16} className="opacity-70" />}
            </Link>
          );

          return collapsed ? (
            <Tooltip key={item.label} content={item.label} placement="right">
              {linkContent}
            </Tooltip>
          ) : (
            linkContent
          );
        })}
      </nav>

      {/* Settings Footer */}
      <div className="p-3 border-t border-divider/70">
        {collapsed ? (
          <Tooltip content="Settings" placement="right">
            <Link
              href="/settings"
              aria-label="Settings"
              className="flex items-center justify-center w-full min-h-[44px] rounded-xl text-default-600 transition-colors duration-200 hover:bg-default-200/60 hover:text-foreground"
            >
              <Settings size={20} aria-hidden="true" />
            </Link>
          </Tooltip>
        ) : (
          <Link
            href="/settings"
            className="flex items-center gap-3 w-full min-h-[44px] px-4 rounded-xl text-default-600 transition-colors duration-200 hover:bg-default-200/60 hover:text-foreground"
          >
            <Settings size={20} aria-hidden="true" />
            <span>Settings</span>
          </Link>
        )}
      </div>
    </aside>
  );
}
