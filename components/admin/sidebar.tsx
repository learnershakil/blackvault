"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Navigation items for the sidebar
const navigation = [
  { name: "Dashboard", href: "/admin", icon: "Dashboard" },
  {
    name: "Products",
    href: "/admin/products",
    icon: "Products",
    submenu: [
      { name: "All Products", href: "/admin/products" },
      { name: "Add Product", href: "/admin/products/new" },
      { name: "Categories", href: "/admin/products/categories" },
    ],
  },
  { name: "Orders", href: "/admin/orders", icon: "Orders" },
  { name: "Customers", href: "/admin/customers", icon: "Customers" },
  { name: "Analytics", href: "/admin/analytics", icon: "Analytics" },
  { name: "Settings", href: "/admin/settings", icon: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  // Helper to check if a path is active
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:block">
      <div className="h-full flex flex-col">
        {/* Logo and brand */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <Link
            href="/admin"
            className="flex items-center space-x-2 font-bold text-xl text-primary-600"
          >
            <span>BlackVault</span>
            <span className="text-sm font-normal">Admin</span>
          </Link>
        </div>

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
                >
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
            <span className="mr-2">
              {/* Exit icon */}
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </span>
            <span>Back to Store</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
