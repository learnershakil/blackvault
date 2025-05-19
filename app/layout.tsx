import { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";
import { CartProvider } from "@/components/providers/cart-provider";
import AccessibilityWidget from "@/components/layout/accessibility-widget";
import { OrganizationStructuredData } from "@/components/seo/structured-data";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: {
    default: "BlackVault Audio | Premium Sound Equipment",
    template: "%s | BlackVault Audio",
  },
  description:
    "Experience superior sound with BlackVault's premium headphones, speakers, and audio accessories. Discover audiophile-grade equipment for music lovers.",
  keywords: [
    "audio equipment",
    "headphones",
    "speakers",
    "earbuds",
    "BlackVault",
    "premium sound",
    "audiophile",
  ],
  authors: [
    {
      name: "BlackVault Team",
    },
  ],
  creator: "BlackVault Audio",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "BlackVault Audio | Premium Sound Equipment",
    description:
      "Experience superior sound with BlackVault's premium headphones, speakers, and audio accessories.",
    siteName: "BlackVault Audio",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlackVault Audio | Premium Sound Equipment",
    description:
      "Experience superior sound with BlackVault's premium headphones, speakers, and audio accessories.",
    creator: "@blackvaultaudio",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${process.env.NEXT_PUBLIC_APP_URL}/site.webmanifest`,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>{/* Include your Google Analytics script here */}</head>
      <body className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
        {/* Organization Structured Data */}
        <OrganizationStructuredData />

        {/* Add accessibility styles */}
        <style jsx global>{`
          .high-contrast {
            filter: contrast(1.5);
          }
          .inverted-colors {
            filter: invert(1) hue-rotate(180deg);
          }

          /* Focus styles for better accessibility */
          :focus-visible {
            outline: 3px solid #0066ff !important;
            outline-offset: 2px;
          }

          /* For screen readers only */
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            border: 0;
          }
        `}</style>

        {/* Skip to content link for keyboard users */}
        <a
          href="#main-content"
          className="fixed top-0 left-0 p-3 m-3 bg-primary-600 text-white transform -translate-y-full focus:translate-y-0 transition z-50"
        >
          Skip to main content
        </a>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
              <Toaster />
              <AccessibilityWidget />
            </div>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
