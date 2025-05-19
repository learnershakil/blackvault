import { cn } from "@/lib/utils";

type SkeletonType =
  | "text"
  | "circle"
  | "avatar"
  | "card"
  | "product"
  | "button"
  | "image";

interface SkeletonLoaderProps {
  type?: SkeletonType;
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
  animate?: boolean;
}

export default function SkeletonLoader({
  type = "text",
  width,
  height,
  className = "",
  count = 1,
  animate = true,
}: SkeletonLoaderProps) {
  // Define style based on type
  const getTypeStyles = () => {
    switch (type) {
      case "text":
        return "h-4 w-full rounded";
      case "circle":
        return "rounded-full";
      case "avatar":
        return "rounded-full h-12 w-12";
      case "card":
        return "h-60 w-full rounded-lg";
      case "product":
        return "aspect-square w-full rounded-t-lg";
      case "button":
        return "h-10 w-24 rounded-md";
      case "image":
        return "aspect-video w-full rounded-lg";
      default:
        return "";
    }
  };

  const baseStyle = cn(
    "bg-gray-200 dark:bg-gray-700 animate-pulse",
    animate && "animate-shimmer",
    getTypeStyles(),
    className
  );

  // Custom inline styles
  const inlineStyle = {
    ...(width && { width: typeof width === "number" ? `${width}px` : width }),
    ...(height && {
      height: typeof height === "number" ? `${height}px` : height,
    }),
  };

  // If we need multiple skeletons
  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={baseStyle} style={inlineStyle}></div>
        ))}
      </div>
    );
  }

  return <div className={baseStyle} style={inlineStyle}></div>;
}
