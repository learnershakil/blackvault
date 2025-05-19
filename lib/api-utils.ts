import { NextRequest, NextResponse } from "next/server";
import { setCacheHeaders } from "./cache-config";

// Types for pagination
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Parse pagination parameters from query params
export function parsePaginationParams(request: NextRequest): PaginationParams {
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = Math.min(
    parseInt(searchParams.get("limit") || "10", 10),
    100 // Max limit to prevent overloading
  );

  return {
    page: Math.max(1, page), // Ensure page is at least 1
    limit,
  };
}

// Create a paginated response object
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  { page, limit }: PaginationParams
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      total,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

// Create an optimized API response with proper headers
export function optimizedResponse<T>(
  data: T,
  cacheType: "SHORT" | "MEDIUM" | "LONG" | "VERY_LONG" | "STATIC" = "MEDIUM",
  status = 200
): NextResponse<T> {
  const headers = new Headers();

  // Set cache headers
  setCacheHeaders(headers, cacheType);

  // Add compression hint
  headers.set("Vary", "Accept-Encoding");

  return NextResponse.json(data, {
    status,
    headers,
  });
}

// Create a field selector to minimize API payload
export function selectFields<T extends Record<string, any>>(
  obj: T,
  fields: string[]
): Partial<T> {
  if (!fields || fields.length === 0) return obj;

  return Object.fromEntries(
    fields.filter((field) => field in obj).map((field) => [field, obj[field]])
  ) as Partial<T>;
}
