"use client";
import React, { useEffect, useState } from "react";
import { Select, SelectItem, Input, Button } from "@heroui/react";
import { TPost } from "@/types/TPost";
import { postCategories } from "@/app/(dashboardLayout)/(userDashboard)/dashboard/create-post/constant";

const ALL_CATEGORIES = "All Categories";

export interface PostFilters {
  query: string;
  category: string;
  date: string;
}

const Filter = ({ posts, onFilter }: { posts: TPost[]; onFilter: (filtered: TPost[]) => void }) => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [date, setDate] = useState("");

  useEffect(() => {
    const q = query.trim().toLowerCase();
    const filtered = (posts ?? []).filter((post) => {
      if (category !== ALL_CATEGORIES && post.category !== category) return false;
      if (date && !(post.createdAt ?? "").startsWith(date)) return false;
      if (q) {
        const haystack =
          `${post.title ?? ""} ${post.content?.replace(/<[^>]+>/g, "") ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    onFilter(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts, query, category, date]);

  const clearAll = () => {
    setQuery("");
    setCategory(ALL_CATEGORIES);
    setDate("");
  };

  const isActive = query.trim() !== "" || category !== ALL_CATEGORIES || date !== "";

  return (
    <div className="flex flex-wrap items-end gap-3">
      {/* Search Bar */}
      <Input
        type="search"
        variant="underlined"
        label="Search"
        aria-label="Search my posts"
        placeholder="Search here ..."
        className="max-w-xs"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Category Filter */}
      <Select
        variant="underlined"
        label="Category"
        aria-label="Filter by category"
        placeholder="Select a category"
        className="max-w-xs"
        selectedKeys={new Set([category])}
        onSelectionChange={(keys) => setCategory((Array.from(keys)[0] as string) ?? ALL_CATEGORIES)}
      >
        {([ALL_CATEGORIES, ...postCategories] as string[]).map((item) => (
          <SelectItem key={item}>{item}</SelectItem>
        ))}
      </Select>

      {/* Date Filter */}
      <Input
        type="date"
        variant="underlined"
        label="Published on"
        aria-label="Filter by publish date"
        className="max-w-xs"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {isActive && (
        <Button size="sm" variant="light" onPress={clearAll}>
          Clear
        </Button>
      )}
    </div>
  );
};

export default Filter;
