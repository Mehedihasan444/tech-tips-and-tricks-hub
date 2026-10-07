"use client";
import React from "react";
import { Pagination, Button } from "@heroui/react";

const Paginate = ({
  total,
  page,
  perPage,
  onChange,
}: {
  total: number;
  page: number;
  perPage: number;
  onChange: (page: number) => void;
}) => {
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  // A pager for a single page is noise — hide it.
  if (totalPages <= 1) return null;

  const safePage = Math.min(Math.max(1, page), totalPages);

  return (
    <div className="flex flex-col items-center gap-5 mt-12">
      <div className="flex gap-2 items-center">
        <Button
          size="sm"
          variant="flat"
          color="secondary"
          isDisabled={safePage <= 1}
          onPress={() => onChange(safePage - 1)}
        >
          Previous
        </Button>
        <Pagination
          total={totalPages}
          color="secondary"
          page={safePage}
          onChange={onChange}
          showControls={false}
          aria-label="Posts pages"
        />
        <Button
          size="sm"
          variant="flat"
          color="secondary"
          isDisabled={safePage >= totalPages}
          onPress={() => onChange(safePage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Paginate;
