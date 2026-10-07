"use client";

import React, { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import LiveChat from "./LiveChat";
import {
  Button,
  Avatar,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Divider,
  ScrollShadow,
  Spinner,
} from "@heroui/react";
import { MessageSquare, X, Users } from "lucide-react";
import { useSocket } from "@/context/socket.provider";
import { getSuggestedUsers } from "@/services/UserService";

interface ChatUser {
  _id: string;
  name: string;
  profilePhoto: string;
  nickName?: string;
}

// Context to manage chat state globally
import { createContext, useContext, ReactNode } from "react";

interface ChatManagerContextValue {
  openChat: (user: ChatUser) => void;
  closeChat: (userId: string) => void;
  activeChats: ChatUser[];
  toggleChatList: () => void;
  isChatListOpen: boolean;
}

const ChatManagerContext = createContext<ChatManagerContextValue | undefined>(undefined);

export function ChatManagerProvider({ children }: { children: ReactNode }) {
  const [activeChats, setActiveChats] = useState<ChatUser[]>([]);
  const [isChatListOpen, setIsChatListOpen] = useState(false);
  const [directory, setDirectory] = useState<Map<string, ChatUser>>(new Map());
  const [loadingDirectory, setLoadingDirectory] = useState(false);
  const { onlineUsers, isConnected } = useSocket();

  // Resolve real names/photos for online IDs so the popup never shows "User ab12".
  useEffect(() => {
    if (!isChatListOpen || onlineUsers.length === 0) return;
    const missing = onlineUsers.filter((id) => !directory.has(id));
    if (missing.length === 0) return;
    let cancelled = false;
    const fetchDirectory = async () => {
      try {
        setLoadingDirectory(true);
        const res = await getSuggestedUsers(20);
        const list = res?.data?.data ?? res?.data ?? [];
        if (cancelled || !Array.isArray(list)) return;
        setDirectory((prev) => {
          const next = new Map(prev);
          list.forEach((u: Record<string, unknown>) => {
            const id = String(u._id ?? "");
            if (!id) return;
            next.set(id, {
              _id: id,
              name: String(u.name ?? u.nickName ?? "Unknown"),
              profilePhoto: String(u.profilePhoto ?? ""),
              nickName: typeof u.nickName === "string" ? u.nickName : undefined,
            });
          });
          return next;
        });
      } catch {
        // keep placeholder names on failure
      } finally {
        if (!cancelled) setLoadingDirectory(false);
      }
    };
    void fetchDirectory();
    return () => {
      cancelled = true;
    };
  }, [isChatListOpen, onlineUsers, directory]);

  const openChat = useCallback((user: ChatUser) => {
    setActiveChats((prev) => {
      // Check if chat is already open
      if (prev.some((chat) => chat._id === user._id)) {
        return prev;
      }
      // Limit to 3 active chats
      const newChats = [...prev, user];
      return newChats.slice(-3);
    });
    setIsChatListOpen(false);
  }, []);

  const closeChat = useCallback((userId: string) => {
    setActiveChats((prev) => prev.filter((chat) => chat._id !== userId));
  }, []);

  const toggleChatList = useCallback(() => {
    setIsChatListOpen((prev) => !prev);
  }, []);

  return (
    <ChatManagerContext.Provider
      value={{ openChat, closeChat, activeChats, toggleChatList, isChatListOpen }}
    >
      {children}

      {/* Chat List Panel */}
      {isChatListOpen && (
        <Card className="fixed bottom-4 right-20 z-50 w-80 shadow-2xl">
          <CardHeader className="flex justify-between items-center pb-2">
            <div className="flex items-center gap-2">
              <Users size={18} />
              <h4 className="font-semibold">Messages</h4>
            </div>
            <div className="flex items-center gap-1">
              <Button size="sm" variant="flat" color="primary" as={Link} href="/messages">
                Open all
              </Button>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => setIsChatListOpen(false)}
                aria-label="Close chat list"
              >
                <X size={16} />
              </Button>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="p-0">
            <ScrollShadow className="max-h-96">
              {!isConnected ? (
                <div className="p-4 text-center text-default-500">
                  <p className="text-sm">Connecting to chat...</p>
                </div>
              ) : onlineUsers.length === 0 ? (
                <div className="p-4 text-center text-default-500">
                  <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No users online</p>
                  <p className="text-xs text-default-600 mt-1">Online users will appear here</p>
                </div>
              ) : (
                <div className="p-2">
                  <p className="text-xs text-default-500 px-2 mb-2">
                    {onlineUsers.length} user(s) online
                    {loadingDirectory ? " · loading names..." : ""}
                  </p>
                  {onlineUsers.map((userId) => {
                    const known = directory.get(userId);
                    const displayName = known?.name ?? `User ${userId.slice(-4)}`;
                    return (
                      <button
                        type="button"
                        key={userId}
                        className="w-full flex items-center gap-3 p-2 hover:bg-default-100 rounded-lg text-left transition-colors"
                        onClick={() =>
                          openChat({
                            _id: userId,
                            name: displayName,
                            profilePhoto: known?.profilePhoto ?? "",
                            nickName: known?.nickName,
                          })
                        }
                      >
                        <Badge content="" color="success" size="sm" placement="bottom-right">
                          {known?.profilePhoto ? (
                            <Avatar size="sm" src={known.profilePhoto} name={displayName} />
                          ) : (
                            <Avatar
                              size="sm"
                              name={(displayName?.trim() ? displayName : userId)
                                .slice(0, 2)
                                .toUpperCase()}
                              className="bg-primary text-white"
                            />
                          )}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{displayName}</p>
                          <p className="text-xs text-success">Online</p>
                        </div>
                      </button>
                    );
                  })}
                  {loadingDirectory && (
                    <div className="flex justify-center py-2">
                      <Spinner size="sm" />
                    </div>
                  )}
                </div>
              )}
            </ScrollShadow>
          </CardBody>
        </Card>
      )}

      {/* Render active chat windows */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-row-reverse gap-4">
        {activeChats.map((chat, index) => (
          <div
            key={chat._id}
            style={{
              transform: `translateX(-${index * 340}px)`,
            }}
          >
            <LiveChat recipient={chat} isOpen={true} onClose={() => closeChat(chat._id)} />
          </div>
        ))}
      </div>
    </ChatManagerContext.Provider>
  );
}

export function useChatManager() {
  const context = useContext(ChatManagerContext);
  if (!context) {
    // Return a safe default when used outside provider
    return {
      openChat: () => {},
      closeChat: () => {},
      activeChats: [],
      toggleChatList: () => {},
      isChatListOpen: false,
    };
  }
  return context;
}

export default ChatManagerProvider;
