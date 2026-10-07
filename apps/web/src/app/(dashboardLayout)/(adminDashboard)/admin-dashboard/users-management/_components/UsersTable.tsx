"use client";
import React, { useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
} from "@heroui/react";
import { Eye } from "lucide-react";
import { IUser } from "@/types/IUser";
import Link from "next/link";

import DeleteConfirmationModal from "@/app/(dashboardLayout)/components/modal/ConfirmModal";
import UserUpdateModal from "./UserUpdateModal";

// Define a valid color map using the specific values allowed by the Chip component
const statusColorMap: Record<string, "success" | "warning" | "danger" | "default"> = {
  ACTIVE: "success",
  BLOCKED: "danger",
};

const columns = [
  { name: "NAME", uid: "name" },
  { name: "EMAIL", uid: "email" },
  { name: "FOLLOWERS", uid: "followers" },
  { name: "FOLLOWING", uid: "following" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

type SortOrder = "asc" | "desc";

interface SortedBy {
  column: keyof IUser;
  order: SortOrder;
}

type OmittedKeys = "socialMedia" | "education";
type TUserWithoutObjects = Omit<IUser, OmittedKeys>;

const UsersTable = ({ users = [] }: { users?: IUser[] }) => {
  const [sortedBy, setSortedBy] = useState<SortedBy | null>(null);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  // Sort the data based on the selected column
  const sortedUsers = useMemo(() => {
    // CRITICAL: Always ensure we return an array, never undefined
    const present = (Array.isArray(users) ? users : []).filter((u) => !removedIds.has(u._id));
    if (present.length === 0) {
      return [];
    }

    if (!sortedBy) {
      return present;
    }

    const { column, order } = sortedBy;
    const sortOrder = order === "asc" ? 1 : -1;

    return [...present].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      // Handle array values (like followers/following)
      if (Array.isArray(aValue) && Array.isArray(bValue)) {
        return (aValue.length - bValue.length) * sortOrder;
      }

      // Handle string/number values
      if (aValue && bValue) {
        if (aValue > bValue) return sortOrder;
        if (aValue < bValue) return -sortOrder;
      }

      // Handle null/undefined values
      if (!aValue && bValue) return sortOrder;
      if (aValue && !bValue) return -sortOrder;

      return 0;
    });
  }, [users, removedIds, sortedBy]);

  const renderCell = useCallback(
    (user: TUserWithoutObjects, columnKey: keyof TUserWithoutObjects | "actions") => {
      const cellValue = user[columnKey as keyof TUserWithoutObjects];

      switch (columnKey) {
        case "name":
          return (
            <User
              avatarProps={{ radius: "lg", src: user.profilePhoto }}
              description={user.email}
              name={user.name}
            />
          );
        case "followers":
          return (
            <span className="text-default-600">
              {Array.isArray(user.followers) ? user.followers.length : 0}
            </span>
          );
        case "following":
          return (
            <span className="text-default-600">
              {Array.isArray(user.following) ? user.following.length : 0}
            </span>
          );
        case "role":
          return (
            <div className="flex flex-col">
              <p className="font-bold text-sm capitalize text-default-700">{user.role}</p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[user?.status as keyof typeof statusColorMap] || "default"}
              size="sm"
              variant="flat"
            >
              {user.status}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Details">
                <Link href={`/profile/${user?.nickName}`}>
                  <span className="text-lg text-default-600 cursor-pointer active:opacity-50 hover:text-primary-fg transition-colors">
                    <Eye />
                  </span>
                </Link>
              </Tooltip>
              {/* update modal */}
              <UserUpdateModal user={user} />

              <DeleteConfirmationModal
                item={user}
                title="user"
                onDeleted={(id) =>
                  setRemovedIds((prev) => {
                    const next = new Set(prev);
                    next.add(id);
                    return next;
                  })
                }
              />
            </div>
          );
        default:
          return <span className="text-default-600">{String(cellValue || "")}</span>;
      }
    },
    [],
  );

  const handleSortChange = (descriptor: { column: string | number; direction: string }) => {
    const column = descriptor.column as keyof IUser;
    setSortedBy((prev) => ({
      column,
      order: prev && prev.column === column && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <Table
      aria-label="User table with sorting"
      sortDescriptor={
        sortedBy
          ? {
              column: sortedBy.column as string,
              direction: sortedBy.order === "desc" ? "descending" : "ascending",
            }
          : undefined
      }
      onSortChange={handleSortChange}
      classNames={{
        wrapper: "min-h-[400px]",
      }}
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
      <TableBody
        items={sortedUsers}
        emptyContent={
          <div className="text-center py-10">
            <p className="text-default-500 text-lg">No users found</p>
            <p className="text-default-600 text-sm mt-2">
              There are no users to display at the moment.
            </p>
          </div>
        }
      >
        {(user) => (
          <TableRow key={user._id} className="hover:bg-default-50 transition-colors">
            {(columnKey) => (
              <TableCell>
                {renderCell(user, columnKey as keyof TUserWithoutObjects | "actions")}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
