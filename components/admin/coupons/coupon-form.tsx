"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface CouponFormProps {
  coupon?: any; // The existing coupon data for editing
  onSuccess?: () => void;
}

export default function CouponForm({ coupon, onSuccess }: CouponFormProps) {
  const isEditing = !!coupon;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form data state
  const [formData, setFormData] = useState({
    code: coupon?.code || "",
    description: coupon?.description || "",
    discountType: coupon?.discountType || "PERCENTAGE",
    discountValue: coupon?.discountValue || "",
    minPurchase: coupon?.minPurchase || "",
    maxUses: coupon?.maxUses || "",
    startDate: coupon?.startDate
      ? new Date(coupon.startDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    endDate: coupon?.endDate
      ? new Date(coupon.endDate).toISOString().split("T")[0]
      : new Date(new Date().setMonth(new Date().getMonth() + 1))
          .toISOString()
          .split("T")[0],
    isActive: coupon?.isActive ?? true,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Handle checkbox input
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate the coupon code
      if (!formData.code.trim()) {
        throw new Error("Coupon code is required");
      }

      // Validate discount value
      if (
        !formData.discountValue ||
        parseFloat(formData.discountValue.toString()) <= 0
      ) {
        throw new Error("Discount value must be greater than 0");
      }

      // Validate percentage value (must be between 0-100)
      if (
        formData.discountType === "PERCENTAGE" &&
        (parseFloat(formData.discountValue.toString()) <= 0 ||
          parseFloat(formData.discountValue.toString()) > 100)
      ) {
        throw new Error("Percentage discount must be between 1 and 100");
      }

      // Validate dates
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate <= startDate) {
        throw new Error("End date must be after start date");
      }

      // Construct the request body
      const couponData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue.toString()),
        minPurchase: formData.minPurchase
          ? parseFloat(formData.minPurchase.toString())
          : null,
        maxUses: formData.maxUses
          ? parseInt(formData.maxUses.toString())
          : null,
      };

      // Send request to API
      const url = isEditing ? `/api/coupons/${coupon.id}` : "/api/coupons";
      const method = isEditing ? "PATCH" : "POST";

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

      // Handle success
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/coupons");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coupon Code */}
        <div className="col-span-1">
          <label htmlFor="code" className="block text-sm font-medium mb-1">
            Coupon Code *
          </label>
          <input
            id="code"
            name="code"
            type="text"
            value={formData.code}
            onChange={handleChange}
            disabled={isEditing} // Cannot change code if editing
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white uppercase"
            placeholder="e.g., SUMMER25"
            required
          />
          {isEditing && (
            <p className="mt-1 text-xs text-gray-500">
              Coupon codes cannot be changed after creation
            </p>
          )}
        </div>

        {/* Discount Type */}
        <div className="col-span-1">
          <label
            htmlFor="discountType"
            className="block text-sm font-medium mb-1"
          >
            Discount Type *
          </label>
          <select
            id="discountType"
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED_AMOUNT">Fixed Amount</option>
            <option value="FREE_SHIPPING">Free Shipping</option>
          </select>
        </div>

        {/* Discount Value */}
        <div className="col-span-1">
          <label
            htmlFor="discountValue"
            className="block text-sm font-medium mb-1"
          >
            Discount Value *
          </label>
          <div className="relative">
            <input
              id="discountValue"
              name="discountValue"
              type="number"
              step="0.01"
              min="0"
              max={formData.discountType === "PERCENTAGE" ? "100" : undefined}
              value={formData.discountValue}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder={
                formData.discountType === "PERCENTAGE"
                  ? "e.g., 25"
                  : "e.g., 10.00"
              }
              required
            />
            <span className="absolute right-3 top-2">
              {formData.discountType === "PERCENTAGE"
                ? "%"
                : formData.discountType === "FIXED_AMOUNT"
                ? "$"
                : ""}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {formData.discountType === "PERCENTAGE"
              ? "Enter a percentage between 1-100"
              : formData.discountType === "FIXED_AMOUNT"
              ? "Enter a fixed amount discount"
              : "Enter the shipping cost to be discounted"}
          </p>
        </div>

        {/* Minimum Purchase */}
        <div className="col-span-1">
          <label
            htmlFor="minPurchase"
            className="block text-sm font-medium mb-1"
          >
            Minimum Purchase Amount
          </label>
          <div className="relative">
            <input
              id="minPurchase"
              name="minPurchase"
              type="number"
              step="0.01"
              min="0"
              value={formData.minPurchase}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              placeholder="e.g., 50.00"
            />
            <span className="absolute right-3 top-2">$</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Leave empty for no minimum purchase requirement
          </p>
        </div>

        {/* Maximum Uses */}
        <div className="col-span-1">
          <label htmlFor="maxUses" className="block text-sm font-medium mb-1">
            Maximum Uses
          </label>
          <input
            id="maxUses"
            name="maxUses"
            type="number"
            min="0"
            step="1"
            value={formData.maxUses}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="e.g., 100"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty for unlimited uses
          </p>
        </div>

        {/* Start Date */}
        <div className="col-span-1">
          <label htmlFor="startDate" className="block text-sm font-medium mb-1">
            Start Date *
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* End Date */}
        <div className="col-span-1">
          <label htmlFor="endDate" className="block text-sm font-medium mb-1">
            End Date *
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            placeholder="Enter coupon description"
            rows={3}
          />
        </div>

        {/* Active Status */}
        <div className="col-span-2">
          <div className="flex items-center">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
            >
              Coupon is active
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/coupons")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Coupon"
            : "Create Coupon"}
        </Button>
      </div>
    </form>
  );
}
