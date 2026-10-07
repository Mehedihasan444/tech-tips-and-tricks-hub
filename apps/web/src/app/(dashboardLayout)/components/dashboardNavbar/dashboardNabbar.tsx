"use client";

import ProfileDropdown from "@/app/(commonLayout)/components/ProfileDropdown";
import { ThemeSwitcher } from "@/app/(commonLayout)/components/shared/ThemeSwitcher";
import NotificationsDropdown from "@/components/ui/NotificationsDropdown";
import { useChatManager } from "@/components/ui/ChatManager";
import { useSocket } from "@/context/socket.provider";
import { Badge, Button, Tooltip } from "@heroui/react";
import { MessageSquareText, Home, Menu } from "lucide-react";
import Link from "next/link";
import React, { ReactNode } from "react";
import { useSidebarContext } from "../../layout/layout-context";

const NavbarWrapper = ({ children }: { children: ReactNode }) => {
  const { toggleChatList } = useChatManager();
  const { isConnected } = useSocket();
  const { isOpen, toggleSidebar } = useSidebarContext();

  return (
    <div className="w-full ">
      <div className="p-5 flex justify-between items-center shadow">
        <div className="flex-1 flex items-center gap-4">
          {/* Mobile drawer toggle — the sidebar is off-canvas below md */}
          <Button
            isIconOnly
            variant="light"
            radius="full"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="dashboard-sidebar"
            onPress={toggleSidebar}
            className="md:hidden"
          >
            <Menu size={20} className="text-default-600" />
          </Button>
          <ThemeSwitcher />
          <Tooltip content="Back to Home" color="primary">
            <Link href="/">
              <Button isIconOnly variant="light" radius="full" aria-label="Go to home">
                <Home size={20} className="text-default-600" />
              </Button>
            </Link>
          </Tooltip>
        </div>
        <div className="flex-1 flex gap-4 items-center justify-end">
          {/* Real-time Notifications */}
          <NotificationsDropdown />

          {/* Messages */}
          <Tooltip content={isConnected ? "Messages" : "Messages (offline)"} color="primary">
            <Badge
              content=""
              color="primary"
              size="sm"
              placement="top-right"
              className="border-2 border-background"
              isInvisible={!isConnected}
              isDot
            >
              <Button
                isIconOnly
                variant="light"
                radius="full"
                className="hover:bg-default-100 transition-colors"
                aria-label="Messages"
                onPress={toggleChatList}
              >
                <MessageSquareText size={20} className="text-default-600" />
              </Button>
            </Badge>
          </Tooltip>

          <Tooltip content={"Profile"} color="primary">
            <div className="max-w-fit">
              <ProfileDropdown />
            </div>
          </Tooltip>
        </div>
      </div>

      <div className="">{children}</div>
    </div>
  );
};

export default NavbarWrapper;
