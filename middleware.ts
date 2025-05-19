import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { CACHE_TIMES } from "./lib/cache-config";

// List of routes that require authentication
const authenticatedRoutes = ["/account", "/checkout", "/orders"];

// List of routes that require admin rights
const adminRoutes = ["/admin"];

// Define static file paths that can be cached longer
const STATIC_FILE_REGEX = /\.(jpe?g|png|svg|webp|avif|css|js|woff2?)$/;

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;
  const isAdmin = session?.user?.role === "ADMIN";
  const path = nextUrl.pathname;

  // Check if the route requires authentication
  const isAuthRoute = authenticatedRoutes.some((route) =>
    path.startsWith(route)
  );

  // Check if the route requires admin rights
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));

  // Handle login/register routes when already logged in
  if ((path === "/login" || path === "/register") && isLoggedIn) {
    return NextResponse.redirect(new URL("/account", nextUrl));
  }

  // Handle routes that require authentication
  if (isAuthRoute && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(path)}`, nextUrl)
    );
  }

  // Handle routes that require admin rights
  if (isAdminRoute && (!isLoggedIn || !isAdmin)) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Allow all other requests to proceed
  return NextResponse.next();
});

// Configure caching and compression
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get pathname from the request
  const pathname = request.nextUrl.pathname;

  // Apply different caching strategies based on the route
  if (STATIC_FILE_REGEX.test(pathname)) {
    // Static assets can be cached for longer periods
    response.headers.set(
      "Cache-Control",
      `public, max-age=${CACHE_TIMES.STATIC}, stale-while-revalidate=${CACHE_TIMES.LONG}`
    );
  } else if (pathname.startsWith("/api/products")) {
    // Product data can be cached for a medium duration
    response.headers.set(
      "Cache-Control",
      `public, max-age=${CACHE_TIMES.MEDIUM}, stale-while-revalidate=${CACHE_TIMES.SHORT}`
    );
  } else if (pathname.startsWith("/api/")) {
    // Default API caching - short-lived
    response.headers.set(
      "Cache-Control",
      `public, max-age=${CACHE_TIMES.SHORT}, stale-while-revalidate=0`
    );
  } else {
    // Standard pages - allow browser caching but revalidate
    response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  }

  // Set compression header hint
  response.headers.set("Vary", "Accept-Encoding");

  return response;
}

// See https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    // Apply to all routes except specific ones
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
