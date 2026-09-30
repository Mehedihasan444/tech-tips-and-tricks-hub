import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getMyPosts } from "@/services/PostService";
import Filter from "./_componets/Filter";
import Paginate from "./_componets/Paginate";
import { TPost } from "@/types/TPost";

const MyPosts = async () => {
  const { data: posts } = await getMyPosts("");

  return (
    <div className="min-h-screen bg-gray-100 py-5 px-5 md:px-20">
      {/* Header */}

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-5 mb-8 space-y-4 md:space-y-0">
        <div className="flex items-center">
          <h1 className="text-2xl border-l-5 border-primary font-bold pl-5 text-default-800 ">
            My Posts
          </h1>
        </div>
        <Filter allPosts={posts} />
      </div>
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts?.map((post: TPost) => (
          <div
            key={post._id}
            className="bg-default-50 rounded-lg shadow-lg overflow-hidden"
          >
            <Image
              width={300}
              height={300}
              src={post.images[0]}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6 space-y-2">
              <h2 className="text-2xl font-semibold text-default-800 ">
                {post.title}
              </h2>
              <div
                className="text-default-600 "
                dangerouslySetInnerHTML={{
                  __html:
                    post.content.length > 300
                      ? post.content.slice(0, 200) + "..." // Slice to 250 characters and add ellipsis
                      : post.content,
                }}
              />

              <p className="text-sm text-default-500">
                <span className="font-semibold text-sm text-default-500">
                  Posted at:{" "}
                </span>
                {post.createdAt.split("T")[0]}
              </p>

              {/* Displaying category and tags */}
              <div className="">
                {/* Display category */}
                <span className="font-semibold text-sm text-default-500">
                  Category:{" "}
                </span>
                <span className="text-sm text-default-600">{post.category}</span>
              </div>
              <div className="">
                <span className="font-semibold text-sm text-default-500">
                  Tags:{" "}
                </span>
                {/* Display tags */}
                <div className="flex flex-wrap gap-2  mt-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-200 text-default-700 text-xs font-medium py-1 px-2 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-2">
                <Link href={`/dashboard/my-posts/${post._id}`}>
                  <button className="bg-secondary/80 hover:bg-secondary text-default-50 py-2 px-4 rounded-lg">
                    Read More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Section */}
      <Paginate allPosts={posts} />
    </div>
  );
};

export default MyPosts;
