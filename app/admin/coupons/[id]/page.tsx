"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EditCouponPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [coupon, setCoupon] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch coupon details
  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const response = await fetch(`/api/coupons/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch coupon");
        }

        const data = await response.json();
        setCoupon(data);
      } catch (err: any) {
        console.error("Error fetching coupon:", err);
        setError(err.message || "Failed to load coupon details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id !== "new") {
      fetchCoupon();
    } else {
      // Initialize form for new coupon
      setCoupon({
        code: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minPurchase: null,
        maxUses: null,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        isActive: true,
      });
      setIsLoading(false);
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const formValues = Object.fromEntries(formData.entries());

      // Format data
      const couponData = {
        ...formValues,
        discountValue: parseFloat(formValues.discountValue as string),
        minPurchase: formValues.minPurchase
          ? parseFloat(formValues.minPurchase as string)
          : null,
        maxUses: formValues.maxUses
          ? parseInt(formValues.maxUses as string, 10)
          : null,
        isActive: formValues.isActive === "on",
      };

      // Create new coupon or update existing one
      const url = id === "new" ? "/api/coupons" : `/api/coupons/${id}`;
      const method = id === "new" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(couponData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save coupon");
      }

      // Redirect to coupons list
      router.push("/admin/coupons");
    } catch (err: any) {
      console.error("Error saving coupon:", err);
      setError(err.message || "Failed to save coupon");
      window.scrollTo(0, 0);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {id === "new" ? "Create New Coupon" : "Edit Coupon"}
        </h1>
        <Link href="/admin/coupons">
          <Button variant="outline">Back to Coupons</Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}

      {coupon && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-1">
                Coupon Code
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="code"
                name="code"
                defaultValue={coupon.code}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter a unique code for this coupon (e.g., SUMMER20)
              </p>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                defaultValue={coupon.description || ""}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Discount Type and Value */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="discountType"
                  className="block text-sm font-medium mb-1"
                >
                  Discount Type
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="discountType"
                  name="discountType"
                  defaultValue={coupon.discountType}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED_AMOUNT">Fixed Amount</option>
                  <option value="FREE_SHIPPING">Free Shipping</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="discountValue"
                  className="block text-sm font-medium mb-1"
                >
                  Discount Value
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="discountValue"
                  name="discountValue"
                  defaultValue={coupon.discountValue}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  For percentage, enter the percentage value (e.g., 20 for 20%)
                </p>
              </div>
            </div>

            {/* Min Purchase and Max Uses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="minPurchase"
                  className="block text-sm font-medium mb-1"
                >
                  Minimum Purchase
                </label>
                <input
                  type="number"
                  id="minPurchase"
                  name="minPurchase"
                  defaultValue={coupon.minPurchase || ""}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Minimum order amount to apply this coupon
                </p>
              </div>
              <div>
                <label
                  htmlFor="maxUses"
                  className="block text-sm font-medium mb-1"
                >
                  Maximum Uses
                </label>
                <input
                  type="number"
                  id="maxUses"
                  name="maxUses"
                  defaultValue={coupon.maxUses || ""}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Leave empty for unlimited uses
                </p>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium mb-1"
                >
                  Start Date
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  defaultValue={
                    new Date(coupon.startDate).toISOString().split("T")[0]
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium mb-1"
                >
                  End Date
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  defaultValue={
                    new Date(coupon.endDate).toISOString().split("T")[0]
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                defaultChecked={coupon.isActive}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm">
                Active
              </label>
            </div>

            {/* Submit buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link href="/admin/coupons">
                <Button variant="outline" type="button" disabled={isSaving}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSaving}>
                {isSaving
                  ? "Saving..."
                  : id === "new"
                  ? "Create Coupon"
                  : "Update Coupon"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
