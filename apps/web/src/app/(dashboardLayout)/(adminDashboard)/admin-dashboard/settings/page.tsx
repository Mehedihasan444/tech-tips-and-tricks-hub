"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Switch,
  Input,
  Select,
  SelectItem,
  Button,
  Divider,
  Tabs,
  Tab,
  Spinner,
  Alert,
  Textarea,
} from "@heroui/react";
import { Save, Shield, Mail, Bell, Globe, Database, Users, Lock, Palette, Zap } from "lucide-react";
import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";
import { toast } from "sonner";

const SETTINGS_KEY = "tech-tips-platform-settings";

const defaultSettings = {
  general: {
    siteName: "Tech Tips & Tricks Hub",
    siteDescription:
      "Bite-size tech tips, tutorials, and premium deep-dives from engineers shipping in production.",
    siteUrl: "https://technest.example.com",
    maintenanceMode: false,
    allowRegistration: true,
    defaultUserRole: "USER",
    postsPerPage: 10,
    maxImageUploads: 3,
    maxImageSizeMB: 5,
  },
  features: {
    enableStories: true,
    enableChat: true,
    enableNotifications: true,
    enablePremium: true,
    enableComments: true,
    enableReactions: true,
    enableBookmarks: true,
    enableFollows: true,
    enableSearch: true,
    enableAIAssistant: true,
  },
  email: {
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "",
    smtpPass: "",
    fromEmail: "noreply@technest.example.com",
    fromName: "TechNest",
    enableEmailVerification: true,
    enableWelcomeEmail: true,
    enablePasswordResetEmail: true,
    enableNotificationEmails: false,
  },
  notifications: {
    pushEnabled: true,
    emailOnLike: true,
    emailOnComment: true,
    emailOnFollow: true,
    emailOnMention: true,
    emailOnReply: true,
    digestFrequency: "daily",
  },
  security: {
    jwtAccessExpiry: "1d",
    jwtRefreshExpiry: "7d",
    bcryptRounds: 12,
    maxLoginAttempts: 5,
    lockoutDurationMinutes: 15,
    requireEmailVerification: true,
    sessionTimeoutHours: 24,
    corsOrigins: "http://localhost:3000",
  },
  appearance: {
    primaryColor: "#8b5cf6",
    secondaryColor: "#06b6d4",
    darkModeDefault: false,
    borderRadius: "md",
    fontFamily: "Inter",
  },
  seo: {
    metaTitle: "Tech Tips & Tricks Hub - Level up your stack",
    metaDescription:
      "Bite-size tech tips, tutorials, and premium deep-dives from engineers shipping in production.",
    ogImage: "",
    twitterHandle: "@technest",
    robotsTxt:
      "User-agent: *\nAllow: /\nDisallow: /dashboard/\nDisallow: /admin-dashboard/\nSitemap: https://technest.example.com/sitemap.xml",
  },
  advanced: {
    apiRateLimit: 100,
    enableApiDocs: false,
    logLevel: "info",
    enableDebugMode: false,
    backupFrequency: "daily",
    retentionDays: 30,
  },
};

type SettingsSchema = typeof defaultSettings;

const readSettings = (): SettingsSchema => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return deepMerge(defaultSettings, parsed);
    }
    return defaultSettings;
  } catch {
    return defaultSettings;
  }
};

const writeSettings = (settings: SettingsSchema) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
};

const deepMerge = (target: any, source: any): any => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = deepMerge(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};

const isObject = (item: any): boolean => item && typeof item === "object" && !Array.isArray(item);

export default function PlatformSettingsPage() {
  const [settings, setSettings] = useState<SettingsSchema>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  // sonner toast is imported directly

  useEffect(() => {
    setSettings(readSettings());
    setLoading(false);
  }, []);

  const handleChange = (section: keyof SettingsSchema, key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
  };

  const handleSave = (section: keyof SettingsSchema) => {
    setSaving(section);
    setTimeout(() => {
      writeSettings(settings);
      setSaving(null);
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved`);
    }, 300);
  };

  const handleReset = (section: keyof SettingsSchema) => {
    if (!confirm(`Reset ${section} settings to defaults?`)) return;
    setSettings((prev) => ({ ...prev, [section]: defaultSettings[section] }));
  };

  const tabs = [
    { key: "general", label: "General", icon: <Globe size={16} /> },
    { key: "features", label: "Features", icon: <Zap size={16} /> },
    { key: "email", label: "Email", icon: <Mail size={16} /> },
    { key: "notifications", label: "Notifications", icon: <Bell size={16} /> },
    { key: "security", label: "Security", icon: <Shield size={16} /> },
    { key: "appearance", label: "Appearance", icon: <Palette size={16} /> },
    { key: "seo", label: "SEO", icon: <Globe size={16} /> },
    { key: "advanced", label: "Advanced", icon: <Database size={16} /> },
  ];

  const sectionMeta: Record<keyof SettingsSchema, { title: string; icon: React.ReactNode }> = {
    general: { title: "General Settings", icon: <Globe size={16} /> },
    features: { title: "Feature Toggles", icon: <Zap size={16} /> },
    email: { title: "Email Configuration", icon: <Mail size={16} /> },
    notifications: { title: "Notification Defaults", icon: <Bell size={16} /> },
    security: { title: "Security & Auth", icon: <Shield size={16} /> },
    appearance: { title: "Appearance & Branding", icon: <Palette size={16} /> },
    seo: { title: "SEO & Social", icon: <Globe size={16} /> },
    advanced: { title: "Advanced", icon: <Database size={16} /> },
  };

  const activeSection = (
    tabs.some((t) => t.key === activeTab) ? activeTab : "general"
  ) as keyof SettingsSchema;

  if (loading) {
    return (
      <div className="p-6" role="status" aria-label="Loading settings...">
        <PageTitle title="Platform Settings" />
        <div className="flex justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  const renderSection = (section: keyof SettingsSchema, title: string, icon: React.ReactNode) => (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-primary/10 rounded-lg">{icon}</span>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <div className="flex gap-2">
            <Button variant="flat" color="default" size="sm" onPress={() => handleReset(section)}>
              Reset
            </Button>
            <Button
              color="primary"
              size="sm"
              startContent={<Save size={14} />}
              isLoading={saving === section}
              onPress={() => handleSave(section)}
            >
              Save
            </Button>
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="p-6">
        {Object.entries(settings[section]).map(([key, value]) => (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
            </label>
            {typeof value === "boolean" ? (
              <Switch isSelected={value} onValueChange={(v) => handleChange(section, key, v)} />
            ) : typeof value === "number" ? (
              <Input
                type="number"
                value={String(value)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const next = e.target.value === "" ? "" : Number(e.target.value);
                  handleChange(
                    section,
                    key,
                    typeof next === "number" && Number.isNaN(next) ? 0 : next,
                  );
                }}
              />
            ) : key.includes("Color") ? (
              <Input
                type="color"
                value={String(value)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(section, key, e.target.value)
                }
                className="w-20 h-10 p-0"
              />
            ) : key.includes("Pass") || key.includes("Secret") ? (
              <Input
                type="password"
                value={String(value)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(section, key, e.target.value)
                }
                placeholder="••••••••"
              />
            ) : key === "robotsTxt" ? (
              <Textarea
                value={String(value)}
                onChange={(e) => handleChange(section, key, e.target.value)}
                rows={6}
                className="font-mono text-sm"
              />
            ) : (
              <Input
                value={String(value ?? "")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(section, key, e.target.value)
                }
              />
            )}
          </div>
        ))}
      </CardBody>
    </Card>
  );

  return (
    <div className="p-6">
      <PageTitle title="Platform Settings" />
      <p className="text-sm text-default-500 mb-6 -mt-2">
        Configure platform behavior, features, and appearance. Changes take effect immediately.
      </p>

      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        color="primary"
        variant="underlined"
        className="mb-6"
        aria-label="Platform settings sections"
      >
        {tabs.map((t) => (
          <Tab
            key={t.key}
            title={
              <span className="flex items-center gap-1.5">
                {t.icon}
                {t.label}
              </span>
            }
          />
        ))}
      </Tabs>

      <div key={activeSection} className="space-y-6 max-w-4xl">
        {renderSection(
          activeSection,
          sectionMeta[activeSection].title,
          sectionMeta[activeSection].icon,
        )}
      </div>

      <Alert color="primary" className="mt-6" icon={<span className="text-primary">ℹ</span>}>
        <strong>Note:</strong> Settings are stored locally in this browser. For production, connect
        to a database-backed settings service.
      </Alert>
    </div>
  );
}
