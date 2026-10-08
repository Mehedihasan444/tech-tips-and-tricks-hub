import React from "react";
import PageTitle from "@/app/(dashboardLayout)/components/_page-title/PageTitle";
import PostTable from "./_components/PostTable";

export default async function ManagePosts() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <PageTitle title="Manage Posts" subtitle="Review, edit and remove community posts." />
      <PostTable />
    </div>
  );
}
