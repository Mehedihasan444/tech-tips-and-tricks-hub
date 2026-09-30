'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Tooltip } from '@nextui-org/react';
import {
  Home,
  Users,
  Star,
  Settings,
  Menu,
  X,
  NotebookTabs,
  Store,
  Handshake,
  Bookmark,
  ChevronRight
} from 'lucide-react';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Handshake, label: 'Friends', href: '/my-friends' },
  { icon: Bookmark, label: 'Saved Posts', href: '/saved-posts' },
  { icon: Users, label: 'Community', href: '/community' },
  { icon: Star, label: 'Premium', href: '/subscription', isPremium: true },
  { icon: Store, label: 'About Us', href: '/about-us' },
  { icon: NotebookTabs, label: 'Contact Us', href: '/contact-us' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      className={`bg-content1 h-screen sticky top-0 border-r border-divider transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-72'
      } flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-divider min-h-[73px]">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TechNest
            </h1>
          </Link>
        )}
        <Button
          isIconOnly
          variant="light"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto hover:bg-default-100 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          const linkContent = (
            <Link
              key={item.label}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium 
                transition-all duration-200 group relative overflow-hidden
                ${
                  active
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-default-600 hover:bg-default-100 hover:text-foreground'
                }
                ${item.isPremium && !active ? 'hover:bg-warning/10 hover:text-warning' : ''}
              `}
            >
              {/* Active indicator */}
              {active && !collapsed && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full" />
              )}
              
              {/* Icon */}
              <item.icon 
                size={20} 
                className={`
                  flex-shrink-0 transition-transform duration-200
                  ${active ? '' : 'group-hover:scale-110'}
                  ${item.isPremium && !active ? 'text-warning' : ''}
                `}
              />
              
              {/* Label */}
              {!collapsed && (
                <span className="flex-1">{item.label}</span>
              )}
              
              {/* Arrow indicator for active state */}
              {!collapsed && active && (
                <ChevronRight size={16} className="opacity-70" />
              )}
            </Link>
          );

          return collapsed ? (
            <Tooltip key={item.label} content={item.label} placement="right">
              {linkContent}
            </Tooltip>
          ) : (
            linkContent
          );
        })}
      </nav>

      {/* Settings Footer */}
      <div className="p-4 border-t border-divider">
        {collapsed ? (
          <Tooltip content="Settings" placement="right">
            <Button
              isIconOnly
              variant="flat"
              className="w-full hover:bg-default-100"
              aria-label="Settings"
            >
              <Settings size={20} />
            </Button>
          </Tooltip>
        ) : (
          <Link href={"/settings"}>

          <Button
            variant="flat"
            startContent={<Settings size={20} />}
            className="w-full justify-start hover:bg-default-100"
          >
            Settings
          </Button>
          </Link>
        )}
      </div>
    </aside>
  );
}