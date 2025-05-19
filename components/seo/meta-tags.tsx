import Head from "next/head";
import { useRouter } from "next/router";

interface MetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  canonicalUrl?: string;
  noindex?: boolean;
}

const siteConfig = {
  name: "BlackVault Audio",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://blackvault.com",
  description: "Premium audio products for audiophiles",
  ogImage: "/images/social-card.png",
};

export default function MetaTags({
  title,
  description,
  keywords,
  ogImage,
  ogType = "website",
  canonicalUrl,
  noindex = false,
}: MetaTagsProps) {
  const router = useRouter();

  // Construct the page title
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;

  // Use provided description or fallback to site description
  const pageDescription = description || siteConfig.description;

  // Construct canonical URL
  const canonical = canonicalUrl || `${siteConfig.url}${router.asPath}`;

  // Use provided OG image or fallback to site OG image
  const socialImage = `${siteConfig.url}${ogImage || siteConfig.ogImage}`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Indexing Control */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Canonical Link */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph Tags */}
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={socialImage} />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@blackvaultaudio" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={socialImage} />

      {/* Viewport Meta Tag */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
}
