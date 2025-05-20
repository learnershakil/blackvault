"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Footer() {
  const [emailInput, setEmailInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app you'd send this data to an API
    setIsSubmitted(true);
    setEmailInput("");
    // Reset after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Column 1: Company Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              BlackVault Audio
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Premium audio equipment for the discerning audiophile.
            </p>
          </motion.div>

          {/* Column 2: Shop Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Shop
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/products", label: "All Products" },
                { href: "/products/category/headphones", label: "Headphones" },
                { href: "/products/category/earbuds", label: "Earbuds" },
                { href: "/products/category/speakers", label: "Speakers" },
                {
                  href: "/products/category/accessories",
                  label: "Accessories",
                },
              ].map((link) => (
                <motion.li
                  key={link.href}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Customer Service */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Customer Service
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/contact", label: "Contact Us" },
                { href: "/faqs", label: "FAQs" },
                { href: "/returns-exchanges", label: "Returns & Exchanges" },
                { href: "/shipping-policy", label: "Shipping Policy" },
                {
                  href: "/warranty-information",
                  label: "Warranty Information",
                },
                { href: "/about", label: "About Us" },
              ].map((link) => (
                <motion.li
                  key={link.href}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4: Newsletter */}
          <motion.div variants={itemVariants}>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Stay Updated
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Subscribe to our newsletter for the latest products, offers, and
              audio tips.
            </p>
            <form onSubmit={handleSubscribeSubmit} className="flex">
              <input
                type="email"
                placeholder="Your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="px-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-l focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:text-white"
              />
              <motion.button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-r"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>

              {isSubmitted && (
                <motion.p
                  className="text-green-600 dark:text-green-400 text-sm mt-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Thank you for subscribing!
                </motion.p>
              )}
            </form>
          </motion.div>
        </motion.div>

        {/* Bottom section */}
        <motion.div
          className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 md:flex md:items-center md:justify-between"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex space-x-6 md:order-2">
            <Link
              href="/privacy"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              Contact
            </Link>
          </div>
          <p className="mt-8 text-xs text-gray-500 dark:text-gray-400 md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} BlackVault Audio. All rights
            reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
