"use client";
import { useCallback, useMemo, useState } from "react";
import { SidebarContext } from "./layout-context";

/**
 * Client shell for the dashboard route group. Mounted by
 * `app/(dashboardLayout)/layout.tsx`; without that layout this component was
 * never rendered and every sidebar toggle resolved to the context's no-op default.
 */
const DashboardShell = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);

  const value = useMemo(() => ({ isOpen, setIsOpen, toggleSidebar }), [isOpen, toggleSidebar]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export default DashboardShell;
