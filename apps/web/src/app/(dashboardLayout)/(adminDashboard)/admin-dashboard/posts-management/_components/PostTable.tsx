"use client";
import { TPost } from "@/types/TPost";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User,
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { Eye } from "lucide-react";
import Link from "next/link";
import DeleteConfirmationModal from "@/app/(dashboardLayout)/components/modal/ConfirmModal";
import { columns } from "./constants";
import { getPosts } from "@/services/PostService";

const PostTable = () => {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [page, setPage] = useState<number>(1); // For tracking the current page
  const [numberOfPages, setNumberOfPages] = useState<number>(1); // Total pages
  const rowsPerPage = 4; // Number of rows per page

  // Fetch data on initial render and when the page changes
  const fetchData = async (page: number) => {
    try {
      const { data } = await getPosts(page, rowsPerPage);
      const { data:fetchedPosts, pageCount } = data || {};
      setNumberOfPages(pageCount); // Set the number of pages
      setPosts(fetchedPosts || []); // Set the fetched posts
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  // Initial render and page change effect
  useEffect(() => {
    fetchData(page); // Fetch data when the page changes
  }, [page]);




  type OmittedKeys = "content" | "images" | "tags" | "updatedAt" | "_v";
  type TPostWithoutContentAndImages = Omit<TPost, OmittedKeys>;

  const renderCell = useCallback(
    (
      post: TPostWithoutContentAndImages,
      columnKey: keyof TPostWithoutContentAndImages | "actions"
    ) => {
      const cellValue = post[columnKey as keyof TPostWithoutContentAndImages];

      switch (columnKey) {
        case "title":
          return (
            <div className="text-secondary">
              {typeof cellValue === "string" ? cellValue : null}
              <h3 className="text-default-400">
                Posted on: {new Date(post.createdAt).toLocaleDateString()}
              </h3>
            </div>
          );

        case "category":
          return (
            <div className="text-primary">
              {typeof cellValue === "string" ? cellValue : null}
            </div>
          );
        case "likes":
          return (
            <div className="text-primary">
              {typeof cellValue === "number" ? cellValue : null}
            </div>
          );

        case "dislikes":
          return (
            <div className="text-secondary">
              {typeof cellValue === "number" ? cellValue : null}
            </div>
          );
        case "author":
          return (
            <div className="text-secondary">
              {post.author ? (
                <div>
                  <User
                    name={post.author?.name}
                    description={
                      <Link href={`/profile/${post.author?.nickName}`}>
                        {post.author?.nickName}
                      </Link>
                    }
                    avatarProps={{
                      src: `${post.author?.profilePhoto}`,
                    }}
                    className="text-default-900"
                  />
                </div>
              ) : null}
            </div>
          );

        case "actions":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Tooltip color="primary" content="View post">
                <Link href={`/dashboard/my-posts/${post._id}`}>
                  <span className="text-xl text-primary cursor-pointer active:opacity-50">
                    <Eye />
                  </span>
                </Link>
              </Tooltip>
              <DeleteConfirmationModal item={post} title="post" />
            </div>
          );

        default:
          return null;
      }
    },
    []
  );


  return (
    <div>
      <Table
        aria-label="Post management table with sorting"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={numberOfPages}
              onChange={(page) => setPage(page)} // Trigger fetch on page change
            />
          </div>
        }
        style={{
          height: "auto",
          minWidth: "100%",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting
             
            >
              {column.name}
             
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={posts}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(
                    item,
                    columnKey as keyof TPostWithoutContentAndImages | "actions"
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PostTable;
