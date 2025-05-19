"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BannerCarousel from "@/components/banner/banner-carousel";

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

export default function HeroBanner() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Default banner to use if API call fails or returns no results
  const defaultBanner: Banner = {
    id: "default",
    title: "Premium Audio Experience",
    subtitle: "New Collection",
    description:
      "Discover our latest range of premium headphones and speakers for an immersive audio experience.",
    imageUrl: "/images/banners/hero-banner.jpg",
    linkUrl: "/products",
    linkText: "Shop Now",
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(
          "/api/admin/banners?position=HERO&active=true"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch banners");
        }

        const data = await response.json();

        if (data && data.length > 0) {
          setBanners(data);
        } else {
          // Use default banner if no active banners found
          setBanners([defaultBanner]);
        }
      } catch (error) {
        console.error("Error fetching hero banners:", error);
        setBanners([defaultBanner]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-[500px] rounded-lg"></div>
    );
  }

  return <BannerCarousel banners={banners} />;
}
