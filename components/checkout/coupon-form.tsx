"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface CouponFormProps {
  onApplyCoupon: (couponCode: string) => Promise<void>;
  onRemoveCoupon: () => void;
  appliedCoupon: {
    code: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
  } | null;
  disabled?: boolean;
  cartTotal: number;
}

export default function CouponForm({
  onApplyCoupon,
  onRemoveCoupon,
  appliedCoupon,
  disabled = false,
  cartTotal,
}: CouponFormProps) {
  const [couponCode, setCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim() || disabled) return;

    setIsLoading(true);
    setError(null);

    try {
      await onApplyCoupon(couponCode);
      setCouponCode("");
    } catch (err: any) {
      setError(err.message || "Invalid coupon code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
      {appliedCoupon ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-md p-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">{appliedCoupon.code}</span>
              <p className="text-sm text-green-700 dark:text-green-300">
                {appliedCoupon.discountType === "PERCENTAGE" &&
                  `${appliedCoupon.discountValue}% off`}
                {appliedCoupon.discountType === "FIXED_AMOUNT" &&
                  `${formatPrice(appliedCoupon.discountValue)} off`}
                {appliedCoupon.discountType === "FREE_SHIPPING" &&
                  "Free shipping"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">
                -{formatPrice(appliedCoupon.discountAmount)}
              </span>
              <button
                onClick={onRemoveCoupon}
                className="text-red-600 hover:text-red-800 dark:text-red-400 hover:dark:text-red-300"
                disabled={disabled || isLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleApplyCoupon} className="flex items-start gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-800 dark:text-white"
              disabled={disabled || isLoading}
            />
            {error && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {error}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={disabled || isLoading || !couponCode}
            variant="outline"
            size="sm"
          >
            {isLoading ? "Applying..." : "Apply"}
          </Button>
        </form>
      )}
    </div>
  );
}
