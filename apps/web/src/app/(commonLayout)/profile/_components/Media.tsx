import { TPost } from "@/types/TPost";
import Image from "next/image";
import React from "react";
import EmptyState from "@/components/ui/EmptyState";

/** Shows up to 4 tiles: the first 3 plus a 4th that carries a "+N" overlay
 *  only when more images exist beyond it. */
const Media = ({ posts }: { posts: TPost[] }) => {
  const images = (posts ?? []).flatMap((post: TPost) => post.images ?? []);
  const extraCount = images.length - 4;

  return (
    <div className="bg-default-50 shadow-md rounded-lg p-6 mb-6 ">
      <div className="flex justify-between items-center gap-5 mb-4">
        <h2 className="text-xl font-semibold ">Media</h2>
        {images.length > 0 && (
          <span className="text-sm text-default-500">
            {images.length} {images.length === 1 ? "image" : "images"}
          </span>
        )}
      </div>
      {images.length === 0 ? (
        <EmptyState type="images" title="No media yet" showIllustration={false} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.slice(0, 3).map((image: string, index: number) => (
            <Image
              key={`${image}-${index}`}
              alt={`Post image ${index + 1} of ${images.length}`}
              src={image}
              height={200}
              width={200}
              className="rounded-md object-cover w-full h-32"
            />
          ))}
          {images.length > 3 && (
            <div className="relative">
              <Image
                alt={`Post image 4 of ${images.length}`}
                src={images[3]}
                height={200}
                width={200}
                className="rounded-md object-cover w-full h-32"
              />
              {extraCount > 0 && (
                <div className="absolute bottom-0 left-0 right-0 top-0 text-center bg-default/60 text-default-700 font-semibold flex items-center justify-center w-full rounded-md">
                  <span className="text-5xl">+{extraCount}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Media;
