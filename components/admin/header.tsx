"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { motion, AnimatePresence } from "framer-motion";
import MobileSidebar from "./mobile-sidebar";

interface AdminHeaderProps {
  user: Session["user"];
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount] = useState(3); // Example notification count

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
        <div className="px-4 h-16 flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Open menu"
          >
            <motion.svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </motion.svg>
          </button>

          {/* Header title - mobile */}
          <div className="md:hidden font-semibold text-lg text-gray-800 dark:text-gray-200 flex items-center">
            <svg
              className="w-5 h-5 mr-2 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
              />
            </svg>
            Admin
          </div>

          {/* Header title - desktop with breadcrumb */}
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"
                />
              </svg>
              Admin Dashboard
            </h1>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search button */}
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700">
              <span className="sr-only">Search</span>
              <motion.svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </motion.svg>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="p-1 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700">
                <span className="sr-only">View notifications</span>
                <motion.svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </motion.svg>
              </button>

              {notificationCount > 0 && (
                <motion.span
                  className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                >
                  {notificationCount}
                </motion.span>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              >
                <motion.div
                  className="h-8 w-8 rounded-full bg-primary-200 dark:bg-primary-700 flex items-center justify-center text-primary-700 dark:text-primary-200 border-2 border-transparent"
                  whileHover={{
                    scale: 1.05,
                    borderColor: "var(--primary)",
                  }}
                >
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "A"}
                </motion.div>
                <span className="text-sm font-medium hidden md:block">
                  {user?.name || "Admin"}
                </span>
                <motion.svg
                  className="h-5 w-5 hidden md:block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ rotate: isProfileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </button>

              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user?.name || "Admin User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email || "admin@example.com"}
                      </p>
                    </div>
                    <Link
                      href="/admin/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
                    >
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
