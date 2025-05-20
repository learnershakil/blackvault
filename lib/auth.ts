"use client";
// Client-safe authentication utilities
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
// Import client-safe auth utilities
import { signIn, signOut, getUserRole as getRole } from "@/auth.client";

// Custom hook to access session data in client components
export const useAuth = () => {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user;

  return {
    session,
    isLoading,
    isAuthenticated,
    user: session?.user,
    isAdmin: session?.user?.role === "ADMIN",
  };
};

// Get the user's role as a string
export const getUserRole = (session: Session | null) => {
  return getRole(session);
};

// Re-export client-safe utilities
export { signIn, signOut };
