import type { NextConfig } from "next";

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
      "i.ytimg.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  // Configure compression
  compress: true,

  // Optimize API endpoints to be compiled as Edge Functions where possible
  serverExternalPackages: ["@prisma/client"], // Fixed from serverComponentsExternalPackages

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

  // Updated experimental options
  experimental: {
    // Enable next.js gzip compression
    optimizeCss: true,
  },
};

export default nextConfig;
