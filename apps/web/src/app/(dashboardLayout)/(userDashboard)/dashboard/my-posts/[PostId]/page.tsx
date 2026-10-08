import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { User, Divider } from "@/components/ui/heroui";
import { ArrowLeft } from "lucide-react";
import { getPost } from "@/services/PostService";
import Image from "next/image";
import DownloadPdf from "@/app/(commonLayout)/posts/_components/DownloadPdf";
import { sanitizeParse } from "@/utils/sanitizeHtml";

interface IProps {
  params: Promise<{
    PostId: string;
  }>;
}

/**
 * Owner preview of a single post inside the dashboard.
 * The canonical public page lives at /posts/[PostId] — this view reuses the
 * same data but adds dashboard context (back link, manage actions).
 */
const DashboardPostDetailPage = async ({ params }: IProps) => {
  const { PostId } = await params;
  let post = null;
  try {
    const res = await getPost(PostId);
    post = res?.data;
  } catch {
    notFound();
  }
  if (!post?._id) notFound();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-4 py-6">
      <Link
        href="/dashboard/my-posts"
        className="inline-flex items-center gap-1.5 text-sm text-default-500 transition-colors hover:text-primary-fg"
      >
        <ArrowLeft size={15} /> Back to My Posts
      </Link>

      <header className="space-y-3">
        <User
          avatarProps={{ src: post.author?.profilePhoto, radius: "lg" }}
          name={post.author?.name ?? "Unknown author"}
          description={`Posted on: ${post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "Unknown date"}`}
        />
        <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{post.title}</h1>
        <p className="text-sm text-default-500">
          Previewing as the author — the public page is{" "}
          <Link href={`/posts/${post._id}`} className="text-primary-fg hover:underline">
            /posts/{post._id}
          </Link>
        </p>
      </header>

      {post.images?.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {post.images.slice(0, 2).map((image: string, index: number) => (
            <span key={index} className="relative block h-64 overflow-hidden rounded-2xl">
              <Image
                src={image}
                fill
                alt={`${post.title} — image ${index + 1}`}
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </span>
          ))}
        </div>
      )}

      <section className="prose prose-sm max-w-none dark:prose-invert">
        <div>{sanitizeParse(post.content)}</div>
      </section>

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag: string) => (
            <Link
              key={tag}
              href={`/posts?query=${encodeURIComponent(tag)}`}
              className="rounded-full bg-default-100 px-3 py-1 text-xs font-medium text-default-600 transition-colors hover:bg-primary/10 hover:text-primary-fg"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-default-500">
          <p>
            <strong className="font-medium">Category:</strong> {post.category || "—"}
          </p>
          <p>
            <strong className="font-medium">Last updated:</strong>{" "}
            {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : "—"}
          </p>
        </div>
        <DownloadPdf post={post} />
      </section>
      <Divider />

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/posts/${post._id}`}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          View public page
        </Link>
        <Link
          href="/dashboard/manage-posts"
          className="rounded-full border border-divider px-4 py-2 text-sm font-medium transition-colors hover:bg-default-100"
        >
          Manage posts
        </Link>
      </div>
    </div>
  );
};

export default DashboardPostDetailPage;
