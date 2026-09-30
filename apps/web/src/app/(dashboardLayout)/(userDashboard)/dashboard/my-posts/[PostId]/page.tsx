import React from "react";
import { User, Tooltip, Button, Divider } from "@nextui-org/react"; // For UI components
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import { getPost } from "@/services/PostService";
import Image from "next/image";
import DownloadPdf from "@/app/(commonLayout)/posts/_components/DownloadPdf";

interface IProps {
  params: {
    PostId: string;
  };
}

const PostDetailPage = async ({ params: { PostId } }: IProps) => {
  const { data: post } = await getPost(PostId);
  return (
    <div className="m-6 space-y-5">
      {/* Header Section */}
      <header className="post-header">
        <div className="post-author">
          <User
            avatarProps={{ src: post.author.profilePhoto, radius: "lg" }}
            name={post.author.name}
            description={`Posted on: ${new Date(
              post.createdAt
            ).toLocaleDateString()}`}
          />
            <h1 className="text-2xl font-semibold">Title : {post.title}</h1>
        </div>
      </header>

      {/* Images Section */}
      {post.images.length > 0 && (
        <div className="flex">
          {post.images.slice(0,2).map((image: string, index: number) => (
            <Image
              key={index}
              src={image}
              height={500}
              width={600}
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
      {/* Comments Section */}
 
    </div>
  );
};

export default PostDetailPage;
