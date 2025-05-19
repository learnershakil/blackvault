"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Order, OrderItem, Product } from "@prisma/client";

type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Product;
  })[];
};

interface OrdersListProps {
  orders: OrderWithItems[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
  };
}

export default function OrdersList({ orders, pagination }: OrdersListProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Toggle order details visibility
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            You haven't placed any orders yet.
          </p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div>
          {/* Orders list */}
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-4"
            >
              {/* Order header */}
              <div className="p-4 flex flex-wrap gap-2 justify-between border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Order #{order.orderNumber}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {formatStatus(order.status)}
                  </span>
                  <p className="font-medium">
                    {formatPrice(Number(order.total))}
                  </p>
                </div>
              </div>

              {/* Order items (expandable) */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </span>
                    {expandedOrder !== order.id && (
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="w-8 h-8 rounded-full overflow-hidden border border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700"
                          >
                            {/* Product image placeholder */}
                            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">
                              {item.name[0]}
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-xs">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        expandedOrder === order.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Expanded order details */}
                {expandedOrder === order.id && (
                  <div className="mt-4 space-y-4">
                    {/* Order items */}
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        >
                          {/* Product image placeholder */}
                          <div className="w-16 h-16 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            {item.name[0]}
                          </div>

                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              {item.name}
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-medium">
                              {formatPrice(Number(item.price))}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order summary */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Subtotal:
                          </span>
                          <span>{formatPrice(Number(order.subTotal))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Shipping:
                          </span>
                          <span>{formatPrice(Number(order.shipping))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Tax:
                          </span>
                          <span>{formatPrice(Number(order.tax))}</span>
                        </div>
                        {Number(order.discount) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">
                              Discount:
                            </span>
                            <span className="text-green-600 dark:text-green-400">
                              -{formatPrice(Number(order.discount))}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between font-medium pt-1 border-t border-gray-200 dark:border-gray-700">
                          <span>Total:</span>
                          <span>{formatPrice(Number(order.total))}</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div>
                        <h4 className="font-medium mb-1">Shipping Address</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {/* In a real app, you would display the actual address from order.shippingAddress */}
                          123 Main St, Apt 4B
                          <br />
                          New York, NY 10001
                          <br />
                          United States
                        </p>
                      </div>

                      {/* Order actions */}
                      <div className="flex flex-wrap gap-2 items-start">
                        <Button size="sm" variant="outline">
                          Track Order
                        </Button>
                        <Button size="sm" variant="outline">
                          Invoice
                        </Button>
                        {["PENDING", "PROCESSING"].includes(order.status) && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                {pagination.currentPage > 1 && (
                  <Link
                    href={`/profile/orders?page=${pagination.currentPage - 1}`}
                  >
                    <Button variant="outline" size="sm">
                      Previous
                    </Button>
                  </Link>
                )}

                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((pageNumber) => (
                  <Link
                    key={pageNumber}
                    href={`/profile/orders?page=${pageNumber}`}
                  >
                    <Button
                      variant={
                        pageNumber === pagination.currentPage
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                    >
                      {pageNumber}
                    </Button>
                  </Link>
                ))}

                {pagination.currentPage < pagination.totalPages && (
                  <Link
                    href={`/profile/orders?page=${pagination.currentPage + 1}`}
                  >
                    <Button variant="outline" size="sm">
                      Next
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper functions for order status
function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "SHIPPED":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    case "DELIVERED":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "CANCELLED":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "REFUNDED":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
}
