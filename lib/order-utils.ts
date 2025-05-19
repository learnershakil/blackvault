/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
  const prefix = "BV";
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${timestamp}${random}`;
}

/**
 * Calculate order subtotal
 */
export function calculateSubtotal(
  items: { price: number; quantity: number }[]
): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

/**
 * Calculate tax amount
 */
export function calculateTax(subtotal: number, taxRate: number = 0.1): number {
  return subtotal * taxRate;
}

/**
 * Calculate shipping cost
 */
export function calculateShipping(
  subtotal: number,
  freeShippingThreshold: number = 100
): number {
  return subtotal >= freeShippingThreshold ? 0 : 10;
}

/**
 * Format date for display
 */
export function formatOrderDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Get human-readable order status
 */
export function getOrderStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    PENDING: "Pending",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
  };

  return statusMap[status] || status;
}

/**
 * Get status color class for UI
 */
export function getOrderStatusColor(status: string): string {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "SHIPPED":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
    case "DELIVERED":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "CANCELLED":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "REFUNDED":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
}

/**
 * Check if a status transition is valid
 */
export function isValidStatusTransition(
  currentStatus: string,
  newStatus: string
): boolean {
  const validTransitions: Record<string, string[]> = {
    PENDING: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED", "CANCELLED"],
    SHIPPED: ["DELIVERED", "CANCELLED"],
    DELIVERED: ["REFUNDED"],
    CANCELLED: ["REFUNDED"],
    REFUNDED: [],
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
}
