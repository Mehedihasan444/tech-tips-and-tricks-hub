import React from "react";
import type { Metadata } from "next";
import { User, Divider } from "@/components/ui/heroui";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getPost } from "@/services/PostService";
import { getCurrentUser } from "@/services/AuthService";
import Link from "next/link";
import DownloadPdf from "../_components/DownloadPdf";
import PostDetailActions from "../_components/PostDetailActions";
import MediaGallery from "../../components/MediaGallery";
import Message from "../../components/message/Message";
import { sanitizeParse } from "@/utils/sanitizeHtml";

interface IProps {
  params: Promise<{
    PostId: string;
  }>;
}

export const dynamic = "force-dynamic";

const truncate = (value: string, max = 155) =>
  value.length > max ? `${value.slice(0, max - 1).trimEnd()}\u2026` : value;

export async function generateMetadata({ params }: IProps): Promise<Metadata> {
  const { PostId } = await params;

  try {
    const post = (await getPost(PostId))?.data;
    if (!post?.title) return { title: "Post" };

    const description = truncate(
      post.shortDescription ||
        String(post.content ?? "")
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim(),
    );

    return {
      title: post.title,
      description,
      openGraph: {
        title: post.title,
        description,
        type: "article",
        images: post.images?.[0] ? [{ url: post.images[0] }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: post.images?.[0] ? [post.images[0]] : undefined,
      },
    };
  } catch {
    return { title: "Post" };
  }
}

const formatDetailDate = (value: unknown): string => {
  try {
    const date = new Date(value as string);
    if (Number.isNaN(date.getTime())) return "Unknown date";
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "Unknown date";
  }
};

const PostDetailPage = async ({ params }: IProps) => {
  const { PostId } = await params;
  let post;
  try {
    const res = await getPost(PostId);
    post = res?.data;
  } catch {
    notFound();
  }
  if (!post) {
    notFound();
  }

  const loggedInUser = await getCurrentUser().catch(() => null);
  const author = post.author ?? {};
  const authorHref = author.nickName ? `/profile/${author.nickName}` : null;
  const images: string[] = Array.isArray(post.images) ? post.images : [];
  const tags: string[] = Array.isArray(post.tags) ? post.tags : [];

  return (
    <div className="m-6 space-y-5 max-w-5xl mx-auto">
      <div className="flex justify-between items-center w-full gap-4">
        <Link
          href="/"
          aria-label="Back to home"
          className="flex items-center gap-2 text-default-500 hover:text-primary-fg transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium hidden sm:inline">Back</span>
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
          <div className="flex justify-between items-center gap-4">
            <User
              avatarProps={{ src: author.profilePhoto, radius: "lg", name: author.name ?? "?" }}
              name={author.name ?? "Unknown author"}
              description={
                authorHref ? (
                  <Link href={authorHref}>{author.nickName}</Link>
                ) : (
                  <span>@unknown</span>
                )
              }
            />
            <p className="text-default-500 text-sm pr-5 shrink-0">
              Posted on: {formatDetailDate(post.createdAt)}
            </p>
          </div>
          <h1 className="text-2xl font-semibold mt-3">{post.title}</h1>
        </div>
      </header>

      {/* Images Section */}
      {images.length > 0 && <MediaGallery media={images} />}

      {/* Post Content */}
      <section className="post-content">
        <div>{sanitizeParse(post.content ?? "")}</div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="post-tags flex gap-3 flex-wrap mt-4">
            {tags.map((tag: string, index: number) => (
              <Link
                key={index}
                href={`/posts?query=${encodeURIComponent(tag)}`}
                className="text-primary-fg hover:underline text-sm font-medium"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Post Metadata */}
      <section className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          {post.category && (
            <div className="post-category">
              <strong className="text-default-500">Category:</strong> {post.category}
            </div>
          )}
          <div className="post-updated">
            <strong className="text-default-500">Last updated on:</strong>{" "}
            {formatDetailDate(post.updatedAt)}
          </div>
        </div>
        <PostDetailActions
          postId={post._id}
          title={post.title}
          initialLikes={post.likes ?? 0}
          initialDislikes={post.dislikes ?? 0}
        />
      </section>
      <Divider />

      {/* PDF Download */}
      <section className="flex justify-end">
        <DownloadPdf post={post} />
      </section>
      <Divider />

      {/* Comments */}
      <section aria-label="Comments">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {loggedInUser?._id ? (
          <Message user={loggedInUser} post={post} />
        ) : (
          <div className="bg-content1 rounded-2xl border border-divider p-6 text-center">
            <p className="text-default-500 text-sm mb-4">
              Sign in to join the discussion on this post.
            </p>
            <Link
              href={`/login?redirect=/posts/${post._id}`}
              className="text-primary-fg font-semibold hover:underline text-sm"
            >
              Sign in to comment
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default PostDetailPage;
