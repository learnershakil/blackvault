"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NotificationBannerProps {
  message?: string;
  linkText?: string;
  linkUrl?: string;
  bgColor?: string;
  textColor?: string;
}

export default function NotificationBanner({
  message: defaultMessage,
  linkText: defaultLinkText,
  linkUrl: defaultLinkUrl,
  bgColor = "bg-primary-600",
  textColor = "text-white",
}: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [bannerData, setBannerData] = useState({
    message: defaultMessage || "Free shipping on orders over $100",
    linkText: defaultLinkText,
    linkUrl: defaultLinkUrl,
    bgColor,
    textColor,
  });

  useEffect(() => {
    const fetchBanner = async () => {
      if (defaultMessage) {
        // If a message is provided through props, use it instead of fetching
        return;
      }

      try {
        const response = await fetch(
          "/api/admin/banners?position=NOTIFICATION&active=true"
        );
        if (response.ok) {
          const banners = await response.json();
          if (banners && banners.length > 0) {
            const banner = banners[0];
            setBannerData({
              message: banner.title,
              linkText: banner.linkText || null,
              linkUrl: banner.linkUrl || null,
              bgColor: banner.bgColor || bgColor,
              textColor: banner.textColor || textColor,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching notification banner:", error);
      }
    };

    fetchBanner();
  }, [defaultMessage, defaultLinkText, defaultLinkUrl, bgColor, textColor]);

  if (!isVisible || !bannerData.message) {
    return null;
  }

  return (
    <div className={`py-2 ${bannerData.bgColor} ${bannerData.textColor}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <span>{bannerData.message}</span>
            {bannerData.linkText && bannerData.linkUrl && (
              <Link
                href={bannerData.linkUrl}
                className="font-medium underline hover:opacity-80"
              >
                {bannerData.linkText}
              </Link>
            )}
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="hover:opacity-80"
            aria-label="Close banner"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
