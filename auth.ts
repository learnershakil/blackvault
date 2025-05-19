// Root auth.ts file for server-side authentication
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";

// Create a combined config for both API routes and middleware
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: authConfig.pages,
  providers: authConfig.providers,
  callbacks: {
    // For middleware
    authorized({ auth, request }) {
      return true; // Middleware.ts will handle the actual authorization
    },
    // For JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // For session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
