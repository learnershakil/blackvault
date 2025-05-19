import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline:
          "border border-[var(--border)] bg-transparent hover:bg-[var(--muted)]",
        secondary: "bg-secondary-600 text-white hover:bg-secondary-700",
        ghost: "hover:bg-[var(--muted)]",
        link: "underline-offset-4 hover:underline text-[var(--primary)]",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      children,
      disabled,
      type = "button",
      asChild = false,
      ...props
    },
    ref
  ) => {
    if (asChild) {
      // When used as a child, we'll let the parent handle rendering
      // but still provide the appropriate className
      return (
        <div
          className={cn(buttonVariants({ variant, size }), className)}
          role="none"
        >
          {children}
        </div>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={disabled}
        type={type}
        {...props}
        aria-disabled={disabled}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
