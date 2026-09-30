"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "./user.provider";
import envConfig from "@/config/envConfig";

// Socket event types
export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "mention" | "reply";
  message: string;
  fromUser: {
    _id: string;
    name: string;
    profilePhoto: string;
  };
  postId?: string;
  commentId?: string;
  createdAt: Date;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  postId?: string;
  isTyping: boolean;
}

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  notifications: Notification[];
  unreadCount: number;
  onlineUsers: string[];
  typingUsers: Map<string, TypingIndicator>;
  
  // Notification actions
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  
  // Chat actions
  sendChatMessage: (receiverId: string, message: string) => void;
  
  // Typing indicator
  startTyping: (postId?: string) => void;
  stopTyping: (postId?: string) => void;
  
  // Story views
  viewStory: (storyId: string) => void;
  
  // Room management
  joinPostRoom: (postId: string) => void;
  leavePostRoom: (postId: string) => void;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

// Get base URL for socket connection
const getSocketUrl = () => {
  return envConfig.serverUrl || "http://localhost:5000";
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<Map<string, TypingIndicator>>(
    new Map()
  );

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Initialize socket connection
  useEffect(() => {
    if (!user?._id) {
      return;
    }

    const socketInstance = io(getSocketUrl(), {
      auth: {
        userId: user._id,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection events
    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setIsConnected(true);
      
      // Join user's personal room for notifications
      socketInstance.emit("join-user-room", user._id);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    // Notification events
    socketInstance.on("notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 50)); // Keep last 50
    });

    socketInstance.on("notifications-history", (history: Notification[]) => {
      setNotifications(history);
    });

    // Online users
    socketInstance.on("online-users", (users: string[]) => {
      setOnlineUsers(users);
    });

    socketInstance.on("user-online", (userId: string) => {
      setOnlineUsers((prev) => [...new Set([...prev, userId])]);
    });

    socketInstance.on("user-offline", (userId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    });

    // Typing indicators
    socketInstance.on("user-typing", (data: TypingIndicator) => {
      setTypingUsers((prev) => {
        const newMap = new Map(prev);
        if (data.isTyping) {
          newMap.set(data.userId, data);
        } else {
          newMap.delete(data.userId);
        }
        return newMap;
      });
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [user?._id]);

  // Notification actions
  const markNotificationAsRead = useCallback(
    (notificationId: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
      socket?.emit("mark-notification-read", notificationId);
    },
    [socket]
  );

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    socket?.emit("mark-all-notifications-read");
  }, [socket]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    socket?.emit("clear-notifications");
  }, [socket]);

  // Chat actions
  const sendChatMessage = useCallback(
    (receiverId: string, message: string) => {
      if (!socket || !user) return;

      const chatMessage: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        senderId: user._id,
        receiverId,
        message,
        createdAt: new Date(),
        read: false,
      };

      socket.emit("chat-message", chatMessage);
    },
    [socket, user]
  );

  // Typing indicator
  const startTyping = useCallback(
    (postId?: string) => {
      if (!socket || !user) return;
      socket.emit("typing-start", { userId: user._id, userName: user.name, postId });
    },
    [socket, user]
  );

  const stopTyping = useCallback(
    (postId?: string) => {
      if (!socket || !user) return;
      socket.emit("typing-stop", { userId: user._id, postId });
    },
    [socket, user]
  );

  // Story views
  const viewStory = useCallback(
    (storyId: string) => {
      if (!socket || !user) return;
      socket.emit("view-story", { storyId, userId: user._id });
    },
    [socket, user]
  );

  // Room management for posts
  const joinPostRoom = useCallback(
    (postId: string) => {
      if (!socket) return;
      socket.emit("join-post-room", postId);
    },
    [socket]
  );

  const leavePostRoom = useCallback(
    (postId: string) => {
      if (!socket) return;
      socket.emit("leave-post-room", postId);
    },
    [socket]
  );

  const value: SocketContextValue = {
    socket,
    isConnected,
    notifications,
    unreadCount,
    onlineUsers,
    typingUsers,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    sendChatMessage,
    startTyping,
    stopTyping,
    viewStory,
    joinPostRoom,
    leavePostRoom,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    // Return safe defaults when used outside provider (e.g., during SSR)
    return {
      socket: null,
      isConnected: false,
      notifications: [],
      unreadCount: 0,
      onlineUsers: [],
      typingUsers: new Map(),
      markNotificationAsRead: () => {},
      markAllNotificationsAsRead: () => {},
      clearNotifications: () => {},
      sendChatMessage: () => {},
      startTyping: () => {},
      stopTyping: () => {},
      viewStory: () => {},
      joinPostRoom: () => {},
      leavePostRoom: () => {},
    } as SocketContextValue;
  }
  return context;
};

export default SocketProvider;
