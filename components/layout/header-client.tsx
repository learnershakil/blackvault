"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { signOut } from "next-auth/react";
import CartButton from "@/components/layout/cart-button";
import SearchBar from "@/components/search/search-bar";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";

interface HeaderClientProps {
  session: Session | null;
}

export default function HeaderClient({ session }: HeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Track scroll position to add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch top categories for the navigation menu
  useEffect(() => {
    const fetchTopCategories = async () => {
      try {
        const res = await fetch(
          "/api/products/categories?topLevel=true&limit=5"
        );
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchTopCategories();
  }, []);

  return (
    <header
      className={`bg-white dark:bg-gray-900 sticky top-0 z-30 w-full border-b border-gray-200 dark:border-gray-700 transition-shadow ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto px-4 h-16 flex items-center justify-between"
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-primary-600 dark:text-primary-500"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            BlackVault
          </motion.div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-6">
          {[
            { href: "/", label: "Home" },
            { href: "/products", label: "Products" },
            ...categories.slice(0, 3).map((category) => ({
              href: `/products/category/${category.slug}`,
              label: category.name,
            })),
            { href: "/categories", label: "Categories" },
            { href: "/about", label: "About" },
          ].map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Search bar */}
          
          <SearchBar />

          {/* Cart button */}
          <CartButton />

          {/* User menu or login button */}
          {session ? (
            <Link href="/profile" className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 hover:opacity-80 transition-opacity"
              >
                {session.user?.name?.charAt(0) ||
                  session.user?.email?.charAt(0) ||
                  "U"}
              </motion.div>
            </Link>
          ) : (
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </motion.div>
            </Link>
          )}

          {/* Mobile menu button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-muted py-4 px-4 shadow-md overflow-hidden"
          >
            <nav className="flex flex-col space-y-4">
              <div className="pb-2 mb-2">
                <SearchBar expanded={true} className="mb-2" />
              </div>
              {[
                { href: "/", label: "Home" },
                { href: "/products", label: "Products" },
                ...categories.map((category) => ({
                  href: `/products/category/${category.slug}`,
                  label: category.name,
                })),
                { href: "/categories", label: "All Categories" },
                { href: "/about", label: "About" },
              ].map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              {session && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Link
                    href="/profile"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                </motion.div>
              )}
              {!session && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Link
                    href="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
