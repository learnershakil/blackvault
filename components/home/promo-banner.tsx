"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PromoBannerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryLink?: {
    text: string;
    href: string;
  };
  discount?: string;
  backgroundColor?: string;
  textColor?: string;
  imageUrl?: string;
}

export default function PromoBanner({
  title = "Summer Sale: Up to 40% Off",
  subtitle = "Limited Time Offer",
  description = "Get incredible discounts on selected headphones, earbuds and speakers. Don't miss out on our biggest sale of the season!",
  buttonText = "Shop the Sale",
  buttonLink = "/products/sale",
  secondaryLink = { text: "View All Deals", href: "/products/deals" },
  discount = "40%",
  backgroundColor = "from-accent-900 to-accent-800",
  textColor = "text-white",
  imageUrl,
}: PromoBannerProps) {
  const [bannerData, setBannerData] = useState<PromoBannerProps | null>(null);

  // Fetch active promotional banner if no props are provided
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        // Only fetch if minimal props were provided
        if (!title && !description) {
          const response = await fetch(
            "/api/admin/banners?position=FEATURED&active=true"
          );
          if (response.ok) {
            const banners = await response.json();
            if (banners && banners.length > 0) {
              const activeBanner = banners[0];
              setBannerData({
                title: activeBanner.title,
                subtitle: activeBanner.subtitle,
                description: activeBanner.description,
                buttonText: activeBanner.linkText || "Shop Now",
                buttonLink: activeBanner.linkUrl || "/products",
                backgroundColor:
                  activeBanner.bgColor || "from-accent-900 to-accent-800",
                textColor: activeBanner.textColor || "text-white",
                imageUrl: activeBanner.imageUrl,
              });
              return;
            }
          }
        }

        // Use provided props as fallback
        setBannerData({
          title,
          subtitle,
          description,
          buttonText,
          buttonLink,
          secondaryLink,
          discount,
          backgroundColor,
          textColor,
          imageUrl,
        });
      } catch (error) {
        console.error("Error fetching promotional banner:", error);
        // Use provided props as fallback
        setBannerData({
          title,
          subtitle,
          description,
          buttonText,
          buttonLink,
          secondaryLink,
          discount,
          backgroundColor,
          textColor,
          imageUrl,
        });
      }
    };

    fetchBanner();
  }, [
    title,
    subtitle,
    description,
    buttonText,
    buttonLink,
    secondaryLink,
    discount,
    backgroundColor,
    textColor,
    imageUrl,
  ]);

  if (!bannerData) {
    return null;
  }

  return (
    <section
      className={`py-16 bg-gradient-to-r ${bannerData.backgroundColor} ${bannerData.textColor}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <span className="inline-block py-1 px-3 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              {bannerData.subtitle}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {bannerData.title}
            </h2>
            <p className="text-lg opacity-90 max-w-lg mb-6">
              {bannerData.description}
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button
                size="lg"
                className="bg-white text-accent-900 hover:bg-white/90"
                asChild
              >
                <Link href={bannerData.buttonLink || "/products"}>
                  {bannerData.buttonText}
                </Link>
              </Button>
              {bannerData.secondaryLink && (
                <Link
                  href={bannerData.secondaryLink.href}
                  className="inline-flex items-center text-white hover:underline underline-offset-4 font-medium"
                >
                  {bannerData.secondaryLink.text}
                  <svg
                    className="ml-2 w-5 h-5"
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
                </Link>
              )}
            </div>
          </div>

          <div className="md:w-1/3 flex justify-center">
            {bannerData.imageUrl ? (
              <img
                src={bannerData.imageUrl}
                alt={bannerData.title}
                className="max-h-64 object-contain"
              />
            ) : bannerData.discount ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 relative">
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-white/30 animate-spin-slow"></div>
                <div className="bg-white/10 rounded-full p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold">
                      {bannerData.discount}
                    </div>
                    <div className="uppercase tracking-wider font-medium">
                      Off
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
