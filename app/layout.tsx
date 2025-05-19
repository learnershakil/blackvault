import "./globals.css";
import "@/lib/styles.css";

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { auth } from "@/lib/auth";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CartProvider from "@/components/cart/cart-provider";
import PageTransition from "@/components/transitions/page-transition";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "BlackVault - Premium Audio Equipment",
  description: "Shop the best headphones, earbuds, and speakers at BlackVault.",
};

// Fix the viewport metadata warning by moving it to a separate export
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans min-h-screen flex flex-col`}
      >
        <CartProvider>
          <ToastProvider>
            <Header session={session} />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
