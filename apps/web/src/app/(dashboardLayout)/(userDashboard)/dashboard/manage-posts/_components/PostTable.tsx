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
} from "@heroui/react";
import { useCallback, useMemo, useState } from "react";
import { Eye } from "lucide-react";
import Link from "next/link";
import UpdatePost from "./modal/UpdatePost";
import DeleteConfirmationModal from "@/app/(dashboardLayout)/components/modal/ConfirmModal";

const columns = [
  { name: "TITLE", uid: "title" },
  { name: "LIKES", uid: "likes" },
  { name: "DISLIKES", uid: "dislikes" },
  { name: "ACTIONS", uid: "actions" },
];

type SortOrder = "asc" | "desc";

interface SortedBy {
  column: keyof TPost;
  order: SortOrder;
}

const PostTable = ({ posts }: { posts: TPost[] }) => {
  const [sortedBy, setSortedBy] = useState<SortedBy | null>(null);
  const [page, setPage] = useState<number>(1);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const rowsPerPage = 4;

  const visiblePosts = useMemo(
    () => (posts ?? []).filter((post) => !removedIds.has(post._id)),
    [posts, removedIds],
  );

  // const { mutate: handleDeletePost } = useDeletePost(); // Use update post hook

  const sortedPosts = useMemo(() => {
    if (!sortedBy) return visiblePosts;
    const { column, order } = sortedBy;
    const sortOrder = order === "asc" ? 1 : -1;
    return [...visiblePosts].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];
      if (aValue === undefined || bValue === undefined) return 0;
      if (aValue > bValue) return sortOrder;
      if (aValue < bValue) return -sortOrder;
      return 0;
    });
  }, [visiblePosts, sortedBy]);

  const pages = Math.max(1, Math.ceil(visiblePosts?.length / rowsPerPage));
  const safePage = Math.min(Math.max(1, page), pages);

  const items = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedPosts.slice(start, end);
  }, [safePage, sortedPosts]);

  type OmittedKeys = "content" | "images" | "tags" | "author"; // Specify the keys you want to omit

  type TPostWithoutContentAndImages = Omit<TPost, OmittedKeys>; // Create the new type

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
              {cellValue}
              <h3 className="text-default-600">
                Posted on: {new Date(post.createdAt).toLocaleDateString()}
              </h3>
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

        case "actions":
          return (
            <div className="relative flex justify-center items-center gap-2">
              <Tooltip color="primary" content="View post">
                <Link href={`/dashboard/my-posts/${post._id}`}>
                  <span className="text-xl text-primary-fg cursor-pointer active:opacity-50">
                    <Eye />
                  </span>
                </Link>
              </Tooltip>
              {/* update modal */}
              <UpdatePost post={post} />
              {/* post delete modal */}
              <DeleteConfirmationModal
                item={post}
                title="post"
                onDeleted={(id) =>
                  setRemovedIds((prev) => {
                    const next = new Set(prev);
                    next.add(id);
                    return next;
                  })
                }
              />
              {/* <Tooltip color="danger" content="Delete post">
                <span onClick={()=>handleDeletePost({postId:post._id})} className="text-lg text-danger cursor-pointer active:opacity-50">
                  <Trash2 />
                </span>
              </Tooltip> */}
            </div>
          );

        default:
          // Ensure any other value is directly renderable as a ReactNode
          if (typeof cellValue === "string" || typeof cellValue === "number") {
            return cellValue; // Return strings or numbers directly
          }
          // Return null for non-renderable values
          return null;
      }
    },
    [],
  );

  const handleSortChange = (descriptor: { column: string | number; direction: string }) => {
    const column = descriptor.column as keyof TPost;
    setSortedBy((prev) => ({
      column,
      order: prev && prev.column === column && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div>
      <Table
        aria-label="My posts table with sorting"
        sortDescriptor={
          sortedBy
            ? {
                column: sortedBy.column as string,
                direction: sortedBy.order === "desc" ? "descending" : "ascending",
              }
            : undefined
        }
        onSortChange={handleSortChange}
        bottomContent={
          pages > 1 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={safePage}
                total={pages}
                onChange={(next) => setPage(next)}
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
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.uid !== "actions"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent="No posts found.">
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
