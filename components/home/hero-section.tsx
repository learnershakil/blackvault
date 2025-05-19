"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type HeroSlide = {
  title: string;
  description: string;
  imageUrl: string;
  bgColor: string;
};

const heroSlides: HeroSlide[] = [
  {
    title: "Experience Sound Like Never Before",
    description:
      "Immerse yourself in crystal-clear audio with our premium headphones designed for the perfect listening experience.",
    imageUrl: "/images/hero-headphones.png", // This would be a placeholder until you add the actual image
    bgColor: "from-primary-900 to-primary-800",
  },
  {
    title: "Feel The Bass, Anywhere",
    description:
      "Take your music everywhere with portable speakers that deliver powerful, room-filling sound in a compact design.",
    imageUrl: "/images/hero-speaker.png", // This would be a placeholder until you add the actual image
    bgColor: "from-secondary-900 to-secondary-800",
  },
  {
    title: "True Wireless Freedom",
    description:
      "No wires, no limits. Experience exceptional sound quality with our latest wireless earbuds.",
    imageUrl: "/images/hero-earbuds.png", // This would be a placeholder until you add the actual image
    bgColor: "from-accent-900 to-accent-800",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsAnimating(false);
      }, 500);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <section
      className={`bg-gradient-to-r ${slide.bgColor} text-white py-16 md:py-24 overflow-hidden relative`}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-white opacity-5 rounded-full translate-y-1/2"></div>

      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div
          className={`md:w-1/2 space-y-6 mb-8 md:mb-0 transition-all duration-500 ${
            isAnimating
              ? "opacity-0 translate-y-8"
              : "opacity-100 translate-y-0"
          }`}
        >
          <span className="inline-block py-1 px-3 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-2">
            NEW ARRIVAL
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            {slide.title}
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-md">
            {slide.description}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button
              size="lg"
              className="bg-white text-primary-900 hover:bg-white/90 shadow-lg shadow-black/10"
            >
              Shop Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10"
            >
              Explore Collection
            </Button>
          </div>

          {/* Slide indicators */}
          <div className="flex space-x-2 pt-4">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentSlide === index ? "bg-white w-8" : "bg-white/40"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <div
            className={`relative w-full max-w-lg aspect-square transition-all duration-500 ${
              isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full animate-spin-slow"></div>
            {/* Product image placeholder */}
            <div className="relative z-10 rounded-full overflow-hidden bg-white/5 backdrop-blur-sm p-8 aspect-square flex items-center justify-center shadow-2xl shadow-black/20 border border-white/10">
              <div className="relative w-full h-full">
                {/* Replace with actual product image when available */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-40 h-40 bg-white/10 rounded-full mx-auto mb-4"></div>
                    <h2 className="text-xl font-bold">Premium Headphones</h2>
                    <p className="text-sm opacity-70">
                      Replace with product image
                    </p>
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
