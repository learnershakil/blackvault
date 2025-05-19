import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PromoBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-accent-900 to-accent-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 mb-8 md:mb-0">
            <span className="inline-block py-1 px-3 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              Limited Time Offer
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Summer Sale: Up to 40% Off
            </h2>
            <p className="text-lg opacity-90 max-w-lg mb-6">
              Get incredible discounts on selected headphones, earbuds and
              speakers. Don't miss out on our biggest sale of the season!
            </p>
            <div className="flex gap-4 flex-wrap">
              <Button
                size="lg"
                className="bg-white text-accent-900 hover:bg-white/90"
              >
                Shop the Sale
              </Button>
              <Link
                href="/products/deals"
                className="inline-flex items-center text-white hover:underline underline-offset-4 font-medium"
              >
                View All Deals
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="md:w-1/3 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 relative">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-white/30 animate-spin-slow"></div>
              <div className="bg-white/10 rounded-full p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold">40%</div>
                  <div className="uppercase tracking-wider font-medium">
                    Off
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
