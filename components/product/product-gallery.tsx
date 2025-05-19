"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  isDefault: boolean;
}

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(
    images.find((img) => img.isDefault) || images[0] || null
  );
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // Handle image hover for zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    // Get the position of the cursor within the image container
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  // Toggle zoom
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  // Handle thumbnail click
  const handleThumbnailClick = (image: ProductImage) => {
    setSelectedImage(image);
    setIsZoomed(false);
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Thumbnails */}
      <div className="col-span-2 space-y-3 max-h-[500px] overflow-y-auto pr-2 hide-scrollbar">
        {images.map((image) => (
          <motion.button
            key={image.id}
            onClick={() => handleThumbnailClick(image)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full aspect-square rounded border-2 transition-all duration-200 overflow-hidden ${
              selectedImage?.id === image.id
                ? "border-primary-600 dark:border-primary-400"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            <div className="w-full h-full relative">
              <Image
                src={image.url}
                alt={image.alt || productName}
                fill
                sizes="(max-width: 768px) 50px, 80px"
                className="object-cover"
              />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Main image */}
      <div className="col-span-10">
        <motion.div
          className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border border-gray-200 dark:border-gray-700 ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={toggleZoom}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isZoomed && setIsZoomed(false)}
          whileHover={!isZoomed ? { scale: 1.02 } : {}}
          transition={{ duration: 0.3 }}
          layout
        >
          {selectedImage ? (
            <>
              {/* Regular image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full relative"
                >
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.alt || productName}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Zoomed image with animated entrance */}
              <AnimatePresence>
                {isZoomed && (
                  <motion.div
                    className="absolute inset-0 w-full h-full z-10 bg-white dark:bg-gray-900"
                    style={{
                      backgroundImage: `url(${selectedImage.url})`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundSize: "250%",
                      backgroundRepeat: "no-repeat",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  ></motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
              <svg
                className="w-16 h-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Zoom in/out indicator with animation */}
          <motion.div
            className="absolute bottom-4 right-4 bg-white/80 dark:bg-black/60 backdrop-blur-sm p-2 rounded-full z-20"
            animate={isZoomed ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isZoomed ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm3 0a6 6 0 11-12 0 6 6 0 0112 0zm-9 0a3 3 0 100-6 3 3 0 000 6z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                />
              )}
            </svg>
          </motion.div>
        </motion.div>

        {/* Image counter */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {images.findIndex((img) => img.id === selectedImage?.id) + 1} /{" "}
          {images.length}
        </p>
      </div>
    </div>
  );
}
