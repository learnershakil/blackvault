import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

import StatsCard from "@/components/admin/dashboard/stats-card";
import RecentOrders from "@/components/admin/dashboard/recent-orders";
import RevenueChart from "@/components/admin/dashboard/revenue-chart";
import QuickActions from "@/components/admin/dashboard/quick-actions";
import RecentCustomers from "@/components/admin/dashboard/recent-customers";
import InventoryStatus from "@/components/admin/dashboard/inventory-status";

export const metadata = {
  title: "Admin Dashboard | BlackVault",
};

export default async function AdminDashboard() {
  // Fetch statistics for the dashboard
  const productCount = await prisma.product.count();
  const orderCount = await prisma.order.count();
  const userCount = await prisma.user.count({ where: { role: "CUSTOMER" } });

  // Calculate total revenue (sum of all order totals)
  const revenue = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
  });

  const totalRevenue = Number(revenue._sum.total || 0);

  // Calculate today's revenue
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayRevenue = await prisma.order.aggregate({
    where: {
      createdAt: {
        gte: today,
      },
    },
    _sum: {
      total: true,
    },
  });

  const todayRevenueValue = Number(todayRevenue._sum.total || 0);

  // Fetch recent orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  // Format orders for display
  const formattedOrders = recentOrders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.user.name || "Guest",
    date: new Date(order.createdAt).toLocaleDateString(),
    status: order.status,
    amount: Number(order.total),
  }));

  // Fetch recent customers
  const recentCustomers = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      orders: {
        select: {
          total: true,
        },
      },
      _count: {
        select: { orders: true },
      },
    },
  });

  // Format customers for display
  const formattedCustomers = recentCustomers.map((customer) => ({
    id: customer.id,
    name: customer.name || "Anonymous",
    email: customer.email || "No email",
    orders: customer._count.orders,
    totalSpent: customer.orders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    ),
    joinDate: new Date(customer.createdAt).toLocaleDateString(),
    avatar: customer.image,
  }));

  // Fetch low stock products
  const lowStockProducts = await prisma.product.findMany({
    where: {
      stock: {
        lte: 10,
      },
    },
    take: 5,
    orderBy: {
      stock: "asc",
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
      images: {
        where: { isDefault: true },
        take: 1,
      },
    },
  });

  // Format products for display
  const formattedProducts = lowStockProducts.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    stock: product.stock,
    category: product.category.name,
    image: product.images[0]?.url,
  }));

  // Example revenue data for the chart
  const revenueData = [
    { label: "Mon", value: 1200 },
    { label: "Tue", value: 1600 },
    { label: "Wed", value: 1100 },
    { label: "Thu", value: 1450 },
    { label: "Fri", value: 1800 },
    { label: "Sat", value: 2100 },
    { label: "Sun", value: 1700 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Products"
          value={productCount}
          icon={
            <svg
              className="w-6 h-6"
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
          }
          href="/admin/products"
          change={5.2}
        />
        <StatsCard
          title="Total Orders"
          value={orderCount}
          icon={
            <svg
              className="w-6 h-6"
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
          }
          href="/admin/orders"
          change={3.1}
          bgColor="bg-blue-500"
        />
        <StatsCard
          title="Total Customers"
          value={userCount}
          icon={
            <svg
              className="w-6 h-6"
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
          }
          href="/admin/customers"
          change={-1.8}
          bgColor="bg-yellow-500"
        />
        <StatsCard
          title="Total Revenue"
          value={formatPrice(totalRevenue)}
          icon={
            <svg
              className="w-6 h-6"
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
          }
          href="/admin/analytics"
          change={8.4}
          bgColor="bg-green-500"
        />
      </div>

      {/* Revenue Chart and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart
            data={revenueData}
            title="Weekly Revenue"
            period="weekly"
          />
        </div>
        <div>
          <StatsCard
            title="Today's Revenue"
            value={formatPrice(todayRevenueValue)}
            icon={
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            bgColor="bg-purple-500"
          />
        </div>
      </div>

      {/* Recent Orders and Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={formattedOrders} />
        <RecentCustomers customers={formattedCustomers} />
      </div>

      {/* Low Stock Products and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InventoryStatus products={formattedProducts} />
        <QuickActions />
      </div>
    </div>
  );
}
