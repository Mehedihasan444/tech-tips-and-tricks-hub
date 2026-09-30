"use client";

import React from "react";
import { Card, CardBody, Chip } from "@nextui-org/react";
import {
  Sparkles,
  Bug,
  Shield,
  Zap,
  Layout,
} from "lucide-react";
import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";

interface ChangelogEntry {
  version: string;
  date: string;
  type: "feature" | "bugfix" | "improvement" | "security";
  title: string;
  description: string;
  items: string[];
}

const changelog: ChangelogEntry[] = [
  {
    version: "2.1.0",
    date: "November 30, 2025",
    type: "feature",
    title: "Real-time Features & AI Integration",
    description: "Major update with real-time messaging and AI-powered features",
    items: [
      "Added real-time chat with Socket.io",
      "Integrated Gemini AI for content suggestions",
      "New notifications system with live updates",
      "Auto-save drafts functionality",
      "AI-powered title and tag suggestions",
    ],
  },
  {
    version: "2.0.5",
    date: "November 25, 2025",
    type: "improvement",
    title: "Dashboard Enhancements",
    description: "Improved admin and user dashboards with better analytics",
    items: [
      "Dynamic analytics with real data",
      "New reports management page",
      "Activity logs for admin monitoring",
      "Improved user statistics cards",
      "Better chart visualizations",
    ],
  },
  {
    version: "2.0.4",
    date: "November 20, 2025",
    type: "bugfix",
    title: "Bug Fixes & Stability",
    description: "Fixed various bugs and improved stability",
    items: [
      "Fixed duplicate message issue in chat",
      "Resolved axios configuration for client components",
      "Fixed user model population errors",
      "Corrected sidebar navigation links",
      "Fixed empty state displays",
    ],
  },
  {
    version: "2.0.3",
    date: "November 15, 2025",
    type: "security",
    title: "Security Updates",
    description: "Enhanced security measures and authentication improvements",
    items: [
      "Improved token refresh mechanism",
      "Enhanced password reset flow",
      "Added rate limiting to API endpoints",
      "Better error handling for auth failures",
    ],
  },
  {
    version: "2.0.0",
    date: "November 1, 2025",
    type: "feature",
    title: "Major Platform Update",
    description: "Complete redesign with new features",
    items: [
      "New modern UI with NextUI components",
      "Dark mode support",
      "Premium subscription system",
      "Stories feature for short updates",
      "Enhanced profile pages",
      "Improved post editor with rich text",
    ],
  },
];

const typeConfig = {
  feature: {
    icon: <Sparkles size={16} />,
    color: "primary" as const,
    label: "New Feature",
  },
  bugfix: {
    icon: <Bug size={16} />,
    color: "danger" as const,
    label: "Bug Fix",
  },
  improvement: {
    icon: <Zap size={16} />,
    color: "secondary" as const,
    label: "Improvement",
  },
  security: {
    icon: <Shield size={16} />,
    color: "warning" as const,
    label: "Security",
  },
};

export default function ChangelogPage() {
  return (
    <div className="p-6">
      <PageTitle title="Changelog" />

      <p className="text-default-500 mb-8">
        Track all updates, improvements, and bug fixes to the TechNest platform.
      </p>

      <div className="space-y-6">
        {changelog.map((entry, index) => {
          const config = typeConfig[entry.type];
          return (
            <Card key={index} className="overflow-visible">
              <CardBody className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Version Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-xl flex flex-col items-center justify-center text-white shadow-lg">
                      <span className="text-xs opacity-80">Version</span>
                      <span className="text-xl font-bold">{entry.version}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <Chip
                        color={config.color}
                        variant="flat"
                        size="sm"
                        startContent={config.icon}
                      >
                        {config.label}
                      </Chip>
                      <span className="text-sm text-default-400">
                        {entry.date}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-default-800 mb-2">
                      {entry.title}
                    </h3>
                    <p className="text-default-500 mb-4">{entry.description}</p>

                    <ul className="space-y-2">
                      {entry.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-start gap-2 text-default-600"
                        >
                          <span className="text-primary mt-1.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Footer */}
      <Card className="mt-8">
        <CardBody className="p-6 text-center">
          <Layout className="mx-auto text-default-300 mb-3" size={32} />
          <p className="text-default-500">
            Want to see a specific feature? Contact us at{" "}
            <a
              href="mailto:support@technest.com"
              className="text-primary hover:underline"
            >
              support@technest.com
            </a>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
