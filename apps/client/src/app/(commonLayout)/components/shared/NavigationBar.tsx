"use client";

import {
  Button,
  Navbar,
  NavbarContent,
  NavbarItem,
  Badge,
} from "@nextui-org/react";
import Searchbar from "../Searchbar";
import ProfileDropdown from "../ProfileDropdown";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { MessageSquareText } from "lucide-react";
import NotificationsDropdown from "@/components/ui/NotificationsDropdown";
import { useChatManager } from "@/components/ui/ChatManager";
import { useSocket } from "@/context/socket.provider";

export default function NavigationBar() {
  const { toggleChatList } = useChatManager();
  const { isConnected } = useSocket();

  return (
    <Navbar 
      maxWidth="full"
      className="border-b border-divider backdrop-blur-md bg-background/70 py-2" 
      position="sticky"
      isBordered
    >
      <NavbarContent className="hidden sm:flex gap-4 w-full flex-1" justify="center">
        {/* Search bar - now takes more space */}
        <div className="w-full max-w-2xl">
          <Searchbar />
        </div>
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        {/* Theme Switcher */}
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>

        {/* Real-time Notifications */}
        <NavbarItem>
          <NotificationsDropdown />
        </NavbarItem>

        {/* Messages - Opens Chat Manager */}
        <NavbarItem>
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
        </NavbarItem>

        {/* Profile Dropdown */}
        <NavbarItem>
          <ProfileDropdown />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}