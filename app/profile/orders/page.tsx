import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ProfileTabs from "@/components/profile/profile-tabs";
import prisma from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders | BlackVault",
  description: "View your order history and track current orders",
};

export default async function OrdersPage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/profile/orders");
  }

  // Fetch user's orders
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              slug: true,
              images: {
                where: { isDefault: true },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar with navigation */}
          <div className="lg:col-span-1">
            <ProfileTabs />
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex flex-col md:flex-row justify-between mb-4 gap-2">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Order #{order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-3 items-start flex-wrap">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                            order.status === "DELIVERED"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : order.status === "CANCELLED"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                          }`}
                        >
                          {order.status}
                        </span>
                        <Link
                          href={`/profile/orders/${order.id}`}
                          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                      <div className="flex flex-col gap-4">
                        {order.items.slice(0, 2).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-4"
                          >
                            <div className="relative h-16 w-16 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden">
                              {item.product?.images?.[0]?.url ? (
                                <img
                                  src={item.product.images[0].url}
                                  alt={item.product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    No image
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <Link
                                href={`/product/${item.product?.slug}`}
                                className="font-medium text-sm hover:text-primary-600 dark:hover:text-primary-400"
                              >
                                {item.product?.name || "Product Unavailable"}
                              </Link>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Qty: {item.quantity} × {formatPrice(item.price)}
                              </div>
                            </div>
                          </div>
                        ))}

                        {order.items.length > 2 && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            + {order.items.length - 2} more item(s)
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 flex items-center justify-between">
                      <div className="font-medium">Total</div>
                      <div className="font-bold text-lg">
                        {formatPrice(order.totalAmount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8 border border-gray-200 dark:border-gray-700 text-center">
                <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  You haven't placed any orders with us yet.
                </p>
                <Link
                  href="/products"
                  className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
