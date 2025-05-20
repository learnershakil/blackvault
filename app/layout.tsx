import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ClientWrapper from "@/components/client-wrapper";
import Header from "@/components/layout/header-client";
import Footer from "@/components/layout/footer";
import Providers from "./providers";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "BlackVault E-commerce",
  description: "Modern E-commerce Platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get session for header component
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${GeistSans.variable} font-sans min-h-screen flex flex-col`}
      >
        <Providers>
          <ThemeProvider>
            <ClientWrapper>
              <div className="flex flex-col min-h-screen">
                <Header session={session} />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
            </ClientWrapper>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
