"use client";
import { postCategories } from "@/app/(dashboardLayout)/(userDashboard)/dashboard/create-post/constant";
import {
  useGetFilteredPosts,
  useGetFilteredPostsByCategory,
} from "@/hooks/search.hook";
import { TPost } from "@/types/TPost";
import { Select, SelectItem, Chip } from "@nextui-org/react";
import { Filter, TrendingUp } from "lucide-react";
import React, { Dispatch, useEffect, useState } from "react";

const PostFilter = ({ setData }: { setData: Dispatch<TPost[]> }) => {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const {
    mutate: handleSortBy,
    data: sortedData,
    isSuccess: isShortSuccess,
  } = useGetFilteredPosts();
  const {
    mutate: handleFilterCategory,
    data: categorizedData,
    isSuccess: isCategorizedSuccess,
  } = useGetFilteredPostsByCategory();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (sort) {
      handleSortBy(sort);
    }
  }, [sort, handleSortBy]);

  useEffect(() => {
    if (category) {
      if (category == "all") {
        setCategory("");
      }
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

  const clearFilters = () => {
    setCategory("");
    setSort("");
  };

  return (
    <div className="flex flex-wrap gap-3 items-center w-full justify-end">
      {/* Category Filter */}
      <Select
        name="category"
        className="max-w-[200px]"
        placeholder="Category"
        value={category}
        variant="bordered"
        size="sm"
        onChange={(e) => setCategory(e.target.value)}
        startContent={<Filter size={16} className="text-default-400" />}
        classNames={{
          trigger: "h-10 min-h-10 bg-default-50 border-default-200 hover:bg-default-100",
          value: "text-sm font-medium",
        }}
      >
        {postCategories?.map((item) => (
          <SelectItem key={item} value={item}>
            {item}
          </SelectItem>
        ))}
      </Select>

      {/* Sort Filter */}
      <Select
        name="sortBy"
        placeholder="Sort By"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="max-w-[200px]"
        variant="bordered"
        size="sm"
        startContent={<TrendingUp size={16} className="text-default-400" />}
        classNames={{
          trigger: "h-10 min-h-10 bg-default-50 border-default-200 hover:bg-default-100",
          value: "text-sm font-medium",
        }}
      >
        <SelectItem key="latest" value="latest">
          Latest First
        </SelectItem>
        <SelectItem key="upvoted" value="-likes">
          Most Upvoted
        </SelectItem>
        <SelectItem key="downvoted" value="-dislikes">
          Most Downvoted
        </SelectItem>
      </Select>

      {/* Active Filters Display */}
      {(category || sort) && (
        <div className="flex items-center gap-2">
          {category && (
            <Chip
              size="sm"
              variant="flat"
              color="primary"
              onClose={() => setCategory("")}
            >
              {category}
            </Chip>
          )}
          {sort && (
            <Chip
              size="sm"
              variant="flat"
              color="secondary"
              onClose={() => setSort("")}
            >
              {sort === "latest" ? "Latest" : sort === "-likes" ? "Most Upvoted" : "Most Downvoted"}
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