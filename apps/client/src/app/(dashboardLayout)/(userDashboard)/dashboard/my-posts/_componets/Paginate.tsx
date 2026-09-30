/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React, { useState } from 'react';
import {
  Pagination,
  Button,
} from "@nextui-org/react";
import { TPost } from '@/types/TPost';
const Paginate = ({ allPosts }:{allPosts:TPost[]}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 2;
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  // Get current posts for the current page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);

 
    return (
        <>
            <div className="flex flex-col items-center gap-5 mt-12">
        <p className="text-small text-default-500">
          Selected Page: {currentPage}
        </p>
      
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="flat"
            color="secondary"
            onPress={() =>
              setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
            }
          >
            Previous
          </Button>
          <Pagination
          total={totalPages}
          color="secondary"
          page={currentPage}
          onChange={setCurrentPage}
        />
          <Button
            size="sm"
            variant="flat"
            color="secondary"
            onPress={() =>
              setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
          >
            Next
          </Button>
        </div>
      </div>
        </>
    );
};

export default Paginate;