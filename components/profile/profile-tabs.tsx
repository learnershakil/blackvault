"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const profileNavItems = [
  { name: "Personal Information", href: "/profile" },
  { name: "Addresses", href: "/profile/addresses" },
  { name: "Orders", href: "/profile/orders" },
  { name: "Wishlist", href: "/profile/wishlist" },
];

export default function ProfileTabs() {
  const pathname = usePathname();

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <nav className="flex flex-col">
        {profileNavItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`px-6 py-4 text-sm font-medium border-b border-gray-200 dark:border-gray-700 last:border-0 ${
              pathname === item.href
                ? "bg-gray-50 dark:bg-gray-900/50 text-primary-600 dark:text-primary-400 border-l-4 border-primary-600 dark:border-primary-400 pl-5"
                : "hover:bg-gray-50 dark:hover:bg-gray-900/50"
            }`}
          >
            {item.name}
          </Link>
        ))}

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-6 py-4 text-sm font-medium text-left text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-900/50"
        >
          Sign Out
        </button>
      </nav>
    </div>
  );
}
