"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ToastProps = {
  message: string;
  type: "success" | "error" | "info" | "warning";
  id: string;
  duration?: number;
  onRemove: (id: string) => void;
};

type ToasterProps = {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
};

const Toast = ({
  message,
  type,
  id,
  duration = 5000,
  onRemove,
}: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [id, duration, onRemove]);

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  };

  return (
    <div
      className={`${bgColor[type]} text-white p-4 rounded shadow-lg mb-2 min-w-[300px]`}
      role="alert"
    >
      <div className="flex justify-between">
        <div className="font-medium">{message}</div>
        <button
          onClick={() => onRemove(id)}
          className="text-white hover:text-gray-200 ml-4"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export function Toaster({ position = "bottom-right" }: ToasterProps) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Setup event listener for custom toast events
    const handleToast = (
      event: CustomEvent<Omit<ToastProps, "id" | "onRemove">>
    ) => {
      const { message, type, duration } = event.detail;
      addToast({ message, type, duration });
    };

    // @ts-ignore - CustomEvent type issues
    window.addEventListener("toast", handleToast);

    return () => {
      // @ts-ignore - CustomEvent type issues
      window.removeEventListener("toast", handleToast);
    };
  }, []);

  const addToast = ({
    message,
    type,
    duration,
  }: Omit<ToastProps, "id" | "onRemove">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { message, type, id, duration, onRemove }]);
  };

  const onRemove = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed ${positionClasses[position]} z-50 flex flex-col`}
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    document.body
  );
}

// Helper function to show toast from anywhere in the app
export function toast({
  message,
  type = "info",
  duration = 5000,
}: {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
}) {
  const event = new CustomEvent("toast", {
    detail: {
      message,
      type,
      duration,
    },
  });
  window.dispatchEvent(event);
}
