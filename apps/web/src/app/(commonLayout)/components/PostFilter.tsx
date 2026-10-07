"use client";
import { postCategories } from "@/app/(dashboardLayout)/(userDashboard)/dashboard/create-post/constant";
import { useGetFilteredPosts, useGetFilteredPostsByCategory } from "@/hooks/search.hook";
import { getPosts } from "@/services/PostService";
import { TPost } from "@/types/TPost";
import { Select, SelectItem, Chip } from "@heroui/react";
import { Filter, TrendingUp } from "lucide-react";
import React, { Dispatch, useEffect, useState } from "react";
import { toast } from "sonner";

const sortLabel = (sort: string) =>
  sort === "latest" ? "Latest" : sort === "upvoted" ? "Most Upvoted" : "Most Downvoted";

const PostFilter = ({ setData }: { setData: Dispatch<TPost[]> }) => {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [resetting, setResetting] = useState(false);
  const {
    mutate: handleSortBy,
    data: sortedData,
    isSuccess: isShortSuccess,
    isPending: isSortPending,
    isError: isSortError,
  } = useGetFilteredPosts();
  const {
    mutate: handleFilterCategory,
    data: categorizedData,
    isSuccess: isCategorizedSuccess,
    isPending: isCategoryPending,
    isError: isCategoryError,
  } = useGetFilteredPostsByCategory();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (sort) {
      handleSortBy(sort);
    }
  }, [sort, handleSortBy]);

  useEffect(() => {
    if (category && category !== "all") {
      handleFilterCategory(category);
    }
  }, [category, handleFilterCategory]);

  useEffect(() => {
    if (isShortSuccess) {
      setPosts(sortedData?.data);
    }
  }, [sortedData, isShortSuccess]);

  useEffect(() => {
    if (isCategorizedSuccess) {
      setPosts(categorizedData?.data);
    }
  }, [categorizedData, isCategorizedSuccess]);

  useEffect(() => {
    if (isShortSuccess || isCategorizedSuccess) {
      setData(posts);
    }
  }, [posts, isShortSuccess, isCategorizedSuccess, setData]);

  useEffect(() => {
    if (isSortError || isCategoryError) {
      toast.error("Could not apply filters. Please try again.");
    }
  }, [isSortError, isCategoryError]);

  const resetToLatest = async () => {
    setResetting(true);
    try {
      const res = await getPosts(1, 10);
      setData(res?.data?.data ?? []);
    } catch {
      toast.error("Could not reload posts. Please try again.");
    } finally {
      setResetting(false);
    }
  };

  const clearFilters = () => {
    setCategory("");
    setSort("");
    void resetToLatest();
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    if (value === "all") {
      setCategory("");
      void resetToLatest();
    }
  };

  const filtering = isSortPending || isCategoryPending || resetting;

  return (
    <div className="flex flex-wrap gap-3 items-center w-full justify-end">
      {/* Category Filter */}
      <Select
        name="category"
        aria-label="Filter by category"
        className="max-w-[200px]"
        placeholder="Category"
        selectedKeys={category ? new Set([category]) : new Set([])}
        onSelectionChange={(keys) => handleCategoryChange(Array.from(keys)[0] as string)}
        isDisabled={filtering}
        variant="bordered"
        size="sm"
        startContent={<Filter size={16} className="text-default-600" />}
        classNames={{
          trigger: "h-10 min-h-10 bg-default-50 border-default-200 hover:bg-default-100",
          value: "text-sm font-medium",
        }}
      >
        {(["all", ...(postCategories ?? [])] as string[]).map((item) => (
          <SelectItem key={item}>{item === "all" ? "All Categories" : item}</SelectItem>
        ))}
      </Select>

      {/* Sort Filter */}
      <Select
        name="sortBy"
        aria-label="Sort posts"
        placeholder="Sort By"
        selectedKeys={sort ? new Set([sort]) : new Set([])}
        onSelectionChange={(keys) => setSort((Array.from(keys)[0] as string) ?? "")}
        isDisabled={filtering}
        className="max-w-[200px]"
        variant="bordered"
        size="sm"
        startContent={<TrendingUp size={16} className="text-default-600" />}
        classNames={{
          trigger: "h-10 min-h-10 bg-default-50 border-default-200 hover:bg-default-100",
          value: "text-sm font-medium",
        }}
      >
        <SelectItem key="latest">Latest First</SelectItem>
        <SelectItem key="upvoted">Most Upvoted</SelectItem>
        <SelectItem key="downvoted">Most Downvoted</SelectItem>
      </Select>

      {/* Active Filters Display */}
      {(category || sort) && (
        <div className="flex items-center gap-2">
          {category && (
            <Chip
              size="sm"
              variant="flat"
              color="primary"
              onClose={() => handleCategoryChange("all")}
            >
              {category}
            </Chip>
          )}
          {sort && (
            <Chip size="sm" variant="flat" color="secondary" onClose={() => setSort("")}>
              {sortLabel(sort)}
            </Chip>
          )}
          <button
            onClick={clearFilters}
            className="text-xs text-default-500 hover:text-default-700 font-medium underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default PostFilter;
