import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";

// Types
interface OnlineUser {
  odId: string;
  socketId: string;
  userId: string;
  userName: string;
}

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "mention" | "reply";
  message: string;
  fromUser: {
    _id: string;
    name: string;
    profilePhoto: string;
  };
  toUserId: string;
  postId?: string;
  commentId?: string;
  createdAt: Date;
  read: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: Date;
  read: boolean;
}

interface TypingData {
  userId: string;
  userName: string;
  postId?: string;
  isTyping: boolean;
}

interface StoryView {
  storyId: string;
  viewerId: string;
  viewerName: string;
  viewerPhoto: string;
  viewedAt: Date;
}

// In-memory stores (in production, use Redis)
const onlineUsers = new Map<string, OnlineUser>();
const userNotifications = new Map<string, Notification[]>();
const chatHistory = new Map<string, ChatMessage[]>();
const storyViews = new Map<string, StoryView[]>();
const typingUsers = new Map<string, TypingData>();

let io: Server;

export const initializeSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:3000",
        "https://tech-tips-hub.vercel.app",
        process.env.CLIENT_URL || "*",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.handshake.auth.userId;
    console.log(`User connected: ${userId} (Socket: ${socket.id})`);

    // Handle user joining their room
    socket.on("join-user-room", (userIdRoom: string) => {
      socket.join(`user:${userIdRoom}`);
      
      // Add to online users
      onlineUsers.set(userIdRoom, {
        odId: userIdRoom,
        socketId: socket.id,
        userId: userIdRoom,
        userName: "", // Will be set when we have user data
      });

      // Broadcast updated online users list
      const onlineUserIds = Array.from(onlineUsers.keys());
      io.emit("online-users", onlineUserIds);
      io.emit("user-online", userIdRoom);

      // Send notification history to user
      const notifications = userNotifications.get(userIdRoom) || [];
      socket.emit("notifications-history", notifications);
    });

    // Handle joining a post room (for real-time comments/typing)
    socket.on("join-post-room", (postId: string) => {
      socket.join(`post:${postId}`);
    });

    socket.on("leave-post-room", (postId: string) => {
      socket.leave(`post:${postId}`);
    });

    // Handle typing indicators for comments
    socket.on("typing-start", (data: { userId: string; userName: string; postId?: string }) => {
      const typingData: TypingData = { ...data, isTyping: true };
      typingUsers.set(data.userId, typingData);
      
      if (data.postId) {
        socket.to(`post:${data.postId}`).emit("user-typing", typingData);
      }
    });

    socket.on("typing-stop", (data: { userId: string; postId?: string }) => {
      typingUsers.delete(data.userId);
      
      const typingData: TypingData = {
        userId: data.userId,
        userName: "",
        postId: data.postId,
        isTyping: false,
      };
      
      if (data.postId) {
        socket.to(`post:${data.postId}`).emit("user-typing", typingData);
      }
    });

    // Handle chat messages
    socket.on("chat-message", (message: ChatMessage) => {
      // Store message in history
      const chatKey = getChatKey(message.senderId, message.receiverId);
      const history = chatHistory.get(chatKey) || [];
      history.push(message);
      chatHistory.set(chatKey, history.slice(-100)); // Keep last 100 messages

      // Send to receiver
      io.to(`user:${message.receiverId}`).emit("chat-message", message);
    });

    socket.on("get-chat-history", (data: { senderId: string; receiverId: string }) => {
      const chatKey = getChatKey(data.senderId, data.receiverId);
      const history = chatHistory.get(chatKey) || [];
      socket.emit("chat-history", history);
    });

    socket.on("mark-message-read", (messageId: string) => {
      // In production, update database
      console.log(`Message ${messageId} marked as read`);
    });

    // Handle chat typing
    socket.on("typing-chat-start", (data: { receiverId: string }) => {
      io.to(`user:${data.receiverId}`).emit("user-typing-chat", {
        odId: userId,
        isTyping: true,
      });
    });

    socket.on("typing-chat-stop", (data: { receiverId: string }) => {
      io.to(`user:${data.receiverId}`).emit("user-typing-chat", {
        userId,
        isTyping: false,
      });
    });

    // Handle story views
    socket.on("view-story", (data: { storyId: string; userId: string }) => {
      const views = storyViews.get(data.storyId) || [];
      
      // Check if user already viewed
      const alreadyViewed = views.some((v) => v.viewerId === data.userId);
      if (!alreadyViewed) {
        const newView: StoryView = {
          storyId: data.storyId,
          viewerId: data.userId,
          viewerName: "", // Would be fetched from DB
          viewerPhoto: "",
          viewedAt: new Date(),
        };
        views.push(newView);
        storyViews.set(data.storyId, views);

        // Notify story owner about new view
        io.emit("story-view-update", {
          storyId: data.storyId,
          viewCount: views.length,
          newViewer: newView,
        });
      }
    });

    socket.on("get-story-views", (storyId: string) => {
      const views = storyViews.get(storyId) || [];
      socket.emit("story-views-response", {
        storyId,
        viewCount: views.length,
        viewers: views,
      });
    });

    // Handle notification actions
    socket.on("mark-notification-read", (notificationId: string) => {
      const notifications = userNotifications.get(userId) || [];
      const updated = notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      userNotifications.set(userId, updated);
    });

    socket.on("mark-all-notifications-read", () => {
      const notifications = userNotifications.get(userId) || [];
      const updated = notifications.map((n) => ({ ...n, read: true }));
      userNotifications.set(userId, updated);
    });

    socket.on("clear-notifications", () => {
      userNotifications.delete(userId);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId} (Socket: ${socket.id})`);
      
      // Remove from online users
      onlineUsers.delete(userId);
      typingUsers.delete(userId);

      // Broadcast updated online users list
      const onlineUserIds = Array.from(onlineUsers.keys());
      io.emit("online-users", onlineUserIds);
      io.emit("user-offline", userId);
    });
  });

  return io;
};

// Helper to get consistent chat key
const getChatKey = (user1: string, user2: string): string => {
  return [user1, user2].sort().join("-");
};

// Function to send notification to a user
export const sendNotification = (notification: Notification): void => {
  if (!io) return;

  // Store notification
  const notifications = userNotifications.get(notification.toUserId) || [];
  notifications.unshift(notification);
  userNotifications.set(notification.toUserId, notifications.slice(0, 50)); // Keep last 50

  // Send to user if online
  io.to(`user:${notification.toUserId}`).emit("notification", notification);
};

// Function to send notification for likes
export const sendLikeNotification = (
  fromUser: { _id: string; name: string; profilePhoto: string },
  toUserId: string,
  postId: string
): void => {
  if (fromUser._id === toUserId) return; // Don't notify self

  const notification: Notification = {
    id: `like-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: "like",
    message: "liked your post",
    fromUser,
    toUserId,
    postId,
    createdAt: new Date(),
    read: false,
  };

  sendNotification(notification);
};

// Function to send notification for comments
export const sendCommentNotification = (
  fromUser: { _id: string; name: string; profilePhoto: string },
  toUserId: string,
  postId: string,
  commentId: string
): void => {
  if (fromUser._id === toUserId) return;

  const notification: Notification = {
    id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: "comment",
    message: "commented on your post",
    fromUser,
    toUserId,
    postId,
    commentId,
    createdAt: new Date(),
    read: false,
  };

  sendNotification(notification);
};

// Function to send notification for follows
export const sendFollowNotification = (
  fromUser: { _id: string; name: string; profilePhoto: string },
  toUserId: string
): void => {
  if (fromUser._id === toUserId) return;

  const notification: Notification = {
    id: `follow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: "follow",
    message: "started following you",
    fromUser,
    toUserId,
    createdAt: new Date(),
    read: false,
  };

  sendNotification(notification);
};

// Function to send notification for replies
export const sendReplyNotification = (
  fromUser: { _id: string; name: string; profilePhoto: string },
  toUserId: string,
  postId: string,
  commentId: string
): void => {
  if (fromUser._id === toUserId) return;

  const notification: Notification = {
    id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: "reply",
    message: "replied to your comment",
    fromUser,
    toUserId,
    postId,
    commentId,
    createdAt: new Date(),
    read: false,
  };

  sendNotification(notification);
};

// Function to get online users
export const getOnlineUsers = (): string[] => {
  return Array.from(onlineUsers.keys());
};

// Function to check if user is online
export const isUserOnline = (userId: string): boolean => {
  return onlineUsers.has(userId);
};

// Export io instance for use in other modules
export const getIO = (): Server => io;

export default { initializeSocket, sendNotification, getIO };
