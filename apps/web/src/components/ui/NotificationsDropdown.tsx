"use client";

import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Badge,
  Avatar,
  ScrollShadow,
} from "@heroui/react";
import { Bell, Heart, MessageCircle, UserPlus, AtSign, Reply, Check, Trash2 } from "lucide-react";
import { useSocket, Notification } from "@/context/socket.provider";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "like":
      return <Heart className="text-danger" size={14} />;
    case "comment":
      return <MessageCircle className="text-primary-fg" size={14} />;
    case "follow":
      return <UserPlus className="text-success" size={14} />;
    case "mention":
      return <AtSign className="text-warning" size={14} />;
    case "reply":
      return <Reply className="text-secondary-fg" size={14} />;
    default:
      return <Bell size={14} />;
  }
};

const getNotificationBg = (type: Notification["type"]) => {
  switch (type) {
    case "like":
      return "bg-danger-50 dark:bg-danger-500/20";
    case "comment":
      return "bg-primary-50 dark:bg-primary-500/20";
    case "follow":
      return "bg-success-50 dark:bg-success-500/20";
    case "mention":
      return "bg-warning-50 dark:bg-warning-500/20";
    case "reply":
      return "bg-secondary-50 dark:bg-secondary-500/20";
    default:
      return "bg-default-50 dark:bg-default-500/20";
  }
};

export default function NotificationsDropdown() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    isConnected,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
  } = useSocket();

  const handleNotificationClick = (notification: Notification) => {
    markNotificationAsRead(notification.id);

    if (notification.postId) {
      router.push(`/posts/${notification.postId}`);
    } else if (notification.type === "follow" && notification.fromUser) {
      router.push(`/profile/${notification.fromUser._id}`);
    }
  };

  const formatTime = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return "Just now";
    }
  };

  return (
    <Popover placement="bottom-end" showArrow offset={10}>
      <PopoverTrigger>
        <Button isIconOnly variant="light" className="relative" aria-label="Notifications">
          <Badge
            content={unreadCount > 0 ? unreadCount : ""}
            color="danger"
            size="sm"
            isInvisible={unreadCount === 0}
            shape="circle"
          >
            <Bell size={22} />
          </Badge>
          <span
            role="status"
            aria-label={isConnected ? "Connected" : "Disconnected"}
            className={`absolute bottom-1 right-1 w-2 h-2 rounded-full ${
              isConnected ? "bg-success" : "bg-danger"
            }`}
          />
          <span className="sr-only" aria-live="polite">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}`
              : "No unread notifications"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-divider">
            <h3 className="text-lg font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="light"
                color="primary"
                startContent={<Check size={14} />}
                onPress={markAllNotificationsAsRead}
              >
                Mark all read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <ScrollShadow className="max-h-[60vh]">
            {notifications.length === 0 ? (
              <div className="text-center py-12 px-4">
                <Bell className="mx-auto text-default-300 mb-3" size={40} />
                <p className="text-default-500">No notifications yet</p>
                <p className="text-sm text-default-600 mt-1">
                  We&apos;ll notify you when something happens
                </p>
              </div>
            ) : (
              <div className="divide-y divide-divider">
                {notifications.slice(0, 15).map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full p-3 text-left hover:bg-default-100 transition-colors flex items-start gap-3 focus-visible:outline-2 focus-visible:outline-primary ${
                      !notification.read ? "bg-primary-50/30 dark:bg-primary-500/10" : ""
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar
                        src={notification.fromUser?.profilePhoto}
                        name={notification.fromUser?.name}
                        size="sm"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 p-0.5 rounded-full ${getNotificationBg(
                          notification.type,
                        )}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold">{notification.fromUser?.name}</span>{" "}
                        {notification.message}
                      </p>
                      <p className="text-xs text-default-600 mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                    )}
                  </button>
                ))}
                {notifications.length > 15 && (
                  <p className="px-3 py-2 text-xs text-default-600 border-t border-divider">
                    Showing the 15 most recent of {notifications.length} notifications.
                  </p>
                )}
              </div>
            )}
          </ScrollShadow>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-end p-3 border-t border-divider">
              <Button
                size="sm"
                variant="light"
                color="danger"
                startContent={<Trash2 size={14} />}
                onPress={clearNotifications}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
