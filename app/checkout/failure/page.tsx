"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CheckoutFailurePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const errorMessage =
    searchParams.get("error") || "There was a problem processing your payment";

  // Redirect to cart after a delay
  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      router.push("/cart");
    }, 60000); // 1 minute

    return () => clearTimeout(redirectTimeout);
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
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
          <h1 className="text-2xl font-bold mb-3">Payment Failed</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {errorMessage}
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Your order has not been placed. Your payment was not processed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => router.push("/checkout")}>Try Again</Button>
            <Link href="/cart">
              <Button variant="outline">Return to Cart</Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
            Need help?{" "}
            <Link href="/contact" className="text-primary-600 hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
