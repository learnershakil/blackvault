"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { motion, useAnimation, Variant } from "framer-motion";

type AnimationDirection = "up" | "down" | "left" | "right" | "fade" | "scale";
type AnimationVariant = Record<string, Variant>;

interface ScrollRevealProps {
  children: ReactNode;
  animation?: AnimationDirection;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
  Reset?: boolean;
}

export default function ScrollReveal({
  children,
  animation = "up",
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  className = "",
  once = true,
  Reset = false,
}: ScrollRevealProps) {
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Animation variants
  const variants: Record<AnimationDirection, AnimationVariant> = {
    up: {
      hidden: { y: 50, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    },
    down: {
      hidden: { y: -50, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    },
    left: {
      hidden: { x: -50, opacity: 0 },
      visible: { x: 0, opacity: 1 },
    },
    right: {
      hidden: { x: 50, opacity: 0 },
      visible: { x: 0, opacity: 1 },
    },
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    scale: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { scale: 1, opacity: 1 },
    },
  };

  useEffect(() => {
    // Skip animation if disabled
    if (!animation || (once && hasAnimated)) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If element is in view
        if (entry.isIntersecting) {
          controls.start("visible");
          setHasAnimated(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once || Reset) {
          controls.start("hidden");
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [animation, controls, hasAnimated, once, Reset, threshold]);

  // Return early with children if animation is not specified
  if (!animation) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={variants[animation]}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
