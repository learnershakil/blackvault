"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ShipmentFormProps {
  orderId: string;
  shipment?: any;
  onComplete: () => void;
}

export default function ShipmentForm({
  orderId,
  shipment,
  onComplete,
}: ShipmentFormProps) {
  const router = useRouter();
  const isEditing = !!shipment;

  const [formData, setFormData] = useState({
    carrier: shipment?.carrier || "",
    trackingNumber: shipment?.trackingNumber || "",
    status: shipment?.status || "PENDING",
    estimatedDelivery: shipment?.estimatedDelivery
      ? new Date(shipment.estimatedDelivery).toISOString().split("T")[0]
      : "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(!isEditing);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const url = isEditing
        ? `/api/orders/${orderId}/shipment/${shipment.id}`
        : `/api/orders/${orderId}/shipment`;

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save shipment details");
      }

      // Refresh the page data
      router.refresh();
      onComplete();
    } catch (err: any) {
      setError(
        err.message || "An error occurred while saving shipment details"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isFormVisible && isEditing) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsFormVisible(true)}
      >
        Update Shipment
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="carrier" className="block text-sm font-medium mb-1">
            Shipping Carrier
          </label>
          <input
            id="carrier"
            name="carrier"
            type="text"
            value={formData.carrier}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700"
            placeholder="e.g., UPS, FedEx, USPS"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="trackingNumber"
            className="block text-sm font-medium mb-1"
          >
            Tracking Number
          </label>
          <input
            id="trackingNumber"
            name="trackingNumber"
            type="text"
            value={formData.trackingNumber}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700"
            placeholder="e.g., 1Z9999999999999999"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700"
            disabled={isLoading}
          >
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="estimatedDelivery"
            className="block text-sm font-medium mb-1"
          >
            Estimated Delivery Date
          </label>
          <input
            id="estimatedDelivery"
            name="estimatedDelivery"
            type="date"
            value={formData.estimatedDelivery}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsFormVisible(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : isEditing
            ? "Update Shipment"
            : "Add Shipment"}
        </Button>
      </div>
    </form>
  );
}
