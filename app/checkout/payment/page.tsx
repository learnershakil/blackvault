"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentProcessing from "@/components/checkout/payment-processing";
import { useAuth } from "@/lib/auth";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const orderId = searchParams.get("orderId");

  // Load order details when component mounts
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    if (!orderId) {
      setError("Order ID is missing");
      setIsLoading(false);
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        setOrderDetails(data);
        setPaymentMethod(data.paymentMethod || "razorpay");
      } catch (err: any) {
        console.error("Error fetching order details:", err);
        setError(err.message || "Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && orderId) {
      fetchOrderDetails();
    }
  }, [orderId, isAuthenticated, authLoading, router]);

  // Update payment method
  const handlePaymentMethodChange = async (method: string) => {
    if (method !== paymentMethod) {
      setPaymentMethod(method);
      try {
        // Update order with new payment method
        await fetch(`/api/orders/${orderId}/payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethod: method,
            status: "PENDING",
          }),
        });
      } catch (err) {
        console.error("Error updating payment method:", err);
      }
    }
  };

  // Show loading state
  if (isLoading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Show error state
  if (error || !orderDetails) {
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error || "There was a problem loading your payment details."}
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/checkout")}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              Return to Checkout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Complete Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment component */}
          <div className="lg:col-span-2">
            <PaymentProcessing
              orderId={orderDetails.id}
              orderNumber={orderDetails.orderNumber}
              amount={Math.round(Number(orderDetails.total) * 100)} // Convert to paise/cents
              customerName={user?.name || "Customer"}
              customerEmail={user?.email || ""}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={handlePaymentMethodChange}
            />
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Order Number:
                  </span>
                  <span className="font-medium">
                    {orderDetails.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal:
                  </span>
                  <span>₹{Number(orderDetails.subTotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                  <span>₹{Number(orderDetails.tax).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Shipping:
                  </span>
                  <span>
                    {Number(orderDetails.shipping) === 0
                      ? "Free"
                      : `₹${Number(orderDetails.shipping).toFixed(2)}`}
                  </span>
                </div>
                {Number(orderDetails.discount) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Discount:
                    </span>
                    <span className="text-green-600 dark:text-green-400">
                      -₹{Number(orderDetails.discount).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2 flex justify-between font-medium">
                  <span>Total:</span>
                  <span>₹{Number(orderDetails.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
