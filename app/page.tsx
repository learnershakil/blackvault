import dynamic from "next/dynamic";

// Use dynamic imports with loading fallbacks for better performance
const HeroSection = dynamic(() => import("@/components/home/hero-section"), {
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

const FeaturedProducts = dynamic(
  () => import("@/components/home/featured-products"),
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

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section with dynamic product slider */}
      <HeroSection />

      {/* Category Showcase Section */}
      <CategoryShowcase />

      {/* Featured Products Carousel */}
      <FeaturedProducts />

      {/* Promotional Banner */}
      <PromoBanner />

      {/* Customer Testimonials */}
      <Testimonials />

      {/* Newsletter Sign-up Section */}
      <NewsletterSection />
    </div>
  );
}
