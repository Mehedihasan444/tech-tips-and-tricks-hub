/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import {
  Select,
  SelectItem,
  TimeInput,
  DateInput,
  Input,
} from "@nextui-org/react";
import { CalendarDate, parseDate, Time } from "@internationalized/date";
import { TPost } from "@/types/TPost";
const Filter = ({ allPosts }:{allPosts:TPost[]}) => {
  const [filteredPosts, setFilteredPosts] = useState(allPosts);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");


  // Filter posts based on selected category and date
  const filterPosts = () => {
    let filtered = allPosts;

    // Filter by category
    if (categoryFilter !== "All") {
      filtered = filtered.filter((post) => post.category === categoryFilter);
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter((post) => post.createdAt.includes(dateFilter));
    }

    setFilteredPosts(filtered);
  };

  // Handle changes in filters
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value);
    filterPosts();
  };

  return (
    <>
      {/* Search Bar */}
      <Input
        type="email"
        variant={"underlined"}
        label="Search"
        placeholder="Search here ..."
        className="max-w-xs"
      />

      {/* Category Filter */}

      <Select
        variant={"underlined"}
        label="Favorite Category"
        placeholder="Select an Category"
        className="max-w-xs"
        value={categoryFilter}
        onChange={handleCategoryChange}
      >
        {["All Categories", "JavaScript", "React", "CSS"].map((item, idx) => (
          <SelectItem key={idx}>{item}</SelectItem>
        ))}
      </Select>
      {/* Date Filter */}
      <div className="flex ">
        <TimeInput
          variant="underlined"
          className="max-w-xs"
          label="Event Time"
          defaultValue={new Time(11, 45)}
        />
        <DateInput
          variant="underlined"
          className="max-w-xs"
          label={"Event date"}
          //   isDisabled
          defaultValue={parseDate("2024-04-04")}
          placeholderValue={new CalendarDate(1995, 11, 6)}
        />
      </div>
    </>
  );
};

export default Filter;
