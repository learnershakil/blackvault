import { NextResponse } from "next/server";
import { auth } from "./auth";

// List of routes that require authentication
const authenticatedRoutes = ["/account", "/checkout", "/orders"];

// List of routes that require admin rights
const adminRoutes = ["/admin"];

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

// See https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.png$).*)",
  ],
};
