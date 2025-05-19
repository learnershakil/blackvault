"use client";

import React, { useState, useEffect, useRef } from "react";

interface LazyComponentProps {
  children: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  placeholder?: React.ReactNode;
  className?: string;
}

export default function LazyComponent({
  children,
  threshold = 0.1,
  rootMargin = "0px",
  placeholder,
  className,
}: LazyComponentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [rootMargin, threshold]);

  return (
    <div ref={ref} className={className}>
      {isVisible
        ? children
        : placeholder || (
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded min-h-[150px] w-full"></div>
          )}
    </div>
  );
}
