import { cn } from "@/lib/utils";

type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export default function OrderStatusBadge({
  status,
  className,
}: OrderStatusBadgeProps) {
  // Get badge color based on status
  const getBadgeStyles = () => {
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
  };

  // Format status text for display
  const formatStatus = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <span
      className={cn(
        "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full",
        getBadgeStyles(),
        className
      )}
    >
      {formatStatus(status)}
    </span>
  );
}
