"use client";

import Link from "next/link";
import { Button, Navbar, NavbarContent, NavbarItem, Badge } from "@heroui/react";
import Searchbar from "../Searchbar";
import ProfileDropdown from "../ProfileDropdown";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Compass, MessageSquareText } from "lucide-react";
import NotificationsDropdown from "@/components/ui/NotificationsDropdown";
import { useSocket } from "@/context/socket.provider";

export default function NavigationBar() {
  const { isConnected } = useSocket();

  return (
    <Navbar
      maxWidth="full"
      className="glass sticky top-0 z-40 border-b border-divider/70 py-2"
      position="sticky"
    >
      <NavbarContent className="hidden sm:flex gap-4 w-full flex-1" justify="center">
        {/* Search bar - now takes more space */}
        <div className="w-full max-w-2xl">
          <Searchbar />
        </div>
      </NavbarContent>

      <NavbarContent justify="end" className="gap-1.5">
        {/* Explore */}
        <NavbarItem className="hidden md:block">
          <Button
            as={Link}
            href="/explore"
            isIconOnly
            variant="light"
            radius="full"
            className="text-default-600 transition-all duration-200 hover:bg-default-200/60 hover:text-foreground active:scale-95"
            aria-label="Explore"
          >
            <Compass size={20} />
          </Button>
        </NavbarItem>

        {/* Theme Switcher */}
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>

        {/* Real-time Notifications */}
        <NavbarItem>
          <NotificationsDropdown />
        </NavbarItem>

        {/* Messages - full-page chat */}
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
              as={Link}
              href="/messages"
              isIconOnly
              variant="light"
              radius="full"
              className="text-default-600 transition-all duration-200 hover:bg-default-200/60 hover:text-foreground active:scale-95"
              aria-label="Messages"
            >
              <MessageSquareText size={20} />
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
