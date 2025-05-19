"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import OrderStatusBadge from "@/components/admin/orders/order-status-badge";
import OrderStatusUpdate from "@/components/admin/orders/order-status-update";
import ShipmentForm from "@/components/admin/orders/shipment-form";

interface OrderDetailProps {
  order: any;
}

export default function OrderDetail({ order }: OrderDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "items" | "shipment" | "payments" | "customer"
  >("items");

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Order header with basic info and actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Order #{order.orderNumber}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Placed on {formatDate(order.createdAt)}</span>
              <span className="hidden md:inline">•</span>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/admin/orders/${order.id}/invoice`} target="_blank">
                View Invoice
              </Link>
            </Button>
            <Button size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Update Status"}
            </Button>
          </div>
        </div>

        {/* Status update form */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <OrderStatusUpdate
              orderId={order.id}
              currentStatus={order.status}
              onComplete={() => setIsEditing(false)}
            />
          </div>
        )}
      </div>

      {/* Tabs for different sections */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Tab headers */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab("items")}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "items"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Order Items
          </button>
          <button
            onClick={() => setActiveTab("shipment")}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "shipment"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Shipping & Delivery
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "payments"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Payment Details
          </button>
          <button
            onClick={() => setActiveTab("customer")}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === "customer"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Customer Info
          </button>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {/* Items Tab */}
          {activeTab === "items" && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {order.items.map((item: any) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                              {item.product?.images?.[0] ? (
                                <img
                                  src={item.product.images[0].url}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                                  {item.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {item.name}
                              </div>
                              {item.variantSku && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  SKU: {item.variantSku}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatPrice(Number(item.price))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                          {formatPrice(Number(item.price) * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400"
                      >
                        Subtotal:
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                        {formatPrice(Number(order.subTotal))}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400"
                      >
                        Shipping:
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                        {formatPrice(Number(order.shipping))}
                      </td>
                    </tr>
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400"
                      >
                        Tax:
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                        {formatPrice(Number(order.tax))}
                      </td>
                    </tr>
                    {Number(order.discount) > 0 && (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400"
                        >
                          Discount:
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-green-600 dark:text-green-400">
                          -{formatPrice(Number(order.discount))}
                        </td>
                      </tr>
                    )}
                    <tr className="border-t-2 border-gray-200 dark:border-gray-700">
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-right text-base font-bold text-gray-900 dark:text-gray-100"
                      >
                        Total:
                      </td>
                      <td className="px-6 py-4 text-right text-base font-bold text-gray-900 dark:text-gray-100">
                        {formatPrice(Number(order.total))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Shipping Tab */}
          {activeTab === "shipment" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  {order.shippingAddress && (
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <p>
                        {order.shippingAddress.firstName}{" "}
                        {order.shippingAddress.lastName}
                      </p>
                      <p>{order.shippingAddress.address1}</p>
                      {order.shippingAddress.address2 && (
                        <p>{order.shippingAddress.address2}</p>
                      )}
                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                      {order.shippingAddress.phone && (
                        <p>Phone: {order.shippingAddress.phone}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Shipment Details */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium mb-4">Shipment Details</h3>
                  {order.shipment ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          Carrier:
                        </span>
                        <span>{order.shipment.carrier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          Tracking Number:
                        </span>
                        <span>{order.shipment.trackingNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          Status:
                        </span>
                        <span>{order.shipment.status}</span>
                      </div>
                      {order.shipment.estimatedDelivery && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">
                            Est. Delivery:
                          </span>
                          <span>
                            {formatDate(order.shipment.estimatedDelivery)}
                          </span>
                        </div>
                      )}
                      <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                        <Button size="sm" variant="outline">
                          Update Shipment
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No shipment information yet
                      </p>
                      <ShipmentForm orderId={order.id} onComplete={() => {}} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              {/* Payment Details */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium mb-4">Payment Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Payment Method:
                    </span>
                    <span className="capitalize">{order.paymentMethod}</span>
                  </div>
                  {order.Payment && order.Payment.length > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          Payment ID:
                        </span>
                        <span>{order.Payment[0].paymentId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          Status:
                        </span>
                        <span className="capitalize">
                          {order.Payment[0].status.toLowerCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          Date:
                        </span>
                        <span>{formatDate(order.Payment[0].createdAt)}</span>
                      </div>
                    </>
                  )}
                  {/* Additional payment actions if needed */}
                </div>
              </div>

              {/* Billing Address */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium mb-2">Billing Address</h3>
                {order.billingAddress && (
                  <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <p>
                      {order.billingAddress.firstName}{" "}
                      {order.billingAddress.lastName}
                    </p>
                    <p>{order.billingAddress.address1}</p>
                    {order.billingAddress.address2 && (
                      <p>{order.billingAddress.address2}</p>
                    )}
                    <p>
                      {order.billingAddress.city}, {order.billingAddress.state}{" "}
                      {order.billingAddress.postalCode}
                    </p>
                    <p>{order.billingAddress.country}</p>
                    {order.billingAddress.phone && (
                      <p>Phone: {order.billingAddress.phone}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Customer Tab */}
          {activeTab === "customer" && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="font-medium mb-4">Customer Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
                      {order.user?.name?.[0] || order.user?.email?.[0] || "U"}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium">
                        {order.user?.name || "Guest User"}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.user?.email}
                      </div>
                    </div>
                  </div>

                  {order.user?.id && (
                    <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/customers/${order.user.id}`}>
                          View Customer Profile
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Order History */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Order History</h3>
                  <Button size="sm" variant="outline" asChild>
                    <Link
                      href={`/admin/orders?customer=${order.user?.id || ""}`}
                    >
                      View All Orders
                    </Link>
                  </Button>
                </div>

                {/* This would typically show recent orders from this customer */}
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  Customer order history will be displayed here
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
