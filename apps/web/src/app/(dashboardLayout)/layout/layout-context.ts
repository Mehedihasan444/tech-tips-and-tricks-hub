"use client";
import { createContext, useContext } from "react";

interface SidebarContextProps {
  /**
   * Whether the off-canvas sidebar is currently open on small screens.
   * Named `isOpen` rather than `collapsed` because the sidebar is only ever
   * collapsible below the `md` breakpoint; above it is always visible.
   */
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
}

/**
 * Default is `undefined` on purpose: a non-null default silently swallows a
 * missing provider and turns every toggle into a no-op, which is exactly what
 * happened when this provider was never mounted. Consumers must fail loudly.
 */
export const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);

  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarContext.Provider");
  }

  return context;
};
