"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatRazorpayOptions } from "@/lib/payment-utils";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayButtonProps {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  onSuccess: (paymentId: string, orderId: string, signature: string) => void;
  onFailure: (error: any) => void;
}

export default function RazorpayButton({
  orderId,
  amount,
  customerName,
  customerEmail,
  onSuccess,
  onFailure,
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const router = useRouter();

  // Create Razorpay order on component mount
  useEffect(() => {
    const createRazorpayOrder = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            amount,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create payment order");
        }

        const data = await response.json();
        setPaymentData(data.order);
      } catch (error) {
        console.error("Error creating payment order:", error);
        onFailure(error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId && amount > 0) {
      createRazorpayOrder();
    }
  }, [orderId, amount, onFailure]);

  // Initialize payment when button is clicked
  const handlePayment = () => {
    if (!paymentData) {
      console.error("Payment data not available");
      return;
    }

    if (window.Razorpay && scriptLoaded) {
      const options = formatRazorpayOptions(
        paymentData,
        customerEmail,
        customerName,
        (response: any) => {
          // Handle successful payment
          onSuccess(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );
        }
      );

      const razorpayInstance = new window.Razorpay(options);

      // Handle payment failures
      razorpayInstance.on("payment.failed", (response: any) => {
        console.error("Payment failed:", response.error);
        onFailure(response.error);
      });

      razorpayInstance.open();
    } else {
      console.error("Razorpay SDK not loaded");
      onFailure(new Error("Payment gateway not available"));
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setScriptLoaded(true)}
      />
      <Button
        onClick={handlePayment}
        disabled={loading || !paymentData || !scriptLoaded}
        className="w-full"
      >
        {loading ? "Processing..." : "Pay with Razorpay"}
      </Button>
    </>
  );
}
