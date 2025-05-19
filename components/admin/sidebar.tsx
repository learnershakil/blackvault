"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

// Navigation items for the sidebar
const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
        />
      </svg>
    ),
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    submenu: [
      { name: "All Products", href: "/admin/products" },
      { name: "Add Product", href: "/admin/products/new" },
      { name: "Categories", href: "/admin/products/categories" },
    ],
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    ),
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    name: "Marketing",
    href: "/admin/marketing",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
        />
      </svg>
    ),
    submenu: [
      { name: "Coupons", href: "/admin/coupons" },
      { name: "Collections", href: "/admin/collections" },
      { name: "Banners", href: "/admin/banners" },
    ],
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Helper to check if a path is active
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block h-screen">
      <div className="h-full flex flex-col">
        {/* Logo and brand */}
        <Link
          href="/admin"
          className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 font-bold text-xl text-primary-600"
          >
            <span>BlackVault</span>
            <span className="text-sm font-normal">Admin</span>
          </motion.div>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <div key={item.name} className="mb-2">
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    active
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                  }`}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <motion.div
                    className="mr-3 flex-shrink-0 text-gray-500 dark:text-gray-400"
                    animate={{
                      rotate: hoveredItem === item.name || active ? 360 : 0,
                      color: active ? "var(--primary)" : undefined,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {item.icon}
                  </motion.div>
                  <span className="truncate">{item.name}</span>
                </Link>

                {/* Render submenu if available and active */}
                {item.submenu && active && (
                  <div className="pl-6 mt-1 space-y-1">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        href={subitem.href}
                        className={`flex items-center px-4 py-2 text-xs font-medium rounded-md transition-colors ${
                          pathname === subitem.href
                            ? "bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
                        }`}
                      >
                        <span className="truncate">{subitem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50 rounded-md transition-colors"
          >
            <motion.span className="mr-2" whileHover={{ x: -3 }}>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </motion.span>
            <span>Back to Store</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
