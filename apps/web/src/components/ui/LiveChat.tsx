"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  Avatar,
  Input,
  Badge,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
} from "lucide-react";
import { useSocket, ChatMessage } from "@/context/socket.provider";
import { useUser } from "@/context/user.provider";
import { formatDistanceToNow } from "date-fns";

interface ChatUser {
  _id: string;
  name: string;
  profilePhoto: string;
  nickName?: string;
}

interface LiveChatProps {
  recipient: ChatUser;
  isOpen: boolean;
  onClose: () => void;
}

export default function LiveChat({ recipient, isOpen, onClose }: LiveChatProps) {
  const { user } = useUser();
  const { socket, sendChatMessage, onlineUsers, isConnected } = useSocket();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isRecipientOnline = onlineUsers.includes(recipient._id);

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Load chat history and setup listeners
  useEffect(() => {
    if (!socket || !isOpen || !user) return;

    setIsLoading(true);

    // Request chat history
    socket.emit("get-chat-history", {
      senderId: user._id,
      receiverId: recipient._id,
    });

    // Listen for chat history
    const handleChatHistory = (history: ChatMessage[]) => {
      setMessages(history);
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    };

    // Listen for new messages
    const handleNewMessage = (message: ChatMessage) => {
      if (
        (message.senderId === recipient._id && message.receiverId === user._id) ||
        (message.senderId === user._id && message.receiverId === recipient._id)
      ) {
        // Only add if it's from the recipient (not our own message which was already added optimistically)
        // Or if it's our message from another device/tab
        setMessages((prev) => {
          // Check if message already exists (by id or by matching content+time for optimistic messages)
          const isDuplicate = prev.some(
            (m) => m.id === message.id || 
            (m.senderId === message.senderId && 
             m.message === message.message && 
             m.id.startsWith('temp-'))
          );
          
          if (isDuplicate) {
            // Replace temp message with real one
            return prev.map((m) => 
              (m.id.startsWith('temp-') && 
               m.senderId === message.senderId && 
               m.message === message.message) 
                ? message 
                : m
            );
          }
          
          return [...prev, message];
        });
        setTimeout(scrollToBottom, 100);
        
        // Mark as read if it's from the recipient
        if (message.senderId === recipient._id) {
          socket.emit("mark-message-read", message.id);
        }
      }
    };

    // Listen for typing indicator
    const handleTyping = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId === recipient._id) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on("chat-history", handleChatHistory);
    socket.on("chat-message", handleNewMessage);
    socket.on("user-typing-chat", handleTyping);

    return () => {
      socket.off("chat-history", handleChatHistory);
      socket.off("chat-message", handleNewMessage);
      socket.off("user-typing-chat", handleTyping);
    };
  }, [socket, isOpen, user, recipient._id, scrollToBottom]);

  // Handle sending message
  const handleSend = () => {
    if (!newMessage.trim() || !user) return;

    sendChatMessage(recipient._id, newMessage.trim());
    
    // Optimistically add message to UI
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      senderId: user._id,
      receiverId: recipient._id,
      message: newMessage.trim(),
      createdAt: new Date(),
      read: false,
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
    setTimeout(scrollToBottom, 100);

    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket?.emit("typing-chat-stop", { receiverId: recipient._id });
  };

  // Handle typing
  const handleTypingStart = () => {
    if (!socket) return;

    socket.emit("typing-chat-start", { receiverId: recipient._id });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing-chat-stop", { receiverId: recipient._id });
    }, 2000);
  };

  const formatTime = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Just now";
    }
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onPress={() => setIsMinimized(false)}
          color="primary"
          className="rounded-full shadow-lg"
          startContent={
            <Badge
              content=""
              color="success"
              size="sm"
              isInvisible={!isRecipientOnline}
              placement="bottom-right"
            >
              <Avatar src={recipient.profilePhoto} size="sm" />
            </Badge>
          }
        >
          {recipient.name}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-content1 rounded-xl shadow-2xl border border-divider overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-primary text-white">
        <div className="flex items-center gap-2">
          <Badge
            content=""
            color="success"
            size="sm"
            isInvisible={!isRecipientOnline}
            placement="bottom-right"
          >
            <Avatar src={recipient.profilePhoto} size="sm" />
          </Badge>
          <div>
            <p className="font-semibold text-sm">{recipient.name}</p>
            <p className="text-xs opacity-80">
              {isRecipientOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <Tooltip content="Minimize">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => setIsMinimized(true)}
              className="text-white"
              aria-label="Minimize chat"
            >
              <Minimize2 size={16} />
            </Button>
          </Tooltip>
          <Tooltip content="Close">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={onClose}
              className="text-white"
              aria-label="Close chat"
            >
              <X size={16} />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Messages */}
      <div className="h-72 overflow-y-auto p-3 space-y-3 bg-default-50">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner size="sm" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="text-default-300 mb-2" size={32} />
            <p className="text-sm text-default-500">No messages yet</p>
            <p className="text-xs text-default-400">Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => {
              const isMe = msg.senderId === user?._id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl ${
                      isMe
                        ? "bg-primary text-white rounded-br-sm"
                        : "bg-default-200 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm break-words">{msg.message}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        isMe ? "text-white/70" : "text-default-400"
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex items-center gap-2 text-default-400">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-default-400 rounded-full animate-bounce" />
                  <span
                    className="w-2 h-2 bg-default-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <span
                    className="w-2 h-2 bg-default-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
                <span className="text-xs">{recipient.name} is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-divider">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            size="sm"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTypingStart();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            classNames={{
              inputWrapper: "bg-default-100",
            }}
          />
          <Button
            isIconOnly
            color="primary"
            size="sm"
            type="submit"
            isDisabled={!newMessage.trim() || !isConnected}
            aria-label="Send message"
          >
            <Send size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
}

// Mini chat button to open chat
interface ChatButtonProps {
  user: ChatUser;
  onOpenChat: (user: ChatUser) => void;
}

export function ChatButton({ user: chatUser, onOpenChat }: ChatButtonProps) {
  const { onlineUsers } = useSocket();
  const isOnline = onlineUsers.includes(chatUser._id);

  return (
    <Tooltip content={`Chat with ${chatUser.name}`}>
      <Button
        isIconOnly
        variant="flat"
        size="sm"
        onPress={() => onOpenChat(chatUser)}
        aria-label={`Chat with ${chatUser.name}`}
      >
        <Badge
          content=""
          color="success"
          size="sm"
          isInvisible={!isOnline}
          placement="bottom-right"
        >
          <MessageCircle size={18} />
        </Badge>
      </Button>
    </Tooltip>
  );
}
