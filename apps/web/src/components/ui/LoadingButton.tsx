"use client";
import React from "react";
import { Button, Spinner } from "@nextui-org/react";
import { LucideIcon } from "lucide-react";

interface LoadingButtonProps {
  text: string;
  loadingText?: string;
  isLoading: boolean;
  type?: "submit" | "button" | "reset";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost";
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  className?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  text,
  loadingText,
  isLoading,
  type = "button",
  color = "primary",
  variant = "solid",
  size = "lg",
  radius = "lg",
  className = "",
  icon: Icon,
  iconPosition = "left",
  fullWidth = true,
  disabled = false,
  onClick,
}) => {
  const displayText = isLoading ? (loadingText || text) : text;
  
  return (
    <Button
      type={type}
      color={color}
      variant={variant}
      size={size}
      radius={radius}
      className={`font-semibold transition-all duration-200 ${fullWidth ? "w-full" : ""} ${className}`}
      isDisabled={isLoading || disabled}
      onClick={onClick}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Spinner size="sm" color="current" />
          <span>{displayText}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {Icon && iconPosition === "left" && <Icon className="w-5 h-5" />}
          <span>{displayText}</span>
          {Icon && iconPosition === "right" && <Icon className="w-5 h-5" />}
        </div>
      )}
    </Button>
  );
};

export default LoadingButton;
