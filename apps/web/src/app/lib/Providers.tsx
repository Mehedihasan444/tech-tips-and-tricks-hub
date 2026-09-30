"use client";
import * as React from "react";

// 1. import `NextUIProvider` component
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserProvider from "@/context/user.provider";
import { SocketProvider } from "@/context/socket.provider";
import { ChatManagerProvider } from "@/components/ui/ChatManager";
import { Toaster } from "sonner";
import { ThemeProvider as NextThemesProvider } from "next-themes";
const queryClient = new QueryClient();
export function Providers({ children }: { children: React.ReactNode }) {
  // 2. Wrap NextUIProvider at the root of your app
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <SocketProvider>
          <ChatManagerProvider>
            <NextUIProvider>
              <NextThemesProvider attribute="class" defaultTheme="dark">
                <Toaster />
                {children}
              </NextThemesProvider>
            </NextUIProvider>
          </ChatManagerProvider>
        </SocketProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
