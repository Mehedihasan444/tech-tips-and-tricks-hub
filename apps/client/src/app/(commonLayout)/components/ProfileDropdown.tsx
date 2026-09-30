"use client";
import { useUser } from "@/context/user.provider";
import { logout } from "@/services/AuthService";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
  User,
  Avatar,
  Chip,
} from "@nextui-org/react";
import { 
  CrownIcon, 
  SquareUser, 
  LayoutDashboard,
  FileText,
  Info,
  Mail,
  HelpCircle,
  LogOut,
  ChevronRight 
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function ProfileDropdown() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setIsLoading: userLoading } = useUser();

  const handleLogout = () => {
    logout();
    userLoading(true);
    router.push(`/login?redirect=${pathname}`);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <Dropdown
      showArrow
      radius="lg"
      classNames={{
        base: "before:bg-primary",
        content: "p-0 border-2 border-divider bg-background shadow-xl",
      }}
    >
      <DropdownTrigger>
        <Avatar
          as="button"
          color="primary"
          size="md"
          src={user?.profilePhoto}
          isBordered
          className="transition-transform hover:scale-105 cursor-pointer"
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile Actions"
        disabledKeys={["profile"]}
        className="p-3 w-[280px]"
        itemClasses={{
          base: [
            "rounded-lg",
            "text-default-600",
            "transition-all",
            "data-[hover=true]:text-foreground",
            "data-[hover=true]:bg-primary/10",
            "data-[hover=true]:scale-[0.98]",
            "data-[selectable=true]:focus:text-primary",
            "data-[pressed=true]:opacity-70",
            "data-[focus-visible=true]:ring-2",
            "data-[focus-visible=true]:ring-primary",
            "data-[focus-visible=true]:ring-offset-2",
            "data-[focus-visible=true]:ring-offset-background",
          ],
        }}
      >
        {/* User Profile Section */}
        <DropdownSection aria-label="Profile" showDivider>
          <DropdownItem
            isReadOnly
            key="profile"
            className="h-auto gap-2 opacity-100 pb-3"
          >
            <User
              name={
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{user?.name}</span>
                  {user?.role === "ADMIN" && (
                    <Chip size="sm" color="warning" variant="flat" className="text-xs">
                      Admin
                    </Chip>
                  )}
                </div>
              }
              description={
                <span className="text-xs text-default-500">{user?.email}</span>
              }
              classNames={{
                name: "text-sm",
                description: "text-xs",
              }}
              avatarProps={{
                size: "sm",
                src: user?.profilePhoto,
                isBordered: true,
                color: "primary",
              }}
            />
          </DropdownItem>
        </DropdownSection>

        {/* Navigation Section */}
        <DropdownSection aria-label="Navigation" showDivider>
          <DropdownItem
            key="my-profile"
            startContent={<SquareUser size={18} className="text-primary" />}
            endContent={<ChevronRight size={16} className="text-default-400" />}
            onClick={() => handleNavigation(`/profile/${user?.nickName}`)}
            className="py-3"
          >
            <span className="font-medium">My Profile</span>
          </DropdownItem>
          <DropdownItem
            key="dashboard"
            startContent={<LayoutDashboard size={18} className="text-secondary" />}
            endContent={<ChevronRight size={16} className="text-default-400" />}
            onClick={() =>
              handleNavigation(
                user?.role === "USER" ? "/dashboard" : "/admin-dashboard"
              )
            }
            className="py-3"
          >
            <span className="font-medium">Dashboard</span>
          </DropdownItem>
          <DropdownItem
            key="drafts"
            startContent={<FileText size={18} className="text-warning" />}
            endContent={<ChevronRight size={16} className="text-default-400" />}
            onClick={() => handleNavigation("/dashboard/drafts")}
            className="py-3"
          >
            <span className="font-medium">My Drafts</span>
          </DropdownItem>
        </DropdownSection>

        {/* Information Section */}
        <DropdownSection aria-label="Information" showDivider>
          <DropdownItem
            key="about-us"
            startContent={<Info size={18} className="text-default-500" />}
            onClick={() => handleNavigation(`/about-us`)}
            className="py-2"
          >
            About Us
          </DropdownItem>
          <DropdownItem
            key="contact-us"
            startContent={<Mail size={18} className="text-default-500" />}
            onClick={() => handleNavigation(`/contact-us`)}
            className="py-2"
          >
            Contact Us
          </DropdownItem>
        </DropdownSection>

        {/* Premium & Support Section */}
        <DropdownSection aria-label="Support">
          <DropdownItem
            key="get_subscription"
            startContent={<CrownIcon size={18} className="text-warning" />}
            endContent={
              <Chip size="sm" color="warning" variant="flat" className="text-xs">
                Premium
              </Chip>
            }
            onClick={() => handleNavigation(`/subscription`)}
            className="py-3 bg-warning/5"
          >
            <span className="font-medium text-warning">Get Subscription</span>
          </DropdownItem>
          <DropdownItem
            key="help_and_feedback"
            startContent={<HelpCircle size={18} className="text-default-500" />}
            onClick={() => handleNavigation(`/contact-us`)}
            className="py-2"
          >
            Help & Feedback
          </DropdownItem>
          <DropdownItem
            key="logout"
            className="text-danger py-3 mt-2"
            color="danger"
            variant="flat"
            startContent={<LogOut size={18} />}
            onClick={handleLogout}
          >
            <span className="font-semibold">Log Out</span>
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}