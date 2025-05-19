import dynamic from "next/dynamic";

// Use dynamic imports with loading fallbacks for better performance
const HeroBanner = dynamic(() => import("@/components/home/hero-banner"), {
  loading: () => (
    <div className="h-[60vh] bg-gradient-to-r from-primary-900 to-primary-800 animate-pulse"></div>
  ),
});

const CategoryShowcase = dynamic(
  () => import("@/components/home/category-showcase"),
  {
    loading: () => (
      <div className="h-96 bg-gray-50 dark:bg-gray-900 animate-pulse"></div>
    ),
  }
);

const FeaturedProductsSection = dynamic(
  () => import("@/components/home/featured-products-section"),
  {
    loading: () => <div className="h-96 animate-pulse"></div>,
  }
);

const PromoBanner = dynamic(() => import("@/components/home/promo-banner"), {
  loading: () => <div className="h-48 bg-accent-900 animate-pulse"></div>,
});

const Testimonials = dynamic(() => import("@/components/home/testimonials"), {
  loading: () => (
    <div className="h-80 bg-gray-50 dark:bg-gray-900 animate-pulse"></div>
  ),
});

const NewsletterSection = dynamic(
  () => import("@/components/home/newsletter-section"),
  {
    loading: () => (
      <div className="h-64 bg-primary-50 dark:bg-primary-900/30 animate-pulse"></div>
    ),
  }
);

const NotificationBanner = dynamic(
  () => import("@/components/home/notification-banner"),
  {
    loading: () => <div className="h-12 bg-accent-900 animate-pulse"></div>,
  }
);

const SeasonalCollection = dynamic(
  () => import("@/components/home/seasonal-collection"),
  {
    loading: () => (
      <div className="h-96 bg-gray-50 dark:bg-gray-900 animate-pulse"></div>
    ),
  }
);

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Notification banner */}
      <NotificationBanner />

      {/* Hero Banner */}
      <HeroBanner />

      {/* Category Showcase Section */}
      <CategoryShowcase />

      {/* Featured Products Section */}
      <FeaturedProductsSection
        title="Best Sellers"
        viewAllLink="/products/featured"
      />

      {/* Promotional Banner */}
      <PromoBanner />

      {/* Seasonal Collection */}
      <SeasonalCollection />

      {/* Another Featured Collection */}
      <FeaturedProductsSection
        collectionSlug="new-arrivals"
        viewAllLink="/collections/new-arrivals"
      />

      {/* Customer Testimonials */}
      <Testimonials />

      {/* Newsletter Sign-up Section */}
      <NewsletterSection />
    </div>
  );
}
