"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Sarah J.",
    role: "Music Producer",
    image: "/images/testimonial-1.jpg", // Add actual images later
    quote:
      "The sound quality of BlackVault headphones is exceptional. I use them every day in my studio and they never disappoint.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael T.",
    role: "Frequent Traveler",
    image: "/images/testimonial-2.jpg", // Add actual images later
    quote:
      "I've tried many noise-cancelling headphones, but these are by far the best. Perfect for long flights and busy environments.",
    rating: 5,
  },
  {
    id: 3,
    name: "Elena R.",
    role: "Fitness Enthusiast",
    image: "/images/testimonial-3.jpg", // Add actual images later
    quote:
      "The wireless earbuds are sweat-resistant and stay put during my most intense workouts. The battery life is impressive too!",
    rating: 4,
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary-600 font-medium mb-3 inline-block">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it — hear from some of our satisfied
            customers!
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative h-80">
            <AnimatePresence mode="wait">
              {testimonials.map(
                (testimonial, index) =>
                  index === activeIndex && (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg absolute inset-0"
                    >
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <svg
                            className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-6"
                            fill="currentColor"
                            viewBox="0 0 32 32"
                          >
                            <path d="M10 8v8H6c0 4.4 3.6 8 8 8v-4c-2.2 0-4-1.8-4-4h8V8h-8zm16 0v8h-4c0 4.4 3.6 8 8 8v-4c-2.2 0-4-1.8-4-4h8V8h-8z" />
                          </svg>

                          <p className="text-lg md:text-xl font-medium mb-6">
                            "{testimonial.quote}"
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {/* Replace with actual image when available */}
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4 flex items-center justify-center text-gray-500 dark:text-gray-400">
                              {testimonial.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-semibold">
                                {testimonial.name}
                              </h4>
                              <p className="text-muted-foreground text-sm">
                                {testimonial.role}
                              </p>
                            </div>
                          </div>

                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-5 h-5 ${
                                  i < testimonial.rating
                                    ? "text-yellow-500"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 mx-1 rounded-full transition-all ${
                  index === activeIndex
                    ? "bg-primary-600 w-8"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                aria-label={`Show testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
