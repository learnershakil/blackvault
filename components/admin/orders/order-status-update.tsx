"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface OrderStatusUpdateProps {
  orderId: string;
  currentStatus: string;
  onComplete: () => void;
}

export default function OrderStatusUpdate({
  orderId,
  currentStatus,
  onComplete,
}: OrderStatusUpdateProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define available status options and valid transitions
  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "REFUNDED", label: "Refunded" },
  ];

  // Status transition rules
  const validTransitions: Record<string, string[]> = {
    PENDING: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "CANCELLED"],
    DELIVERED: ["REFUNDED"],
    CANCELLED: ["REFUNDED"],
    REFUNDED: [],
  };

  // Filter options based on valid transitions
  const availableOptions = statusOptions.filter(
    (option) =>
      option.value === currentStatus ||
      validTransitions[currentStatus]?.includes(option.value)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Check if status is changing
      if (
        status !== currentStatus &&
        !validTransitions[currentStatus]?.includes(status)
      ) {
        throw new Error("Invalid status transition");
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update order status");
      }

      // Refresh the page data
      router.refresh();
      onComplete();
    } catch (err: any) {
      setError(err.message || "An error occurred while updating status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-medium">Update Order Status</h3>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700"
            disabled={isLoading}
          >
            {availableOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Current status:{" "}
            {statusOptions.find((o) => o.value === currentStatus)?.label ||
              currentStatus}
          </p>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700"
            rows={3}
            placeholder="Add notes about this status change"
            disabled={isLoading}
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onComplete}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || status === currentStatus}>
          {isLoading ? "Updating..." : "Update Status"}
        </Button>
      </div>
    </form>
  );
}
