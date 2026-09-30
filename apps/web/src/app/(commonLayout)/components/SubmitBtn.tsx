"use client";
import React from "react";
import { Button, Spinner } from "@nextui-org/react";
import { LucideIcon } from "lucide-react";

interface SubmitBtnProps {
  text: string;
  loadingText?: string;
  isLoading: boolean;
  icon?: LucideIcon;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  variant?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost";
  fullWidth?: boolean;
  className?: string;
}

const SubmitBtn: React.FC<SubmitBtnProps> = ({ 
  text, 
  loadingText,
  isLoading, 
  icon: Icon,
  color = "primary",
  variant = "solid",
  fullWidth = true,
  className = ""
}) => {
  const displayText = isLoading ? (loadingText || "Please wait...") : text;

  return (
    <Button
      size="lg"
      radius="lg"
      type="submit"
      isDisabled={isLoading}
      variant={variant}
      color={color}
      className={`font-semibold transition-all duration-200 ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Spinner size="sm" color="current" />
          <span>{displayText}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5" />}
          <span>{text}</span>
        </div>
      )}
    </Button>
  );
};

export default SubmitBtn;
