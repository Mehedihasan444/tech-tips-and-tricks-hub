// app/components/ThemeSwitcher.tsx
"use client";

import { Switch } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";

const TRANSITION_CLASS = "theme-transition";
const TRANSITION_MS = 350;

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  // Kept in a ref rather than read from state inside the effect below: the
  // cleanup runs on unmount, and a state value captured in the effect body
  // would be the value from the render that scheduled it.
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Reserve the same width before mount so the navbar doesn't shift on hydration.
  if (!mounted) {
    return (
      <span aria-hidden="true" className="inline-block h-7 w-12 rounded-full bg-default-100" />
    );
  }

  const isDark = theme === "dark";

  const handleChange = (selected: boolean) => {
    // `.theme-transition` cross-fades the page background and text colour. It has
    // to be added *before* the class flips, otherwise the browser has already
    // painted the new background by the time the transition property exists and
    // nothing animates. Removing it after the duration keeps hover/press
    // transitions elsewhere from being slowed down by it.
    const root = document.documentElement;
    root.classList.add(TRANSITION_CLASS);
    setTheme(selected ? "dark" : "light");

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      root.classList.remove(TRANSITION_CLASS);
      timeoutRef.current = null;
    }, TRANSITION_MS);
  };

  return (
    <Switch
      isSelected={isDark}
      onValueChange={handleChange}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <Moon size={14} className={className} />
        ) : (
          <Sun size={14} className={className} />
        )
      }
    />
  );
}
