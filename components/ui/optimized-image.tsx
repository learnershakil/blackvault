"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  fill?: boolean;
  quality?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  loadingClassName?: string;
  onLoadComplete?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  quality = 80,
  priority = false,
  sizes = "100vw",
  className,
  imgClassName,
  loadingClassName,
  onLoadComplete,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Check if the image URL is external and handle it properly
  const isExternalImage =
    src && (src.startsWith("http://") || src.startsWith("https://"));

  // Handle placeholder shimmer effect
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <rect width="${w}" height="${h}" fill="#f4f4f5" />
      <rect id="r" width="${w}" height="${h}" fill="#e4e4e7" />
      <animate xlink:href="#r" attributeName="opacity" from="1" to="0.5" dur="2s" repeatCount="indefinite" />
    </svg>
  `;

  const toBase64 = (str: string) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    onLoadComplete?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        isLoading && loadingClassName,
        className
      )}
      style={{ width: fill ? "100%" : width, height: fill ? "100%" : height }}
    >
      {hasError ? (
        <div
          className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700"
          role="img"
          aria-label={alt}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400"
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
      ) : isExternalImage ? (
        // For external images, use unoptimized option to avoid hostname config issues
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          quality={quality}
          priority={priority}
          sizes={sizes}
          unoptimized={true}
          placeholder={`data:image/svg+xml;base64,${toBase64(
            shimmer(width, height)
          )}`}
          onLoadingComplete={handleLoadingComplete}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300 ease-in-out",
            isLoading ? "opacity-0" : "opacity-100",
            imgClassName
          )}
        ></Image>
      ) : (
        // For internal images, use normal optimization
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          quality={quality}
          priority={priority}
          sizes={sizes}
          placeholder={`data:image/svg+xml;base64,${toBase64(
            shimmer(width, height)
          )}`}
          onLoadingComplete={handleLoadingComplete}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300 ease-in-out",
            isLoading ? "opacity-0" : "opacity-100",
            imgClassName
          )}
        />
      )}
    </div>
  );
}
