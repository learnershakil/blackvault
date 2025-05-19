import React from "react";
import Head from "next/head";

interface ProductStructuredDataProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    slug: string;
    images: { url: string }[];
    category: { name: string };
    sku: string;
    stock: number;
    reviews?: {
      rating: number;
      count: number;
    };
  };
}

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://blackvault.com";

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.sku,
    mpn: product.id,
    image: product.images.map((img) => img.url),
    url: `${baseUrl}/products/${product.slug}`,
    category: product.category.name,
    brand: {
      "@type": "Brand",
      name: "BlackVault Audio",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      priceValidUntil: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      itemCondition: "https://schema.org/NewCondition",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "BlackVault Audio",
      },
    },
  };

  // Add review data if available
  if (
    product.reviews &&
    product.reviews.rating > 0 &&
    product.reviews.count > 0
  ) {
    Object.assign(structuredData, {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.reviews.rating,
        reviewCount: product.reviews.count,
      },
    });
  }

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
}

interface BreadcrumbStructuredDataProps {
  items: {
    name: string;
    url: string;
  }[];
}

export function BreadcrumbStructuredData({
  items,
}: BreadcrumbStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://blackvault.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
}

interface OrganizationStructuredDataProps {
  name?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
}

export function OrganizationStructuredData({
  name = "BlackVault Audio",
  url = "https://blackvault.com",
  logo = "/images/logo.png",
  sameAs = [
    "https://facebook.com/blackvaultaudio",
    "https://instagram.com/blackvaultaudio",
  ],
}: OrganizationStructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://blackvault.com";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: baseUrl,
    logo: `${baseUrl}${logo}`,
    sameAs,
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
}
