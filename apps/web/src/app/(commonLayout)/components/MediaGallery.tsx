"use client";
import React from "react";
import Image from "next/image";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { ImageIcon } from "lucide-react";

// Function to get grid layout class based on number of images
const getGridLayout = (count: number) => {
  switch (count) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-3";
    case 4:
      return "grid-cols-2";
    default:
      return "grid-cols-3";
  }
};

// Function to get image height class based on position and count
const getImageHeight = (index: number, count: number) => {
  if (count === 1) return "h-[400px]";
  if (count === 2) return "h-[350px]";
  if (count === 3) {
    return index === 0 ? "h-[400px]" : "h-[195px]";
  }
  if (count === 4) return "h-[250px]";
  if (count >= 5) {
    if (index < 2) return "h-[280px]";
    return "h-[185px]";
  }
  return "h-[250px]";
};

// Function to get special layout classes
const getSpecialClasses = (index: number, count: number) => {
  if (count === 3 && index === 0) {
    return "row-span-2";
  }
  return "";
};

const renderMedia = (media: string[], maxVisible: number = 5) => {
  const visibleMedia = media.slice(0, maxVisible);
  const remainingCount = media.length - maxVisible;

  return visibleMedia.map((item, index) => {
    const isLast = index === maxVisible - 1 && remainingCount > 0;
    
    return (
      <a
        key={index}
        href={item}
        data-lg-size="1600-2400"
        data-sub-html={`<h4>Image ${index + 1} of ${media.length}</h4>`}
        className={`
          relative overflow-hidden rounded-xl group cursor-pointer
          ${getSpecialClasses(index, media.length)}
          transition-transform duration-200 hover:scale-[0.98]
        `}
      >
        <div className="relative w-full h-full">
          <Image
            width={800}
            height={800}
            src={item}
            alt={`Image ${index + 1}`}
            className={`
              w-full object-cover
              ${getImageHeight(index, media.length)}
              transition-all duration-300
              group-hover:brightness-95
            `}
            priority={index < 2}
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
          
          {/* Zoom Icon on Hover */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/60 backdrop-blur-sm rounded-full p-2">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Remaining Images Overlay */}
          {isLast && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-4xl font-bold">+{remainingCount}</div>
                <div className="text-sm font-medium mt-1">More Images</div>
              </div>
            </div>
          )}
        </div>
      </a>
    );
  });
};

const MediaGallery = ({ media }: { media: string[] }) => {
  if (!media || media.length === 0) return null;

  console.log(media)
  return (
    <div className="MediaGallery w-full">
      <LightGallery
        elementClassNames={`
          grid gap-2 
          ${getGridLayout(media.length)}
          ${media.length === 3 ? 'grid-rows-2' : ''}
        `}
        plugins={[lgThumbnail, lgZoom]}
        speed={500}
        download={false}
        counter={true}
        licenseKey="your-license-key"
        mobileSettings={{
          controls: true,
          showCloseIcon: true,
        }}
      >
        {renderMedia(media, 5)}
      </LightGallery>

      {/* Custom Styles */}
      <style jsx global>{`
        .lg-backdrop {
          background-color: rgba(0, 0, 0, 0.95);
        }
        
        .lg-toolbar {
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
        }
        
        .lg-sub-html {
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          padding: 15px;
          font-size: 16px;
        }
        
        .lg-thumb-outer {
          background-color: rgba(0, 0, 0, 0.8);
        }
        
        .lg-thumb-item {
          border-radius: 8px;
          overflow: hidden;
        }
        
        .lg-thumb-item.active {
          border-color: rgb(59, 130, 246);
        }
      `}</style>
    </div>
  );
};

export default MediaGallery;