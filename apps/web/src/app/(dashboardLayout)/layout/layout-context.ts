// SidebarContext.tsx (or whatever filename you're using)
"use client";
import { createContext, useContext} from 'react';

// Define the interface for the context value
interface SidebarContextProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

// Create the context with default values
export const SidebarContext = createContext<SidebarContextProps>({
  collapsed: false,
  setCollapsed: () => {},

});

// Hook to use the SidebarContext in components
export const useSidebarContext = () => {
  return useContext(SidebarContext);
};


