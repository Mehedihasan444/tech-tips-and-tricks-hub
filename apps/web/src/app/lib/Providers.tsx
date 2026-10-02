"use client";
import * as React from "react";

// 1. import `HeroUIProvider` component
import { HeroUIProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserProvider from "@/context/user.provider";
import { SocketProvider } from "@/context/socket.provider";
import { ChatManagerProvider } from "@/components/ui/ChatManager";
import { Toaster } from "sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";
const queryClient = new QueryClient();
export function Providers({ children }: { children: React.ReactNode }) {
  // 2. Wrap HeroUIProvider at the root of your app
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <SocketProvider>
          <ChatManagerProvider>
            <HeroUIProvider>
              <NextThemesProvider attribute="class" defaultTheme="dark">
                <Toaster />
                {children}
              </NextThemesProvider>
            </HeroUIProvider>
          </ChatManagerProvider>
        </SocketProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
