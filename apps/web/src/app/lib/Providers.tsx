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

export function Providers({ children }: { children: React.ReactNode }) {
  // Created per Providers mount (not module scope) so server prerenders never
  // share a query cache across requests.
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );
  // 2. Wrap HeroUIProvider at the root of your app
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <SocketProvider>
          <ChatManagerProvider>
            <HeroUIProvider>
              <NextThemesProvider
                attribute="class"
                defaultTheme="dark"
                storageKey="tech-tips-theme"
                disableTransitionOnChange
              >
                <Toaster richColors position="top-center" closeButton />
                {children}
              </NextThemesProvider>
            </HeroUIProvider>
          </ChatManagerProvider>
        </SocketProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}
