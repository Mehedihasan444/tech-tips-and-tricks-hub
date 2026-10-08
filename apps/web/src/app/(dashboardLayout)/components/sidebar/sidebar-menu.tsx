import React from "react";

interface Props {
  title: string;
  children?: React.ReactNode;
}

export const SidebarMenu = ({ title, children }: Props) => {
  return (
    <nav aria-label={title} className="flex flex-col gap-1">
      <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-default-400">
        {title}
      </p>
      {children}
    </nav>
  );
};
