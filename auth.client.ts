"use client";
// This file contains client-safe authentication exports
// No server-only imports are allowed here

// Types we need
import type { Session } from "next-auth";

// Client-side authentication methods
// The actual implementation of these is loaded dynamically
// since import from 'next-auth' is safe in client components
export const signOut = async (options?: any) => {
  const { signOut } = await import("next-auth/react");
  return signOut(options);
};

export const signIn = async (provider: string, options?: any) => {
  const { signIn } = await import("next-auth/react");
  return signIn(provider, options);
};

// Function to safely get user role without server-only imports
export const getUserRole = (session: Session | null) => {
  return session?.user?.role || "GUEST";
};
