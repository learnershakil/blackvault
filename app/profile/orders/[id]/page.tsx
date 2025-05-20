import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import ProfileTabs from "@/components/profile/profile-tabs";
import prisma from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: OrderDetailPageProps): Promise<Metadata> {
  return {
    title: `Order #${params.id} | BlackVault`,
    description: "View order details and tracking information",
  };
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session || !session.user) {
    redirect(`/login?callbackUrl=/profile/orders/${params.id}`);
  }

  // Fetch order details
  const order = await prisma.order.findUnique({
    where: {
      id: params.id,
      userId: session.user.id, // Ensure user can only view their own orders
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
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
      shippingAddress: true,
      billingAddress: true,
    },
  });

  // If order not found or doesn't belong to user, return 404
  if (!order) {
    notFound();
  }

  // Define status steps based on order status
  const statusSteps = [
    { name: "Order Placed", completed: true },
    {
      name: "Processing",
      completed: ["PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status),
    },
    {
      name: "Shipped",
      completed: ["SHIPPED", "DELIVERED"].includes(order.status),
    },
    { name: "Delivered", completed: order.status === "DELIVERED" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <Link
            href="/profile/orders"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mr-4"
          >
            ← Back to orders
          </Link>
          <h1 className="text-3xl font-bold">Order #{order.orderNumber}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar with navigation */}
          <div className="lg:col-span-1">
            <ProfileTabs />

            <div className="mt-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-4">Need Help?</h3>
              <Link href="/contact">
                <Button variant="outline" size="sm" className="w-full">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Order Status</h2>

              <div className="relative">
                <div className="overflow-hidden h-2 mb-8 flex rounded bg-gray-200 dark:bg-gray-700">
                  <div
                    className="bg-primary-600 dark:bg-primary-500"
                    style={{
                      width: `${
                        (statusSteps.filter((step) => step.completed).length /
                          statusSteps.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between">
                  {statusSteps.map((step, index) => (
                    <div key={step.name} className="text-center relative">
                      <div
                        className={`w-6 h-6 rounded-full mx-auto mb-2 flex items-center justify-center ${
                          step.completed
                            ? "bg-primary-600 dark:bg-primary-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        {step.completed && (
                          <svg
                            className="w-4 h-4 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <div className="text-xs whitespace-nowrap">
                        {step.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Order placed on {formatDate(order.createdAt)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Current status:{" "}
                  <span className="font-medium">{order.status}</span>
                </p>
                {order.trackingNumber && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tracking #:{" "}
                    <span className="font-medium">{order.trackingNumber}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 flex items-start">
                    <div className="relative h-20 w-20 rounded bg-gray-100 dark:bg-gray-800 overflow-hidden mr-4">
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

                    <div className="flex-1">
                      <Link
                        href={`/product/${item.product?.slug}`}
                        className="font-medium hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {item.product?.name || "Product Unavailable"}
                      </Link>
                      {item.variantName && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {item.variantName}
                        </p>
                      )}
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Qty: {item.quantity}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-medium">
                        {formatPrice(item.price)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Subtotal: {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotalAmount)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{formatPrice(order.shippingAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatPrice(order.taxAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Shipping & Billing */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">
                Shipping & Billing Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <address className="not-italic text-sm text-gray-600 dark:text-gray-400">
                    <p>{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.streetAddress}</p>
                    {order.shippingAddress.apartment && (
                      <p>{order.shippingAddress.apartment}</p>
                    )}
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    {order.shippingAddress.phone && (
                      <p>{order.shippingAddress.phone}</p>
                    )}
                  </address>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Billing Address</h3>
                  <address className="not-italic text-sm text-gray-600 dark:text-gray-400">
                    <p>{order.billingAddress.fullName}</p>
                    <p>{order.billingAddress.streetAddress}</p>
                    {order.billingAddress.apartment && (
                      <p>{order.billingAddress.apartment}</p>
                    )}
                    <p>
                      {order.billingAddress.city}, {order.billingAddress.state}{" "}
                      {order.billingAddress.postalCode}
                    </p>
                    <p>{order.billingAddress.country}</p>
                    {order.billingAddress.phone && (
                      <p>{order.billingAddress.phone}</p>
                    )}
                  </address>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-2">Payment Information</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Payment Method: {order.paymentMethod}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Payment Status: {order.paymentStatus}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
