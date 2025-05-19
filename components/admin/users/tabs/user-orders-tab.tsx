"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";

interface UserOrdersTabProps {
  userId: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
}

export default function UserOrdersTab({ userId }: UserOrdersTabProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUserOrders() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/users/${userId}/orders`);

        if (!response.ok) throw new Error("Failed to fetch user orders");

        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching user orders:", error);
        setError("Failed to load orders");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserOrders();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          This user hasn't placed any orders yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Order History</h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 text-left">
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Order #
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Date
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Total
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Items
              </th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="px-4 py-3 text-sm">{order.orderNumber}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                  {formatDate(order.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-sm font-medium">
                  {formatPrice(Number(order.total))}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"}
                </td>
                <td className="px-4 py-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  let badgeClass;

  switch (status) {
    case "PENDING":
      badgeClass =
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      break;
    case "PROCESSING":
      badgeClass =
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      break;
    case "SHIPPED":
      badgeClass =
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      break;
    case "DELIVERED":
      badgeClass =
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      break;
    case "CANCELLED":
      badgeClass =
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      break;
    case "REFUNDED":
      badgeClass =
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400";
      break;
    default:
      badgeClass =
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
