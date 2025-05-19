"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(1);
  const [contrast, setContrast] = useState<"default" | "high" | "inverted">(
    "default"
  );

  // Apply font size changes
  const applyFontSize = (size: number) => {
    setFontSize(size);
    document.documentElement.style.fontSize = `${size * 100}%`;
  };

  // Apply contrast changes
  const applyContrast = (contrastMode: "default" | "high" | "inverted") => {
    setContrast(contrastMode);

    // Remove any previous contrast classes
    document.body.classList.remove("high-contrast", "inverted-colors");

    // Add the selected contrast class
    if (contrastMode === "high") {
      document.body.classList.add("high-contrast");
    } else if (contrastMode === "inverted") {
      document.body.classList.add("inverted-colors");
    }
  };

  // Reset all accessibility settings
  const resetSettings = () => {
    applyFontSize(1);
    applyContrast("default");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Accessibility toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg"
        aria-expanded={isOpen}
        aria-label="Accessibility options"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      </button>

      {/* Accessibility panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-64 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium mb-3">Accessibility Options</h3>

          {/* Font size controls */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Text Size</h4>
            <div className="flex items-center justify-between">
              <button
                onClick={() => applyFontSize(Math.max(0.8, fontSize - 0.1))}
                className="w-8 h-8 flex items-center justify-center border rounded"
                aria-label="Decrease text size"
              >
                A-
              </button>
              <span className="mx-2">{Math.round(fontSize * 100)}%</span>
              <button
                onClick={() => applyFontSize(Math.min(1.5, fontSize + 0.1))}
                className="w-8 h-8 flex items-center justify-center border rounded"
                aria-label="Increase text size"
              >
                A+
              </button>
            </div>
          </div>

          {/* Contrast controls */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Contrast</h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => applyContrast("default")}
                className={cn(
                  "px-2 py-1 border rounded text-xs",
                  contrast === "default" && "bg-blue-100 border-blue-500"
                )}
                aria-pressed={contrast === "default"}
              >
                Normal
              </button>
              <button
                onClick={() => applyContrast("high")}
                className={cn(
                  "px-2 py-1 border rounded text-xs",
                  contrast === "high" && "bg-blue-100 border-blue-500"
                )}
                aria-pressed={contrast === "high"}
              >
                High
              </button>
              <button
                onClick={() => applyContrast("inverted")}
                className={cn(
                  "px-2 py-1 border rounded text-xs",
                  contrast === "inverted" && "bg-blue-100 border-blue-500"
                )}
                aria-pressed={contrast === "inverted"}
              >
                Inverted
              </button>
            </div>
          </div>

          {/* Reset button */}
          <Button onClick={resetSettings} variant="outline" className="w-full">
            Reset All
          </Button>
        </div>
      )}
    </div>
  );
}
