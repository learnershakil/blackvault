"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface ProductImageZoomProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export default function ProductImageZoom({
  src,
  alt,
  width = 500,
  height = 500,
}: ProductImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isMagnifierVisible, setIsMagnifierVisible] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLDivElement>(null);

  // Toggle zoom mode
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
    setIsMagnifierVisible(false);
  };

  // Handle mouse movement for zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();

    // Calculate position for zoom view
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });

    // Calculate position for magnifier
    if (!isZoomed) {
      setMagnifierPosition({
        x: e.clientX - left - 50,
        y: e.clientY - top - 50,
      });
    }
  };

  // Handle mouse enter for magnifier
  const handleMouseEnter = () => {
    if (!isZoomed) {
      setIsMagnifierVisible(true);
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsMagnifierVisible(false);
    if (isZoomed) {
      setIsZoomed(false);
    }
  };

  return (
    <div className="relative">
      {/* Container for main image */}
      <motion.div
        ref={imageRef}
        className={`relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 ${
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
        }`}
        style={{ width: `${width}px`, height: `${height}px` }}
        onClick={toggleZoom}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: isZoomed ? 1 : 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Main Image */}
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`(max-width: 768px) 100vw, ${width}px`}
          className="object-cover"
          priority
          quality={90}
        />

        {/* Magnifier Lens */}
        <AnimatePresence>
          {isMagnifierVisible && !isZoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute w-[100px] h-[100px] border-2 border-white/80 rounded-full pointer-events-none z-10"
              style={{
                left: `${magnifierPosition.x}px`,
                top: `${magnifierPosition.y}px`,
                boxShadow: "0 0 0 1px rgba(0,0,0,0.3)",
                background: `url(${src})`,
                backgroundSize: `${width * 2}px ${height * 2}px`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: `${-magnifierPosition.x * 2}px ${
                  -magnifierPosition.y * 2
                }px`,
              }}
            />
          )}
        </AnimatePresence>

        {/* Zoom Overlay */}
        <AnimatePresence>
          {isZoomed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white dark:bg-gray-900 z-10"
              style={{
                backgroundImage: `url(${src})`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                backgroundSize: "250%",
                backgroundRepeat: "no-repeat",
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Zoom indicator */}
      <div className="absolute bottom-3 right-3 bg-white/80 dark:bg-black/60 backdrop-blur-sm p-2 rounded-full">
        <motion.svg
          animate={isZoomed ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.5 }}
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          )}
        </motion.svg>
      </div>
    </div>
  );
}
