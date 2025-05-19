import { CacheConfig } from "swr";

// Cache configuration for SWR
export const swrConfig: CacheConfig = {
  revalidateOnFocus: false, // Don't revalidate when window focuses
  revalidateIfStale: false, // Don't automatically revalidate stale data
  revalidateOnReconnect: true, // Revalidate when browser regains network connection
  dedupingInterval: 2000, // Deduping interval
};

// Cache time values in seconds
export const CACHE_TIMES = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 1800, // 30 minutes
  VERY_LONG: 86400, // 1 day
  STATIC: 604800, // 1 week
};

// Configure HTTP cache headers based on cache type
export function getCacheControlHeader(type: keyof typeof CACHE_TIMES): string {
  const seconds = CACHE_TIMES[type];
  return `public, max-age=${seconds}, stale-while-revalidate=${Math.round(
    seconds * 0.5
  )}`;
}

// Helper to set cache headers for API routes
export function setCacheHeaders(
  headers: Headers,
  type: keyof typeof CACHE_TIMES
) {
  headers.set("Cache-Control", getCacheControlHeader(type));
}
