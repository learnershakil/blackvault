"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  {
    name: "Headphones",
    description: "Over-ear and on-ear headphones with noise cancellation",
    image: "/images/category-headphones.jpg", // Add actual images later
    color: "bg-blue-50 dark:bg-blue-900/20",
    textColor: "text-blue-800 dark:text-blue-200",
    borderColor: "border-blue-200 dark:border-blue-800",
    href: "/products/category/headphones",
  },
  {
    name: "Wireless Earbuds",
    description: "Compact earbuds with high-fidelity sound",
    image: "/images/category-earbuds.jpg", // Add actual images later
    color: "bg-purple-50 dark:bg-purple-900/20",
    textColor: "text-purple-800 dark:text-purple-200",
    borderColor: "border-purple-200 dark:border-purple-800",
    href: "/products/category/wireless-earbuds",
  },
  {
    name: "Speakers",
    description: "Portable and home speakers for immersive sound",
    image: "/images/category-speakers.jpg", // Add actual images later
    color: "bg-amber-50 dark:bg-amber-900/20",
    textColor: "text-amber-800 dark:text-amber-200",
    borderColor: "border-amber-200 dark:border-amber-800",
    href: "/products/category/speakers",
  },
  {
    name: "Accessories",
    description: "Cables, cases, and more to enhance your audio experience",
    image: "/images/category-accessories.jpg", // Add actual images later
    color: "bg-emerald-50 dark:bg-emerald-900/20",
    textColor: "text-emerald-800 dark:text-emerald-200",
    borderColor: "border-emerald-200 dark:border-emerald-800",
    href: "/products/category/accessories",
  },
];

export default function CategoryShowcase() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="text-primary-600 font-medium mb-3 inline-block">
            Browse Our Collections
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop By Category
          </h2>
          <p className="text-muted-foreground">
            Explore our wide range of premium audio products designed to elevate
            your listening experience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
              onMouseEnter={() => setHoveredCategory(index)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link
                href={category.href}
                className={`block h-full rounded-xl overflow-hidden border group transition-all duration-300 ${category.color} ${category.borderColor} hover:shadow-md`}
              >
                <div className="p-6 h-full flex flex-col">
                  {/* Placeholder for category image */}
                  <div
                    className={`flex-1 mb-4 rounded-lg overflow-hidden ${
                      hoveredCategory === index ? "scale-105" : "scale-100"
                    } transition-transform duration-300`}
                  >
                    <div className="bg-white dark:bg-gray-800 h-40 w-full rounded-lg flex items-center justify-center text-muted-foreground">
                      {/* Replace this placeholder with an actual image component */}
                      <span>{category.name} Image</span>
                    </div>
                  </div>

                  <div>
                    <h3
                      className={`font-semibold text-xl mb-2 ${category.textColor} group-hover:translate-x-1 transition-transform duration-300`}
                    >
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {category.description}
                    </p>
                    <div
                      className={`inline-flex items-center font-medium ${category.textColor}`}
                    >
                      Shop Now
                      <svg
                        className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
