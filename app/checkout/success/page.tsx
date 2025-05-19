"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import {
  formatOrderDate,
  getOrderStatusText,
  getOrderStatusColor,
} from "@/lib/order-utils";
import { useAuth } from "@/lib/auth";

interface OrderDetails {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // Check if user is authenticated
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check if orderId is provided
    if (!orderId) {
      setError("Order ID is missing");
      setIsLoading(false);
      return;
    }

    // Fetch order details
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        setOrder(data);
      } catch (err: any) {
        console.error("Error fetching order:", err);
        setError(err.message || "Failed to fetch order details");
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && isAuthenticated) {
      fetchOrder();
    }
  }, [orderId, isAuthenticated, authLoading, router]);

  if (isLoading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "We couldn't find the order you were looking for."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/profile/orders">
              <Button>View My Orders</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-8">
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Order Placed Successfully!</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Thank you for your order. We've received your payment and are
              processing your order.
            </p>
          </div>

          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 my-6">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Order Number
                </span>
                <p className="font-medium">{order.orderNumber}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Date
                </span>
                <p className="font-medium">
                  {formatOrderDate(order.createdAt)}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Total
                </span>
                <p className="font-medium">
                  {formatPrice(Number(order.total))}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Status
                </span>
                <span
                  className={`inline-flex mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getOrderStatusColor(
                    order.status
                  )}`}
                >
                  {getOrderStatusText(order.status)}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-medium mb-3">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Qty: {item.quantity} × {formatPrice(Number(item.price))}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-between mt-8">
            <Link href={`/profile/orders`}>
              <Button variant="outline">View Order Details</Button>
            </Link>
            <Link href="/products">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
