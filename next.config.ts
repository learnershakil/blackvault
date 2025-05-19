import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  // Enable React strict mode for development
  reactStrictMode: true,

  // Image optimization settings
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    formats: ["image/webp", "image/avif"],
    domains: [
      // Add allowed image domains here
      "res.cloudinary.com",
      "images.unsplash.com",
      "via.placeholder.com",
      "localhost",
    ],
  },

  // Configure compression
  compress: true,

  // Enable response compression
  experimental: {
    // Enable next.js gzip compression
    optimizeCss: true,
    // Enable browser React optimization
    optimizeServerReact: true,
  },

  // Configure Content Security Policy
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },

  // Optimize API endpoints to be compiled as Edge Functions where possible
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
};

// Export the config with any needed wrappers
export default nextConfig;
