"use client";
import { TPost } from "@/types/TPost";
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User,
} from "@heroui/react";
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
  const [loadError, setLoadError] = useState(false);
  const rowsPerPage = 4; // Number of rows per page

  // Fetch data on initial render and when the page changes
  const fetchData = async (page: number) => {
    try {
      setLoadError(false);
      const { data } = await getPosts(page, rowsPerPage);
      const { data: fetchedPosts, pageCount } = data || {};
      setNumberOfPages(Math.max(1, pageCount ?? 1)); // Set the number of pages
      setPosts(fetchedPosts || []); // Set the fetched posts
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoadError(true);
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
      columnKey: keyof TPostWithoutContentAndImages | "actions",
    ) => {
      const cellValue = post[columnKey as keyof TPostWithoutContentAndImages];

      switch (columnKey) {
        case "title":
          return (
            <div className="text-secondary-fg">
              {typeof cellValue === "string" ? cellValue : null}
              <h3 className="text-default-600">
                Posted on: {new Date(post.createdAt).toLocaleDateString()}
              </h3>
            </div>
          );

        case "category":
          return (
            <div className="text-primary-fg">
              {typeof cellValue === "string" ? cellValue : null}
            </div>
          );
        case "likes":
          return (
            <div className="text-primary-fg">
              {typeof cellValue === "number" ? cellValue : null}
            </div>
          );

        case "dislikes":
          return (
            <div className="text-secondary-fg">
              {typeof cellValue === "number" ? cellValue : null}
            </div>
          );
        case "author":
          return (
            <div className="text-secondary-fg">
              {post.author?.name ? (
                <div>
                  <User
                    name={post.author?.name}
                    description={
                      post.author?.nickName ? (
                        <Link href={`/profile/${post.author?.nickName}`}>
                          {post.author?.nickName}
                        </Link>
                      ) : (
                        <span>@unknown</span>
                      )
                    }
                    avatarProps={{
                      src: `${post.author?.profilePhoto ?? ""}`,
                    }}
                    className="text-default-900"
                  />
                </div>
              ) : (
                <span className="text-default-600 text-sm">Deleted user</span>
              )}
            </div>
          );

        case "actions":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Tooltip color="primary" content="View post">
                <Link href={`/posts/${post._id}`} aria-label={`View post ${post.title}`}>
                  <span className="text-xl text-primary-fg cursor-pointer active:opacity-50">
                    <Eye />
                  </span>
                </Link>
              </Tooltip>
              <DeleteConfirmationModal
                item={post}
                title="post"
                onDeleted={() => void fetchData(page)}
              />
            </div>
          );

        default:
          return null;
      }
    },
    [page],
  );

  return (
    <div>
      {loadError && (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-danger-200 bg-danger-50 dark:bg-danger-500/10 px-4 py-3 text-sm text-danger-700 dark:text-danger-300"
        >
          <span>Couldn&apos;t load posts.</span>
          <Button size="sm" variant="flat" color="danger" onPress={() => void fetchData(page)}>
            Retry
          </Button>
        </div>
      )}
      <Table
        aria-label="Post management table"
        bottomContent={
          numberOfPages > 1 ? (
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
          ) : undefined
        }
        style={{
          height: "auto",
          minWidth: "100%",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={posts} emptyContent="No posts found.">
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey as keyof TPostWithoutContentAndImages | "actions")}
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
