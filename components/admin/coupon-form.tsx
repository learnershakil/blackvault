"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface CouponFormProps {
  coupon?: any;
  isEditing?: boolean;
}

export default function CouponForm({
  coupon,
  isEditing = false,
}: CouponFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    minPurchase: 0,
    maxUses: 0,
    startDate: formatDateForInput(new Date()),
    endDate: formatDateForInput(getDefaultEndDate()),
    isActive: true,
  });

  // Initialize form with coupon data if in edit mode
  useEffect(() => {
    if (isEditing && coupon) {
      setFormData({
        code: coupon.code || "",
        description: coupon.description || "",
        discountType: coupon.discountType || "PERCENTAGE",
        discountValue: coupon.discountValue || 0,
        minPurchase: coupon.minPurchase || 0,
        maxUses: coupon.maxUses || 0,
        startDate: formatDateForInput(new Date(coupon.startDate)),
        endDate: formatDateForInput(new Date(coupon.endDate)),
        isActive: coupon.isActive !== undefined ? coupon.isActive : true,
      });
    }
  }, [coupon, isEditing]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "discountValue" ||
            name === "minPurchase" ||
            name === "maxUses"
          ? parseFloat(value) || 0
          : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url = isEditing ? `/api/coupons/${coupon.id}` : "/api/coupons";

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save coupon");
      }

      // Redirect back to coupons page on success
      router.push("/admin/coupons");
    } catch (err: any) {
      console.error("Error saving coupon:", err);
      setError(err.message || "An error occurred while saving the coupon");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Coupon Code */}
        <div>
          <label htmlFor="code" className="block text-sm font-medium mb-1">
            Coupon Code <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
            required
            disabled={isLoading || (isEditing && true)} // Disable code editing in edit mode
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Unique code for this coupon (e.g. SUMMER20)
          </p>
        </div>

        {/* Discount Type */}
        <div>
          <label
            htmlFor="discountType"
            className="block text-sm font-medium mb-1"
          >
            Discount Type <span className="text-red-600">*</span>
          </label>
          <select
            id="discountType"
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
            required
            disabled={isLoading}
          >
            <option value="PERCENTAGE">Percentage Discount</option>
            <option value="FIXED_AMOUNT">Fixed Amount Discount</option>
            <option value="FREE_SHIPPING">Free Shipping</option>
          </select>
        </div>

        {/* Discount Value */}
        <div>
          <label
            htmlFor="discountValue"
            className="block text-sm font-medium mb-1"
          >
            Discount Value <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center">
            {formData.discountType === "PERCENTAGE" && (
              <span className="inline-flex items-center px-3 h-10 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                %
              </span>
            )}
            {formData.discountType === "FIXED_AMOUNT" && (
              <span className="inline-flex items-center px-3 h-10 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                $
              </span>
            )}
            <input
              type="number"
              id="discountValue"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              min="0"
              step={formData.discountType === "PERCENTAGE" ? "1" : "0.01"}
              className={`w-full p-2 border border-gray-300 dark:border-gray-600 ${
                formData.discountType === "FREE_SHIPPING"
                  ? "rounded-md"
                  : "rounded-r-md"
              } focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white`}
              required
              disabled={isLoading || formData.discountType === "FREE_SHIPPING"}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {formData.discountType === "PERCENTAGE"
              ? "Percentage off the order total"
              : formData.discountType === "FIXED_AMOUNT"
              ? "Fixed amount discount in dollars"
              : "No value needed for free shipping"}
          </p>
        </div>

        {/* Minimum Purchase */}
        <div>
          <label
            htmlFor="minPurchase"
            className="block text-sm font-medium mb-1"
          >
            Minimum Purchase Amount
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 h-10 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
              $
            </span>
            <input
              type="number"
              id="minPurchase"
              name="minPurchase"
              value={formData.minPurchase}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-r-md focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
              disabled={isLoading}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Minimum order amount required (0 for no minimum)
          </p>
        </div>

        {/* Max Uses */}
        <div>
          <label htmlFor="maxUses" className="block text-sm font-medium mb-1">
            Maximum Uses
          </label>
          <input
            type="number"
            id="maxUses"
            name="maxUses"
            value={formData.maxUses}
            onChange={handleChange}
            min="0"
            step="1"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Maximum number of times this coupon can be used (0 for unlimited)
          </p>
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium mb-1">
            Start Date <span className="text-red-600">*</span>
          </label>
          <input
            type="datetime-local"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
            required
            disabled={isLoading}
          />
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium mb-1">
            End Date <span className="text-red-600">*</span>
          </label>
          <input
            type="datetime-local"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
            required
            disabled={isLoading}
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
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
            rows={3}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Optional description for internal reference
          </p>
        </div>

        {/* Is Active */}
        <div className="md:col-span-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label
              htmlFor="isActive"
              className="ml-2 block text-sm font-medium"
            >
              Active
            </label>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Whether this coupon is currently active
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/coupons")}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : isEditing
            ? "Update Coupon"
            : "Create Coupon"}
        </Button>
      </div>
    </form>
  );
}

// Helper functions for date formatting
function formatDateForInput(date: Date): string {
  return date.toISOString().slice(0, 16);
}

function getDefaultEndDate(): Date {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date;
}
