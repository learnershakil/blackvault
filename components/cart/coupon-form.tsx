"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import useCartStore from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";

interface CouponFormProps {
  onApply?: (discount: number) => void;
}

export default function CouponForm({ onApply }: CouponFormProps) {
  const [couponCode, setCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: string;
    discountValue: number;
    discount: number;
  } | null>(null);

  const { totalPrice, applyCoupon, removeCoupon } = useCartStore();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode,
          cartTotal: totalPrice(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid coupon code");
      }

      // Apply coupon to the cart store
      const discount = data.discount;
      applyCoupon(couponCode, discount);
      setAppliedCoupon({
        code: couponCode,
        discountType: data.discountType,
        discountValue: data.discountValue,
        discount: discount,
      });

      // Clear the input
      setCouponCode("");

      // Call the onApply callback if provided
      if (onApply) {
        onApply(discount);
      }
    } catch (error: any) {
      setError(error.message || "Failed to apply coupon");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setAppliedCoupon(null);

    // Call the onApply callback with 0 discount
    if (onApply) {
      onApply(0);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      {appliedCoupon ? (
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">
              Applied:{" "}
              <span className="text-green-600 dark:text-green-400">
                {appliedCoupon.code}
              </span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {appliedCoupon.discountType === "PERCENTAGE"
                ? `${appliedCoupon.discountValue}% off`
                : appliedCoupon.discountType === "FREE_SHIPPING"
                ? "Free shipping"
                : `${formatPrice(appliedCoupon.discountValue)} off`}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRemoveCoupon}>
            Remove
          </Button>
        </div>
      ) : (
        <>
          <p className="text-sm font-medium mb-2">Have a coupon?</p>
          <div className="flex">
            <input
              type="text"
              className="flex-1 border-r-0 rounded-r-none rounded-l-md border border-gray-200 dark:border-gray-700 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-600 dark:bg-gray-800"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              disabled={isLoading}
            />
            <Button
              variant="default"
              className="rounded-l-none"
              onClick={handleApplyCoupon}
              disabled={isLoading || !couponCode.trim()}
            >
              {isLoading ? "Applying..." : "Apply"}
            </Button>
          </div>
          {error && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              {error}
            </p>
          )}
        </>
      )}
    </div>
  );
}
