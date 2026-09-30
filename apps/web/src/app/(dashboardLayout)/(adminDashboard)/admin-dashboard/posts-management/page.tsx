import React from "react";
import PostTable from "./_components/PostTable";

export default async function ManagePosts() {
  return (
    <div className="container mx-auto p-6 bg-default-50  rounded-lg mt-8">
      <h1 className="text-2xl mb-6 border-l-5 border-primary font-bold pl-5">
        Manage Posts
      </h1>
      <PostTable />
    </div>
  );
}
