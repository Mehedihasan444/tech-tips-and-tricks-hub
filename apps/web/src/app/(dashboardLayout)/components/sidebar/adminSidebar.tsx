"use client";

import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { Sidebar } from "./sidebar.styles";
import {
  BackpackIcon,
  Banknote,
  CreditCardIcon,
  FileClock,
  FileText,
  Home,
  User,
  Activity,
  Flag,
  MessageSquare,
  Image,
  Tags,
  Settings,
  BarChart2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarContext } from "../../layout/layout-context";

export const AdminSidebarWrapper = () => {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebarContext();

  return (
    <aside id="dashboard-sidebar" className="h-screen z-[20] sticky top-0">
      {isOpen ? (
        <div className={Sidebar.Overlay()} onClick={() => setIsOpen(false)} aria-hidden="true" />
      ) : null}
      <div
        className={Sidebar({
          isOpen,
        })}
      >
        <div className={Sidebar.Header()}>
          {" "}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TechNest
            </h1>
          </Link>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Dashboard"
              icon={<Home />}
              isActive={pathname === "/admin-dashboard"}
              href="/admin-dashboard"
            />
            <SidebarMenu title="Content Management">
              <SidebarItem
                isActive={pathname === "/admin-dashboard/posts-management"}
                title="Manage Posts"
                icon={<FileText />}
                href="/admin-dashboard/posts-management"
              />
              <SidebarItem
                isActive={pathname === "/admin-dashboard/comments-management"}
                title="Manage Comments"
                icon={<MessageSquare />}
                href="/admin-dashboard/comments-management"
              />
              <SidebarItem
                isActive={pathname === "/admin-dashboard/stories-management"}
                title="Manage Stories"
                icon={<Image />}
                href="/admin-dashboard/stories-management"
              />
              <SidebarItem
                isActive={pathname === "/admin-dashboard/categories-tags"}
                title="Categories & Tags"
                icon={<Tags />}
                href="/admin-dashboard/categories-tags"
              />
            </SidebarMenu>

            <SidebarMenu title="User Management">
              <SidebarItem
                isActive={pathname === "/admin-dashboard/users-management"}
                title="Manage Users"
                icon={<User />}
                href="/admin-dashboard/users-management"
              />
            </SidebarMenu>

            <SidebarMenu title="Transactions">
              <CollapseItems
                icon={<Banknote />}
                title="Transactions"
                pathname={pathname}
                items={[
                  {
                    title: "Author Transactions",
                    icon: <BackpackIcon />,
                    href: "/admin-dashboard/author-transactions",
                  },
                  {
                    title: "User Transactions",
                    icon: <CreditCardIcon />,
                    href: "/admin-dashboard/user-transactions",
                  },
                ]}
              />
            </SidebarMenu>

            <SidebarMenu title="Moderation & Safety">
              <SidebarItem
                isActive={pathname === "/admin-dashboard/reports"}
                title="Reports & Review Queue"
                icon={<Flag />}
                href="/admin-dashboard/reports"
              />
              <SidebarItem
                isActive={pathname === "/admin-dashboard/activity-logs"}
                title="Activity Logs"
                icon={<Activity />}
                href="/admin-dashboard/activity-logs"
              />
            </SidebarMenu>

            <SidebarMenu title="Analytics & Insights">
              <SidebarItem
                isActive={pathname === "/admin-dashboard/analytics"}
                title="Analytics Dashboard"
                icon={<BarChart2 />}
                href="/admin-dashboard/analytics"
              />
            </SidebarMenu>

            <SidebarMenu title="System">
              <SidebarItem
                isActive={pathname === "/admin-dashboard/changelog"}
                title="Changelog"
                icon={<FileClock />}
                href="/admin-dashboard/changelog"
              />
              <SidebarItem
                isActive={pathname === "/admin-dashboard/settings"}
                title="Platform Settings"
                icon={<Settings />}
                href="/admin-dashboard/settings"
              />
            </SidebarMenu>
          </div>
        </div>
      </div>
    </aside>
  );
};
