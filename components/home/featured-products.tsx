"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

const products = [
  {
    id: 1,
    name: "BlackVault Pro Headphones",
    price: 299.99,
    rating: 4.8,
    reviewCount: 124,
    image: "/images/product-1.jpg", // Add actual images later
    category: "Headphones",
    colors: ["Black", "Silver", "Blue"],
    inStock: true,
    description:
      "Over-ear headphones with active noise cancellation and premium sound quality.",
  },
  {
    id: 2,
    name: "AirPods Pro X",
    price: 199.99,
    rating: 4.6,
    reviewCount: 98,
    image: "/images/product-2.jpg", // Add actual images later
    category: "Earbuds",
    colors: ["White", "Black"],
    inStock: true,
    description: "Wireless earbuds with spatial audio and transparency mode.",
  },
  {
    id: 3,
    name: "BoomBox Ultra",
    price: 349.99,
    rating: 4.9,
    reviewCount: 75,
    image: "/images/product-3.jpg", // Add actual images later
    category: "Speakers",
    colors: ["Black", "Red"],
    inStock: true,
    description:
      "Portable Bluetooth speaker with 24-hour battery life and waterproof design.",
  },
  {
    id: 4,
    name: "BlackVault Mini",
    price: 149.99,
    rating: 4.7,
    reviewCount: 112,
    image: "/images/product-4.jpg", // Add actual images later
    category: "Speakers",
    colors: ["Green", "Blue", "Black"],
    inStock: false,
    description: "Compact desktop speaker with rich bass and clear highs.",
  },
];

export default function FeaturedProducts() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <span className="text-primary-600 font-medium mb-3 inline-block">
              What's Hot
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Trending Products
            </h2>
          </div>
          <Link
            href="/products"
            className="mt-4 md:mt-0 text-primary-600 hover:text-primary-700 font-medium flex items-center group"
          >
            View All Products
            <svg
              className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              className="group"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                <div className="relative">
                  {/* Product Image */}
                  <div className="h-64 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    {/* Replace with actual image component */}
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                      {product.name.charAt(0)}
                    </div>

                    {/* "New" or "Sale" badge */}
                    {index === 0 && (
                      <div className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        NEW
                      </div>
                    )}
                    {index === 2 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        SALE
                      </div>
                    )}
                  </div>

                  {/* Quick action buttons */}
                  <div
                    className={`absolute inset-0 bg-black/5 dark:bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  >
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-full"
                      >
                        Quick View
                      </Button>
                      <Button size="sm" className="rounded-full">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {/* Category */}
                  <div className="text-xs text-muted-foreground mb-2">
                    {product.category}
                  </div>

                  {/* Product name */}
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-medium text-lg mb-2 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Product description */}
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
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
                    <span className="text-xs text-muted-foreground ml-2">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Price */}
                    <p className="font-bold text-lg">
                      {formatPrice(product.price)}
                    </p>

                    {/* Stock status */}
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        product.inStock
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>

                  {/* Available colors */}
                  <div className="flex mt-3">
                    {product.colors.map((color) => (
                      <div
                        key={color}
                        className="w-4 h-4 rounded-full border border-gray-200 mr-1"
                        style={{
                          backgroundColor: color.toLowerCase(),
                          borderColor:
                            color.toLowerCase() === "white" ? "#e5e7eb" : "",
                        }}
                        title={color}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
