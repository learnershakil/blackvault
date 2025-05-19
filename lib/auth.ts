// Client-safe authentication utilities
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";

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
  return session?.user?.role || "GUEST";
};

// auth.ts configuration
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { auth, signIn, signOut } = NextAuth({
  // Adapter to store sessions and users in the database
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Input validation
        const result = loginSchema.safeParse(credentials);

        if (!result.success) {
          return null;
        }

        const { email, password } = result.data;

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return null;
        }

        // Return user without password
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});

// Define a specific auth type for middleware usage
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdminPage = request.nextUrl.pathname.startsWith("/admin");

      if (isOnAdminPage) {
        if (!isLoggedIn) return false;
        const isAdmin = auth?.user?.role === "ADMIN";
        if (!isAdmin) return false;
        return true;
      }

      return true;
    },
  },
  providers: [], // Auth providers configured in the main export
};
