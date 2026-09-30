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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarContext } from "../../layout/layout-context";

export const AdminSidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed } = useSidebarContext();

  return (
    <aside className="h-screen z-[20] sticky top-0">
      {collapsed ? <div className={Sidebar.Overlay()} /> : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
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
            <SidebarMenu title="Management">
              <SidebarItem
                isActive={pathname === "/admin-dashboard/posts-management"}
                title="Manage Posts"
                icon={<FileText />}
                href="/admin-dashboard/posts-management"
              />
              <SidebarItem
                isActive={pathname === "/admin-dashboard/users-management"}
                title="Manage Users"
                icon={<User />}
                href="/admin-dashboard/users-management"
              />
              <CollapseItems
                icon={<Banknote />}
                title="Transactions"
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

            <SidebarMenu title="Monitoring">
              <SidebarItem
                isActive={pathname === "/admin-dashboard/reports"}
                title="Reports"
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

            <SidebarMenu title="System">
              <SidebarItem
                isActive={pathname === "/admin-dashboard/changelog"}
                title="Changelog"
                icon={<FileClock />}
                href="/admin-dashboard/changelog"
              />
            </SidebarMenu>
          </div>
          {/* <div className={Sidebar.Footer()}>
            <Tooltip content={"Settings"} color="primary">
              <div className="max-w-fit">
                <Home />
              </div>
            </Tooltip>
            
            <Tooltip content={"Profile"} color="primary">
              <Avatar
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                size="sm"
              />
            </Tooltip>
          </div> */}
        </div>
      </div>
    </aside>
  );
};
