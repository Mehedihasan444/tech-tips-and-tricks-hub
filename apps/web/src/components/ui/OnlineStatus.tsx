"use client";

import React from "react";
import { Badge, Tooltip } from "@nextui-org/react";
import { useSocket } from "@/context/socket.provider";

interface OnlineStatusProps {
  userId: string;
  children: React.ReactNode;
  showTooltip?: boolean;
}

export default function OnlineStatus({
  userId,
  children,
  showTooltip = true,
}: OnlineStatusProps) {
  const { onlineUsers } = useSocket();
  const isOnline = onlineUsers.includes(userId);

  const badge = (
    <Badge
      content=""
      color={isOnline ? "success" : "default"}
      size="sm"
      placement="bottom-right"
      shape="circle"
      className={isOnline ? "" : "opacity-50"}
    >
      {children}
    </Badge>
  );

  if (showTooltip) {
    return (
      <Tooltip content={isOnline ? "Online" : "Offline"} size="sm">
        {badge}
      </Tooltip>
    );
  }

  return badge;
}

// Small dot indicator
interface OnlineDotProps {
  userId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function OnlineDot({ userId, size = "sm", className = "" }: OnlineDotProps) {
  const { onlineUsers } = useSocket();
  const isOnline = onlineUsers.includes(userId);

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  if (!isOnline) return null;

  return (
    <Tooltip content="Online" size="sm">
      <span
        className={`${sizeClasses[size]} rounded-full bg-success animate-pulse ${className}`}
      />
    </Tooltip>
  );
}
