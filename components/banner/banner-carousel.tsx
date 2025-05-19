"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Banner {
  id: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  imageUrl: string;
  imageAlt?: string | null;
  linkUrl?: string | null;
  linkText?: string | null;
  bgColor?: string | null;
  textColor?: string | null;
}

interface BannerCarouselProps {
  banners: Banner[];
  autoRotate?: boolean;
  interval?: number; // in milliseconds
  showIndicators?: boolean;
  showControls?: boolean;
}

export default function BannerCarousel({
  banners,
  autoRotate = true,
  interval = 5000,
  showIndicators = true,
  showControls = true,
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoRotate || banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoRotate, banners.length, interval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? banners.length - 1 : currentIndex - 1);
  };

  const goToNextSlide = () => {
    setCurrentIndex((currentIndex + 1) % banners.length);
  };

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Banner slides */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
            style={{
              backgroundColor: banner.bgColor || undefined,
              color: banner.textColor || undefined,
            }}
          >
            {/* Banner image */}
            <div className="absolute inset-0">
              <img
                src={banner.imageUrl}
                alt={banner.imageAlt || banner.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center">
              <div className="container mx-auto px-6">
                <div className="max-w-lg">
                  {banner.subtitle && (
                    <span className="inline-block px-3 py-1 mb-3 text-sm font-medium bg-primary-600 text-white rounded-full">
                      {banner.subtitle}
                    </span>
                  )}
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {banner.title}
                  </h2>
                  {banner.description && (
                    <p className="text-white/90 mb-6">{banner.description}</p>
                  )}
                  {banner.linkUrl && (
                    <Link href={banner.linkUrl}>
                      <Button size="lg">
                        {banner.linkText || "Learn More"}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel controls */}
      {showControls && banners.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white"
            onClick={goToPrevSlide}
            aria-label="Previous banner"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 text-white"
            onClick={goToNextSlide}
            aria-label="Next banner"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Slide indicators */}
      {showIndicators && banners.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
