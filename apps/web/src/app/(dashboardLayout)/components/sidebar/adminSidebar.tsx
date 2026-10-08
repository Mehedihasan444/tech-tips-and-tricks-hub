"use client";

import {
  Activity,
  Banknote,
  BarChart3,
  CreditCard,
  FileClock,
  FileText,
  Flag,
  Home,
  Image,
  MessageSquare,
  Settings,
  Tags,
  UserRound,
  Wallet,
} from "lucide-react";
import { DashboardSidebar, SidebarSection } from "./DashboardSidebar";

const sections: SidebarSection[] = [
  {
    label: "Overview",
    entries: [{ title: "Dashboard", href: "/admin-dashboard", icon: <Home />, exact: true }],
  },
  {
    label: "Content",
    entries: [
      { title: "Manage Posts", href: "/admin-dashboard/posts-management", icon: <FileText /> },
      {
        title: "Manage Comments",
        href: "/admin-dashboard/comments-management",
        icon: <MessageSquare />,
      },
      { title: "Manage Stories", href: "/admin-dashboard/stories-management", icon: <Image /> },
      { title: "Categories & Tags", href: "/admin-dashboard/categories-tags", icon: <Tags /> },
    ],
  },
  {
    label: "People",
    entries: [
      { title: "Manage Users", href: "/admin-dashboard/users-management", icon: <UserRound /> },
    ],
  },
  {
    label: "Transactions",
    entries: [
      {
        title: "Transactions",
        icon: <Wallet />,
        children: [
          {
            title: "Author Transactions",
            href: "/admin-dashboard/author-transactions",
            icon: <Banknote />,
          },
          {
            title: "User Transactions",
            href: "/admin-dashboard/user-transactions",
            icon: <CreditCard />,
          },
        ],
      },
    ],
  },
  {
    label: "Moderation",
    entries: [
      { title: "Reports & Review", href: "/admin-dashboard/reports", icon: <Flag /> },
      { title: "Activity Logs", href: "/admin-dashboard/activity-logs", icon: <Activity /> },
    ],
  },
  {
    label: "Insights",
    entries: [{ title: "Analytics", href: "/admin-dashboard/analytics", icon: <BarChart3 /> }],
  },
  {
    label: "System",
    entries: [
      { title: "Changelog", href: "/admin-dashboard/changelog", icon: <FileClock /> },
      { title: "Platform Settings", href: "/admin-dashboard/settings", icon: <Settings /> },
    ],
  },
];

/** Admin sidebar — a thin config over the shared dashboard shell. */
export const AdminSidebarWrapper = () => (
  <DashboardSidebar caption="Admin Console" sections={sections} />
);
