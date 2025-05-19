"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Button variant styles (reusing the core styles from Button)
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden",
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
      animation: {
        none: "",
        pulse: "animate-pulse-subtle",
        bounce: "animate-bounce-subtle",
        ripple: "", // Special handling for ripple effect
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
);

export interface AnimatedButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

export function AnimatedButton({
  className,
  variant,
  size,
  animation = "none",
  children,
  ...props
}: AnimatedButtonProps) {
  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (animation !== "ripple") return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement("span");
    ripple.style.position = "absolute";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.transform = "translate(-50%, -50%) scale(0)";
    ripple.style.background = "rgba(255, 255, 255, 0.4)";
    ripple.style.borderRadius = "50%";
    ripple.style.width = "0px";
    ripple.style.height = "0px";
    ripple.style.animation = "ripple 0.6s linear";

    // Add keyframes for the ripple animation if not already present
    if (!document.querySelector("style#ripple-style")) {
      const style = document.createElement("style");
      style.id = "ripple-style";
      style.textContent = `
        @keyframes ripple {
          to {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={cn(buttonVariants({ variant, size, animation }), className)}
      onClick={handleRipple}
      {...props}
    >
      {children}
    </motion.button>
  );
}
