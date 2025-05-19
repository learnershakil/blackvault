import { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CartDrawer from "@/components/cart/cart-drawer";
import { NextAuthProvider } from "@/providers/next-auth-provider";

// Add fallback fonts in case Google Fonts fail to load
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  fallback: ["system-ui", "arial"],
  display: "swap",
  weight: ["400", "500", "600", "700"], // Add specific weights if needed
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  fallback: ["monospace"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BlackVault - Premium Audio Products",
  description:
    "Shop the latest headphones, earbuds, and speakers with premium sound quality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100`}
      >
        <NextAuthProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <CartDrawer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
