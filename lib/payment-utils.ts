import crypto from "crypto";
import { CartItem } from "@/store/cart-store";

// Razorpay order options interface
export interface RazorpayOrderOptions {
  amount: number; // Amount in paise (Razorpay uses smallest currency unit)
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

// Payment verification interface
export interface PaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/**
 * Create options for Razorpay order creation
 */
export function createRazorpayOrderOptions(
  orderId: string,
  amount: number,
  notes?: Record<string, string>
): RazorpayOrderOptions {
  return {
    amount: Math.round(amount * 100), // Convert to paise (smallest currency unit in INR)
    currency: "INR", // You can change this based on your region
    receipt: orderId,
    notes: notes || {
      orderType: "ecommerce",
    },
  };
}

/**
 * Format Razorpay options for the frontend
 */
export function formatRazorpayOptions(
  orderData: any,
  userEmail: string,
  userName: string,
  callback: (response: any) => void
) {
  return {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: orderData.amount,
    currency: orderData.currency,
    name: "BlackVault Audio",
    description: "Premium Audio Products",
    order_id: orderData.id,
    handler: callback,
    prefill: {
      name: userName,
      email: userEmail,
    },
    notes: orderData.notes,
    theme: {
      color: "#181D31", // Primary color of your brand
    },
  };
}

/**
 * Verify Razorpay payment signature
 */
export function verifyRazorpayPayment({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}: PaymentVerificationData): boolean {
  // Create a signature using the payment ID and order ID
  const text = `${razorpay_order_id}|${razorpay_payment_id}`;
  const secret = process.env.RAZORPAY_KEY_SECRET || "";

  // Generate the HMAC signature
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(text)
    .digest("hex");

  // Compare the signatures
  return generatedSignature === razorpay_signature;
}

/**
 * Calculate the breakdown of an order amount for invoice
 */
export function calculateOrderBreakdown(items: CartItem[], subtotal: number) {
  const tax = subtotal * 0.1; // 10% tax rate
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  return {
    subtotal,
    tax,
    shipping,
    total,
  };
}
