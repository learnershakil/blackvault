import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "circle" | "card" | "text";
  animate?: boolean;
}

export function Skeleton({
  className,
  variant = "default",
  animate = true,
}: SkeletonProps) {
  const baseClasses = "bg-gray-200 dark:bg-gray-700 rounded";

  const variantClasses = {
    default: "",
    circle: "rounded-full",
    card: "rounded-lg",
    text: "h-4",
  };

  const animationClass = animate ? "animate-shimmer" : "";

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClass,
        className
      )}
    />
  );
}
