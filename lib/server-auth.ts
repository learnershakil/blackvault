// Server-only authentication utilities
import "server-only";
import { auth } from "@/auth";
import type { Session } from "next-auth";

// Get the current server session
export const getServerSession = async () => {
  return await auth();
};

// Check if user is authenticated on the server
export const isAuthenticated = async () => {
  const session = await getServerSession();
  return !!session?.user;
};

// Check if user is an admin on the server
export const isAdmin = async () => {
  const session = await getServerSession();
  return session?.user?.role === "ADMIN";
};

// Get user role on the server
export const getUserRole = async () => {
  const session = await getServerSession();
  return session?.user?.role || "GUEST";
};
