import { TPost } from "@/types/TPost";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import React from "react";

const Media = ({ posts }: { posts: TPost[] }) => {
  const images = posts?.flatMap((post: TPost) => post.images ?? []);

  return (
    <div className="bg-default-50 shadow-md rounded-lg p-6 mb-6 ">
      <div className="flex justify-between items-center gap-5 mb-4">
        <h2 className="text-xl font-semibold ">Media</h2>
        <Button
          variant="ghost"
          className="border-secondary text-secondary hover:text-default-50 hover:bg-secondary"
        >
          See All
        </Button>
      </div>
      <div className="grid grid-cols-2  gap-4">
        {images?.slice(0, 3)?.map((image: string, index: number) => (
          <Image
            key={index}
            alt="post image"
            src={image}
            height={200}
            width={200}
          />
        ))}
        {images?.length > 3 && (
          <div className="relative">

            <Image
              key={1}
              alt="post image"
              src={images[3]}
              height={200}
              width={200}
            />
            <div className="bg-opacity-50 absolute bottom-0 left-0 right-0 top-0 text-center  bg-default  text-default-700 font-semibold flex items-center justify-center w-full">
              <h2 className="text-5xl ">

              +{(images.length - 3).toString()}
              </h2>
  
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Media;
