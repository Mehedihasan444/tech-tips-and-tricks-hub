"use client";
import React, { ReactNode } from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";

import { ChevronRight } from "lucide-react";

import { SidebarItem } from "./sidebar-item";
interface CollapseItem {
  title: string;
  icon: ReactNode;
  href?: string;
}
interface Props {
  icon: ReactNode;
  title: string;
  // href?: string;
  isActive?: string;
  items: CollapseItem[];
}

export const CollapseItems = ({ icon, items, title, isActive }: Props) => {

  return (
    <div className="flex gap-4 h-full items-center cursor-pointer">
      <Accordion className="px-0">
        <AccordionItem
          indicator={<ChevronRight />}
          classNames={{
            indicator: "data-[open=true]:rotate-90",
            trigger:
              "py-0 min-h-[44px] hover:bg-default-100  rounded-xl active:scale-[0.98] data-[open=true]:bg-default-100 transition-transform px-3.5",

            title: `px-0 flex text-base gap-2  h-full items-center cursor-pointer`,
            content: "bg-default-100 rounded-xl active:scale-[0.98] mt-1",
          }}
          aria-label="Accordion 1"
          title={
            <div className="flex flex-row gap-2 ">
              <span >{icon}</span>
              <span>{title}</span>
            </div>
          }
        >
          <div className="pl-12 space-y-2">
            {items.map((item, index) => (
              <SidebarItem
                key={index}
                isActive={isActive === item.href}
                title={item.title}
                icon={item.icon}
                href={item.href}
              />
            ))}
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
