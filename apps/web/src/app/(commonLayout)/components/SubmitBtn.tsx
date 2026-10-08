"use client";
import React from "react";
import LoadingButton from "@/components/ui/LoadingButton";
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

/**
 * Form submit button — thin wrapper over the canonical LoadingButton
 * so both stay visually identical.
 */
const SubmitBtn: React.FC<SubmitBtnProps> = (props) => {
  return <LoadingButton {...props} type="submit" size="lg" radius="lg" />;
};

export default SubmitBtn;
