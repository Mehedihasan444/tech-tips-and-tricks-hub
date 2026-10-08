"use client";

import React, { useEffect, useState } from "react";
import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";
import UsersTable from "./_components/UsersTable";
import { getUsers } from "@/services/UserService";
import { Button, Pagination, Spinner } from "@heroui/react";

export default function ManageUsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  const fetchUsers = async (pageNumber: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUsers(pageNumber, limit);
      setUsers(response.data.data);

      // Calculate total pages based on total count from API
      if (response.data && response.data.pageCount) {
        setTotalPages(response.data.pageCount);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUsers(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <PageTitle title="Manage Users" />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" color="primary" />
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p role="alert" className="mb-4 text-danger">
            {error}. Check your connection and try again.
          </p>
          <Button color="primary" variant="flat" onPress={() => void fetchUsers(page)}>
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <UsersTable users={users} />
          </div>

          <div className="flex justify-center mt-4">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={totalPages}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
