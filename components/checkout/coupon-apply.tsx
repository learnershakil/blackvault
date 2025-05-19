"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CouponApplyProps {
  onApply: (code: string) => Promise<boolean>;
  onRemove?: () => void;
  appliedCoupon?: string | null;
}

export default function CouponApply({
  onApply,
  onRemove,
  appliedCoupon = null,
}: CouponApplyProps) {
  const [couponCode, setCouponCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!couponCode.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const success = await onApply(couponCode);
      if (!success) {
        setError("Invalid or expired coupon code");
      } else {
        setCouponCode("");
      }
    } catch (err: any) {
      setError(err.message || "Failed to apply coupon");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    onRemove?.();
    setError(null);
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-2 rounded-md">
        <div className="flex items-center">
          <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs font-medium py-1 px-2 rounded">
            {appliedCoupon}
          </span>
          <span className="text-green-700 dark:text-green-300 text-sm ml-2">
            Coupon applied
          </span>
        </div>
        <button
          onClick={handleRemoveCoupon}
          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApplyCoupon} className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
        />
        <Button type="submit" disabled={isValidating || !couponCode}>
          {isValidating ? "Applying..." : "Apply"}
        </Button>
      </div>
      {error && (
        <div className="text-sm text-red-500 dark:text-red-400">{error}</div>
      )}
    </form>
  );
}
