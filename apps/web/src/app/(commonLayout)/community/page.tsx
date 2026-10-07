"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardBody, Button, Chip, Input } from "@heroui/react";
import { Users, MessageCircle, Globe, Search, Check } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface Community {
  id: number;
  name: string;
  description: string;
  members: number;
  topics: string[];
  activeDiscussions: number;
  image: string;
}

const communities: Community[] = [
  {
    id: 1,
    name: "Web Development Hub",
    description: "A community for web developers to share knowledge and experiences",
    members: 1250,
    topics: ["JavaScript", "React", "Node.js"],
    activeDiscussions: 45,
    image: "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=500",
  },
  {
    id: 2,
    name: "UI/UX Design Masters",
    description: "Share and learn about modern design practices and tools",
    members: 890,
    topics: ["Design", "Figma", "User Experience"],
    activeDiscussions: 32,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500",
  },
  {
    id: 3,
    name: "Data Science Network",
    description: "Connect with data scientists and analysts worldwide",
    members: 2100,
    topics: ["Python", "Machine Learning", "Data Analysis"],
    activeDiscussions: 67,
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=500",
  },
  {
    id: 4,
    name: "DevOps & Cloud Collective",
    description: "Pipelines, platforms, and production wisdom from cloud engineers",
    members: 760,
    topics: ["Docker", "Kubernetes", "CI/CD"],
    activeDiscussions: 28,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c429?w=500",
  },
];

const formatCount = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K` : `${value}`;

const STORAGE_KEY = "tech-tips-joined-communities";

const CommunityPage = () => {
  // Membership persists on this device so refresh doesn't lose joins.
  const [joinedIds, setJoinedIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setJoinedIds(new Set(JSON.parse(raw) as number[]));
    } catch {
      // storage unavailable — start empty
    }
  }, []);

  const toggleJoin = (id: number, name: string) => {
    setJoinedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info(`Left ${name}`);
      } else {
        next.add(id);
        toast.success(`Joined ${name}!`);
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        // quota / private mode — keep in-memory only
      }
      return next;
    });
  };

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return communities;
    return communities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.topics.some((t) => t.toLowerCase().includes(q)),
    );
  }, [search]);

  const stats = useMemo(() => {
    const totalMembers = communities.reduce((sum, c) => sum + c.members, 0);
    const totalDiscussions = communities.reduce((sum, c) => sum + c.activeDiscussions, 0);
    return [
      { value: `${communities.length}`, label: "Active Communities" },
      { value: `${formatCount(totalMembers)}`, label: "Total Members" },
      { value: `${formatCount(totalDiscussions)}`, label: "Active Discussions" },
    ];
  }, []);

  return (
    <div className=" mx-auto p-4">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-primary-fg" />
            <h1 className="text-3xl font-bold">Tech Communities</h1>
          </div>
          {joinedIds.size > 0 && (
            <Chip color="success" variant="flat" startContent={<Check size={14} />}>
              {joinedIds.size} joined
            </Chip>
          )}
        </div>
        <p className="text-default-500 max-w-2xl">
          Join vibrant tech communities, connect with like-minded professionals, and grow together.
        </p>
        <Input
          startContent={<Search size={16} className="text-default-400" />}
          placeholder="Search communities or topics..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-4 max-w-md"
          aria-label="Search communities"
        />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-primary/10">
          <CardBody className="flex flex-row items-center gap-4">
            <Globe className="w-8 h-8 text-primary-fg" />
            <div>
              <p className="text-2xl font-bold">{stats[0].value}</p>
              <p className="text-small">{stats[0].label}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-success/10">
          <CardBody className="flex flex-row items-center gap-4">
            <Users className="w-8 h-8 text-success" />
            <div>
              <p className="text-2xl font-bold">{stats[1].value}</p>
              <p className="text-small">{stats[1].label}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="bg-warning/10">
          <CardBody className="flex flex-row items-center gap-4">
            <MessageCircle className="w-8 h-8 text-warning" />
            <div>
              <p className="text-2xl font-bold">{stats[2].value}</p>
              <p className="text-small">{stats[2].label}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Communities Grid */}
      {visible.length === 0 ? (
        <div className="rounded-2xl border border-divider bg-content1 p-10 text-center">
          <p className="font-semibold">No communities match &quot;{search}&quot;</p>
          <p className="mt-1 text-sm text-default-500">Try a different keyword or topic.</p>
          <Button className="mt-4" variant="flat" color="primary" onPress={() => setSearch("")}>
            Clear search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((community) => {
            const joined = joinedIds.has(community.id);
            return (
              <Card key={community.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="overflow-hidden p-0">
                  <Image
                    src={community.image}
                    alt={community.name}
                    width={500}
                    height={192}
                    className="w-full h-48 object-cover"
                  />
                </CardHeader>
                <CardBody className="p-5">
                  <h3 className="text-xl font-bold mb-2">{community.name}</h3>
                  <p className="text-default-500 mb-4">{community.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {community.topics.map((topic, index) => (
                      <Chip key={index} size="sm" color="primary" variant="flat">
                        {topic}
                      </Chip>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span className="text-small">{formatCount(community.members)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={16} />
                        <span className="text-small">{community.activeDiscussions}</span>
                      </div>
                    </div>
                    <Button
                      color={joined ? "default" : "primary"}
                      variant={joined ? "flat" : "solid"}
                      aria-pressed={joined}
                      startContent={joined ? <Check size={15} /> : undefined}
                      onPress={() => toggleJoin(community.id, community.name)}
                    >
                      {joined ? "Joined" : "Join Community"}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
