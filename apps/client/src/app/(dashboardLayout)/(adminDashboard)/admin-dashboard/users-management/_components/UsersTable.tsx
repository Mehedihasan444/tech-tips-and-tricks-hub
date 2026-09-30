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
} from "@nextui-org/react";
import { Eye } from "lucide-react";
import { IUser } from "@/types/IUser";
import Link from "next/link";

import DeleteConfirmationModal from "@/app/(dashboardLayout)/components/modal/ConfirmModal";
import UserUpdateModal from "./UserUpdateModal";

// Define a valid color map using the specific values allowed by the Chip component
const statusColorMap: Record<
  string,
  "success" | "warning" | "danger" | "default"
> = {
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


  // Sort the data based on the selected column
  const sortedUsers = useMemo(() => {
    // CRITICAL: Always ensure we return an array, never undefined
    if (!Array.isArray(users) || users.length === 0) {
      return [];
    }
    
    if (!sortedBy) {
      return users;
    }

    const { column, order } = sortedBy;
    const sortOrder = order === "asc" ? 1 : -1;

    return [...users].sort((a, b) => {
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
  }, [users, sortedBy]);

  const renderCell = useCallback(
    (
      user: TUserWithoutObjects,
      columnKey: keyof TUserWithoutObjects | "actions"
    ) => {
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
              <p className="text-bold text-sm capitalize text-default-700">
                {user.role}
              </p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={
                statusColorMap[user?.status as keyof typeof statusColorMap] ||
                "default"
              }
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
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50 hover:text-primary transition-colors">
                    <Eye />
                  </span>
                </Link>
              </Tooltip>
              {/* update modal */}
              <UserUpdateModal user={user} />

              <DeleteConfirmationModal item={user} title="user" />
            </div>
          );
        default:
          return (
            <span className="text-default-600">
              {String(cellValue || "")}
            </span>
          );
      }
    },
    []
  );

  const handleSort = useCallback((column: keyof IUser) => {
    setSortedBy((prev) => {
      let order: SortOrder = "asc";
      if (prev && prev.column === column && prev.order === "asc") {
        order = "desc";
      }
      return { column, order };
    });
  }, []);

  return (
    <Table
      aria-label="User table with sorting"
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
            onClick={() => {
              if (column.uid !== "actions") {
                handleSort(column.uid as keyof IUser);
              }
            }}
            className="cursor-pointer hover:bg-default-100 transition-colors"
          >
            <div className="flex items-center gap-1">
              {column.name}
              {sortedBy && sortedBy.column === column.uid && (
                <span className="text-primary font-bold">
                  {sortedBy.order === "asc" ? " ↑" : " ↓"}
                </span>
              )}
            </div>
          </TableColumn>
        )}
      </TableHeader>
      <TableBody 
        items={sortedUsers} 
        emptyContent={
          <div className="text-center py-10">
            <p className="text-default-500 text-lg">No users found</p>
            <p className="text-default-400 text-sm mt-2">
              There are no users to display at the moment.
            </p>
          </div>
        }
      >
        {(user) => (
          <TableRow key={user._id} className="hover:bg-default-50 transition-colors">
            {(columnKey) => (
              <TableCell>
                {renderCell(
                  user,
                  columnKey as keyof TUserWithoutObjects | "actions"
                )}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default UsersTable;