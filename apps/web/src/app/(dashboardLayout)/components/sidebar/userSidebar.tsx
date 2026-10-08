"use client";

import {
  BarChart3,
  DollarSign,
  FileText,
  FolderOpen,
  Home,
  ListChecks,
  PenSquare,
  Settings2,
  Users,
} from "lucide-react";
import { DashboardSidebar, SidebarSection } from "./DashboardSidebar";

const sections: SidebarSection[] = [
  {
    label: "Overview",
    entries: [{ title: "Dashboard Home", href: "/dashboard", icon: <Home />, exact: true }],
  },
  {
    label: "Posts",
    entries: [
      { title: "My Posts", href: "/dashboard/my-posts", icon: <FileText /> },
      { title: "Drafts", href: "/dashboard/drafts", icon: <FolderOpen /> },
      {
        title: "Post Management",
        icon: <Settings2 />,
        children: [
          { title: "Create Post", href: "/dashboard/create-post", icon: <PenSquare /> },
          { title: "Manage Posts", href: "/dashboard/manage-posts", icon: <ListChecks /> },
        ],
      },
    ],
  },
  {
    label: "Insights",
    entries: [
      { title: "Analytics", href: "/dashboard/analytics", icon: <BarChart3 /> },
      { title: "Following Activity", href: "/dashboard/following-activity", icon: <Users /> },
    ],
  },
  {
    label: "Billing",
    entries: [{ title: "Payments", href: "/dashboard/payments", icon: <DollarSign /> }],
  },
];

/** Creator sidebar — a thin config over the shared dashboard shell. */
export const SidebarWrapper = () => (
  <DashboardSidebar caption="Creator Studio" sections={sections} />
);
