import dynamic from "next/dynamic";
import Link from "next/link";

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

      {/* Welcome Section */}
      <div className="container mx-auto px-4 py-12">
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-6">
            Welcome to BlackVault Audio
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Premium quality audio equipment for true audiophiles. Discover our
            collection of headphones, speakers, and accessories.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/products"
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
