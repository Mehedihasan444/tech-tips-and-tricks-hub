import { tv } from "@heroui/react";

/**
 * Dashboard sidebar shell styles.
 *
 * Behavior contract (do not break):
 * - Off-canvas drawer on mobile (`-translate-x-full` until `isOpen`),
 *   always visible from `md` up.
 * - `z-[202]` panel above the `z-[201]` overlay.
 */
export const SidebarWrapper = tv({
  base: "fixed inset-y-0 left-0 z-[202] flex w-[280px] shrink-0 -translate-x-full flex-col border-r border-divider bg-content1/85 backdrop-blur-xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none md:sticky md:top-0 md:h-screen md:translate-x-0",

  variants: {
    isOpen: {
      true: "translate-x-0",
    },
  },
});

export const Overlay = tv({
  base: "fixed inset-0 z-[201] bg-black/40 backdrop-blur-[2px] transition-opacity md:hidden",
});

export const Header = tv({
  base: "flex items-center gap-3 px-5 pb-5 pt-6",
});

export const Body = tv({
  base: "custom-scrollbar flex-1 space-y-6 overflow-y-auto px-3 py-2",
});

export const Footer = tv({
  base: "border-t border-divider/70 p-3",
});

export const Sidebar = Object.assign(SidebarWrapper, {
  Header,
  Body,
  Overlay,
  Footer,
});
