"use client";
import React from "react";
import { Button } from "@nextui-org/react";
import { 
  FileText, 
  Search, 
  Users, 
  MessageCircle, 
  Bookmark, 
  Heart,
  Bell,
  Settings,
  Image as ImageIcon,
  LucideIcon,
  Plus,
  RefreshCw
} from "lucide-react";

type EmptyStateType = 
  | "posts" 
  | "search" 
  | "comments" 
  | "friends" 
  | "bookmarks" 
  | "notifications"
  | "followers"
  | "following"
  | "images"
  | "custom";

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  showIllustration?: boolean;
}

const typeConfig: Record<EmptyStateType, {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  color: string;
}> = {
  posts: {
    icon: FileText,
    title: "No posts yet",
    description: "Be the first to share something amazing with the community!",
    actionLabel: "Create Post",
    color: "primary",
  },
  search: {
    icon: Search,
    title: "No results found",
    description: "Try adjusting your search terms or filters to find what you're looking for.",
    color: "default",
  },
  comments: {
    icon: MessageCircle,
    title: "No comments yet",
    description: "Be the first to share your thoughts on this post!",
    actionLabel: "Add Comment",
    color: "secondary",
  },
  friends: {
    icon: Users,
    title: "No friends yet",
    description: "Start connecting with people who share your interests!",
    actionLabel: "Find Friends",
    color: "success",
  },
  bookmarks: {
    icon: Bookmark,
    title: "No bookmarks",
    description: "Save posts you want to read later by clicking the bookmark icon.",
    color: "warning",
  },
  notifications: {
    icon: Bell,
    title: "No notifications",
    description: "You're all caught up! Check back later for updates.",
    color: "primary",
  },
  followers: {
    icon: Heart,
    title: "No followers yet",
    description: "Share great content to attract followers!",
    color: "danger",
  },
  following: {
    icon: Users,
    title: "Not following anyone",
    description: "Follow people to see their posts in your feed.",
    actionLabel: "Discover People",
    color: "primary",
  },
  images: {
    icon: ImageIcon,
    title: "No images",
    description: "Upload images to make your content more engaging.",
    actionLabel: "Upload Image",
    color: "secondary",
  },
  custom: {
    icon: Settings,
    title: "Nothing here",
    description: "This section is empty.",
    color: "default",
  },
};

const EmptyState: React.FC<EmptyStateProps> = ({
  type = "custom",
  title,
  description,
  icon: CustomIcon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  showIllustration = true,
}) => {
  const config = typeConfig[type];
  const Icon = CustomIcon || config.icon;
  const displayTitle = title || config.title;
  const displayDescription = description || config.description;
  const displayActionLabel = actionLabel || config.actionLabel;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Illustration/Icon */}
      {showIllustration && (
        <div className="relative mb-6">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full blur-2xl opacity-50 scale-150" />
          
          {/* Main icon container */}
          <div className={`relative w-24 h-24 rounded-full bg-default-100 flex items-center justify-center border-2 border-dashed border-default-300`}>
            <Icon className="w-10 h-10 text-default-400" strokeWidth={1.5} />
          </div>
          
          {/* Floating decorations */}
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary-400" />
          </div>
          <div className="absolute -bottom-1 -left-3 w-4 h-4 rounded-full bg-secondary-100 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-secondary-400" />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-sm space-y-2">
        <h3 className="text-xl font-semibold text-foreground">
          {displayTitle}
        </h3>
        <p className="text-default-500 text-sm leading-relaxed">
          {displayDescription}
        </p>
      </div>

      {/* Actions */}
      {(displayActionLabel || secondaryActionLabel) && (
        <div className="flex gap-3 mt-6">
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              variant="flat"
              color="default"
              onPress={onSecondaryAction}
              startContent={<RefreshCw className="w-4 h-4" />}
            >
              {secondaryActionLabel}
            </Button>
          )}
          {displayActionLabel && onAction && (
            <Button
              color="primary"
              onPress={onAction}
              startContent={<Plus className="w-4 h-4" />}
              className="font-medium"
            >
              {displayActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
