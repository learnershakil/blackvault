/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
  const dateStr = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "")
    .substring(2); // YYMMDD

  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `BV-${dateStr}-${randomStr}`;
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

  return statusMap[status] || "Unknown";
}

/**
 * Get status color class for UI
 */
export function getOrderStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    PENDING:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    PROCESSING:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    SHIPPED:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    DELIVERED:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    REFUNDED:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  };

  return (
    colorMap[status] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
  );
}
