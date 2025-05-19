import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Admin Dashboard | BlackVault",
};

// Custom card component for dashboard stats
function StatCard({
  title,
  value,
  icon,
  href,
}: {
  title: string;
  value: string | number;
  icon: string;
  href: string;
}) {
  return (
    <Link href={href} className="block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">
              {value}
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400">
            {icon === "products" && (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m8 4v10M4 7v10l8 4"
                />
              </svg>
            )}
            {icon === "orders" && (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            )}
            {icon === "users" && (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            )}
            {icon === "revenue" && (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function AdminDashboard() {
  // Fetch statistics for the dashboard
  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();
  const userCount = await prisma.user.count();

  // Calculate total revenue (sum of all order totals)
  const revenue = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
  });

  const totalRevenue = revenue._sum.total || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Products"
          value={productCount}
          icon="products"
          href="/admin/products"
        />
        <StatCard
          title="Total Orders"
          value={orderCount}
          icon="orders"
          href="/admin/orders"
        />
        <StatCard
          title="Total Customers"
          value={userCount}
          icon="users"
          href="/admin/customers"
        />
        <StatCard
          title="Total Revenue"
          value={formatPrice(Number(totalRevenue))}
          icon="revenue"
          href="/admin/analytics"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent orders section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium">Recent Orders</h2>
          </div>
          <div className="p-6">
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No recent orders to display
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/30 px-6 py-3">
            <Link
              href="/admin/orders"
              className="text-sm text-primary-600 hover:text-primary-800 dark:hover:text-primary-400"
            >
              View all orders
            </Link>
          </div>
        </div>

        {/* Recent customers section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium">Recent Customers</h2>
          </div>
          <div className="p-6">
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No recent customers to display
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/30 px-6 py-3">
            <Link
              href="/admin/customers"
              className="text-sm text-primary-600 hover:text-primary-800 dark:hover:text-primary-400"
            >
              View all customers
            </Link>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            href="/admin/products/new"
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center hover:shadow-md transition-shadow"
          >
            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 mr-4">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Add New Product</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create a new product listing
              </p>
            </div>
          </Link>

          <Link
            href="/admin/products/categories"
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center hover:shadow-md transition-shadow"
          >
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Manage Categories</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Add or edit product categories
              </p>
            </div>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center hover:shadow-md transition-shadow"
          >
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 mr-4">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Process Orders</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Check and fulfill pending orders
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
