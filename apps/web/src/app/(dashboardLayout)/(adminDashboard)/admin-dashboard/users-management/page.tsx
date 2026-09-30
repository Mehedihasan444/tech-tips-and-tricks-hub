/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";
import UsersTable from "./_components/UsersTable";
import { getUsers } from "@/services/UserService";
import { Pagination, Spinner } from "@nextui-org/react";

export default function ManageUsersTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsers(page, limit);
        setUsers(response.data.data);

        // Calculate total pages based on total count from API
        if (response.data && response.data.pageCount) {
          setTotalPages(response.data.pageCount);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users" as any);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, limit]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="container mx-auto p-6 bg-default-50 rounded-lg mt-8">
      <PageTitle title="Manage Users" />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" color="primary" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
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
