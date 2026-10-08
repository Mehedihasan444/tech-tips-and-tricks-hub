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
    <div className="surface rounded-2xl p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <Input
          type="search"
          variant="bordered"
          label="Search"
          aria-label="Search my posts"
          placeholder="Search title or content..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select
          variant="bordered"
          label="Category"
          aria-label="Filter by category"
          placeholder="All Categories"
          selectedKeys={new Set([category])}
          onSelectionChange={(keys) =>
            setCategory((Array.from(keys)[0] as string) ?? ALL_CATEGORIES)
          }
        >
          {([ALL_CATEGORIES, ...postCategories] as string[]).map((item) => (
            <SelectItem key={item}>{item}</SelectItem>
          ))}
        </Select>
        <Input
          type="date"
          variant="bordered"
          label="Published on"
          aria-label="Filter by publish date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div className="flex items-center sm:col-span-2 lg:col-span-1">
          <Button
            size="sm"
            variant="flat"
            color="primary"
            onPress={clearAll}
            isDisabled={!isActive}
            className="w-full lg:w-auto"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
