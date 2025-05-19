import { Suspense } from "react";
import prisma from "@/lib/prisma";
import OrderList from "@/components/admin/orders/order-list";

export const metadata = {
  title: "Order Management | BlackVault Admin",
};

interface OrdersPageProps {
  searchParams: {
    page?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    query?: string;
  };
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <Suspense fallback={<OrderListSkeleton />}>
        <OrderListServer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// Server component to fetch and render orders
async function OrderListServer({
  searchParams,
}: {
  searchParams: OrdersPageProps["searchParams"];
}) {
  const page = Number(searchParams.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  // Build filter conditions
  const where: any = {};

  // Status filter
  if (searchParams.status) {
    where.status = searchParams.status;
  }

  // Date range filter
  if (searchParams.startDate || searchParams.endDate) {
    where.createdAt = {};
    if (searchParams.startDate) {
      where.createdAt.gte = new Date(searchParams.startDate);
    }
    if (searchParams.endDate) {
      const endDate = new Date(searchParams.endDate);
      endDate.setHours(23, 59, 59, 999); // End of the selected day
      where.createdAt.lte = endDate;
    }
  }

  // Search query filter (order number or customer name/email)
  if (searchParams.query) {
    const query = searchParams.query;
    where.OR = [
      { orderNumber: { contains: query, mode: "insensitive" } },
      { user: { name: { contains: query, mode: "insensitive" } } },
      { user: { email: { contains: query, mode: "insensitive" } } },
    ];
  }

  // Fetch orders with pagination
  const [orders, totalOrders] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        shipment: true,
        Payment: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(totalOrders / limit);

  return (
    <OrderList
      initialOrders={orders}
      pagination={{
        currentPage: page,
        totalPages,
        totalOrders,
      }}
    />
  );
}

// Skeleton loader for orders list
function OrderListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filters skeleton */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 dark:bg-gray-700 rounded"
            ></div>
          ))}
        </div>
        <div className="flex justify-end">
          <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 space-y-4">
          <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 w-full bg-gray-200 dark:bg-gray-700 rounded"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
