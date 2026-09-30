

import React from "react";
import { User, Tooltip, Button, Divider } from "@nextui-org/react";
import { ThumbsUp, ThumbsDown, Share2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { getPost } from "@/services/PostService";
import Link from "next/link";
import DownloadPdf from "../_components/DownloadPdf";

interface IProps {
  params: {
    PostId: string;
  };
}

const PostDetailPage = async ({ params: { PostId } }: IProps) => {
  const { data: post } = await getPost(PostId);

  return (
    <div className="m-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex justify-between items-center w-full">
        <Link href={`/`}>
        <ArrowLeft />
        </Link>


        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm">
          <ol className="flex items-center gap-2 text-default-500">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/posts" className="hover:underline">
                Posts
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-default-700 truncate max-w-xs" title={post.title}>
              {post.title}
            </li>
          </ol>
        </nav>
      </div>
      <hr />
      {/* Header Section */}
      <header className="post-header">
        <div className="post-author">
          <div className="flex justify-between items-center">
            <User
              avatarProps={{ src: post.author.profilePhoto, radius: "lg" }}
              name={post.author.name}
              description={
                <Link href={`/profile/${post.author.nickName}`}>
                  {post.author.nickName}
                </Link>
              }
            />
            <h3 className="text-default-300 pr-5">
              Posted on: {new Date(post.createdAt).toLocaleDateString()}
            </h3>
          </div>
          <h1 className="text-2xl font-semibold">Title : {post.title}</h1>
        </div>
      </header>

      {/* Images Section */}
      {post.images.length > 0 && (
        <div className="flex">
          {post.images.slice(0, 2).map((image: string, index: number) => (
            <Image
              key={index}
              src={image}
              height={500}
              width={500}
              alt={`Image ${index + 1}`}
              className="post-image"
            />
          ))}
        </div>
      )}

      {/* Post Content */}
      <section className="post-content">
        <div
          dangerouslySetInnerHTML={{
            __html: post.content,
          }}
        ></div>

        {/* Tags */}
        <div className="post-tags flex gap-3">
          {post.tags.map((tag: string, index: number) => (
            <span key={index} className=" text-blue-600 cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      </section>

      {/* Post Metadata */}
      <section className="flex justify-between items-center">
        <div className="">
          <div className="post-category">
            <strong className="text-default-500">Category:</strong> {post.category}
          </div>{" "}
          <div className="post-updated">
            <strong className="text-default-500">Last updated on:</strong>{" "}
            {new Date(post.updatedAt).toLocaleDateString()}
          </div>
        </div>
        <div className="flex gap-5">
          <Tooltip content="Likes">
            <Button variant="ghost" startContent={<ThumbsUp />}>
              {post.likes}
            </Button>
          </Tooltip>
          <Tooltip content="Dislikes">
            <Button variant="ghost" startContent={<ThumbsDown />}>
              {post.dislikes}
            </Button>
          </Tooltip>
        </div>
      </section>
      <Divider />

      {/* Share Options */}
      <section className="flex justify-between  items-center gap-5">
        <div className="flex items-center gap-5">
          <div className="">
            <h2 className="font-semibold text-default-500">Share this post : </h2>
          </div>
          <div className="flex gap-5 items-center">
            <Tooltip content="Share on Facebook">
              <Button startContent={<Share2 />} color="primary">
                Facebook
              </Button>
            </Tooltip>
            <Tooltip content="Share on Twitter">
              <Button startContent={<Share2 />} color="secondary">
                Twitter
              </Button>
            </Tooltip>
            <Tooltip content="Copy Link">
              <Button startContent={<Share2 />}>Copy Link</Button>
            </Tooltip>
          </div>
        </div>
        <div className="">
          {/* PDF Download Button */}
          <DownloadPdf post={post} />
        </div>
      </section>
    </div>
  );
};

export default PostDetailPage;
