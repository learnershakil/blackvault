"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RazorpayButton from "@/components/checkout/razorpay-button";
import { Button } from "@/components/ui/button";

interface PaymentProcessingProps {
  orderId: string;
  orderNumber: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
}

export default function PaymentProcessing({
  orderId,
  orderNumber,
  amount,
  customerName,
  customerEmail,
  paymentMethod,
  onPaymentMethodChange,
}: PaymentProcessingProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle Razorpay payment success
  const handlePaymentSuccess = async (
    paymentId: string,
    razorpayOrderId: string,
    signature: string
  ) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          paymentId,
          razorpayOrderId,
          signature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Payment verification failed");
      }

      // Redirect to success page
      router.push(
        `/checkout/success?orderId=${orderId}&paymentId=${paymentId}`
      );
    } catch (error: any) {
      console.error("Payment verification error:", error);
      setError(error.message || "Payment verification failed");
      router.push(
        `/checkout/failure?error=${encodeURIComponent(error.message)}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle payment failure
  const handlePaymentFailure = (error: any) => {
    console.error("Payment failed:", error);
    setError(error.message || "Payment failed");
    router.push(
      `/checkout/failure?error=${encodeURIComponent(
        error.message || "Payment processing failed"
      )}`
    );
  };

  // Handle Cash on Delivery selection
  const handleCodPayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: "cod",
          status: "PENDING",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process order");
      }

      // Redirect to success page
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch (error: any) {
      console.error("COD processing error:", error);
      setError(error.message || "Failed to process order");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Complete Your Payment</h2>

        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-md">
            <div className="flex justify-between mb-1">
              <span>Order Number:</span>
              <span className="font-medium">{orderNumber}</span>
            </div>
            <div className="flex justify-between font-medium text-lg">
              <span>Total Amount:</span>
              <span>₹{(amount / 100).toFixed(2)}</span>
            </div>
          </div>

          {paymentMethod === "razorpay" && (
            <RazorpayButton
              orderId={orderId}
              amount={amount}
              customerName={customerName}
              customerEmail={customerEmail}
              onSuccess={handlePaymentSuccess}
              onFailure={handlePaymentFailure}
            />
          )}

          {paymentMethod === "cod" && (
            <Button
              onClick={handleCodPayment}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? "Processing..." : "Confirm Cash on Delivery"}
            </Button>
          )}

          {/* Payment method switch */}
          <div className="flex justify-center pt-4 text-sm text-gray-500 dark:text-gray-400">
            {paymentMethod === "razorpay" ? (
              <button
                onClick={() => onPaymentMethodChange("cod")}
                className="hover:underline"
                disabled={isProcessing}
              >
                Switch to Cash on Delivery
              </button>
            ) : (
              <button
                onClick={() => onPaymentMethodChange("razorpay")}
                className="hover:underline"
                disabled={isProcessing}
              >
                Switch to Online Payment
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        <p>
          By completing this purchase, you agree to our{" "}
          <a href="/terms" className="text-primary-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
