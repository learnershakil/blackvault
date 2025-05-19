"use client";

import { useState } from "react";

interface PaymentOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodSelect: (methodId: string) => void;
}

export default function PaymentMethods({
  selectedMethod,
  onMethodSelect,
}: PaymentMethodsProps) {
  // Define available payment methods
  const paymentOptions: PaymentOption[] = [
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Pay securely with your card",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      id: "razorpay",
      name: "Razorpay",
      description: "Fast, secure payment processing",
      icon: (
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          stroke="none"
          fill="currentColor"
        >
          <path d="M8.5 8.5l7 7M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      description: "Pay when you receive your order",
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Payment Method
      </h3>
      {paymentOptions.map((option) => (
        <div
          key={option.id}
          onClick={() => onMethodSelect(option.id)}
          className={`p-4 border rounded-lg cursor-pointer transition-all ${
            selectedMethod === option.id
              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
              : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
          }`}
        >
          <div className="flex items-center">
            <input
              type="radio"
              name="payment-method"
              checked={selectedMethod === option.id}
              onChange={() => onMethodSelect(option.id)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
            />
            <div className="ml-3 flex items-center">
              <div className="text-gray-600 dark:text-gray-400">
                {option.icon}
              </div>
              <div className="ml-3">
                <p className="font-medium">{option.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {option.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
