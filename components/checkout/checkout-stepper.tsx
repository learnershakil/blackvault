"use client";

import { cn } from "@/lib/utils";

interface StepperProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function CheckoutStepper({
  steps,
  currentStep,
  onStepClick,
}: StepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex-1 relative">
            <div
              className={cn(
                "flex flex-col items-center",
                index < steps.length - 1 && "relative"
              )}
            >
              {/* Step connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-4 left-1/2 w-full h-0.5",
                    index < currentStep
                      ? "bg-primary-600 dark:bg-primary-400"
                      : "bg-gray-200 dark:bg-gray-700"
                  )}
                />
              )}

              {/* Step circle */}
              <button
                disabled={!onStepClick || index > currentStep}
                onClick={() => onStepClick?.(index)}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors",
                  index < currentStep
                    ? "bg-primary-600 text-white dark:bg-primary-500"
                    : index === currentStep
                    ? "bg-primary-600 text-white dark:bg-primary-500 ring-4 ring-primary-100 dark:ring-primary-900"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400",
                  onStepClick && index <= currentStep && "cursor-pointer"
                )}
              >
                {index < currentStep ? (
                  // Checkmark for completed steps
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  // Step number
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </button>

              {/* Step label */}
              <span
                className={cn(
                  "mt-2 text-xs font-medium",
                  index <= currentStep
                    ? "text-gray-900 dark:text-gray-100"
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {step}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
