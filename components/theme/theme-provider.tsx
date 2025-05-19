"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  attribute = "data-theme",
  enableSystem = true,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    const initialColorValue = localStorage.getItem(storageKey);

    // Check for saved theme or use default
    let currentTheme: Theme;
    if (initialColorValue) {
      currentTheme = initialColorValue as Theme;
    } else if (enableSystem) {
      currentTheme = "system";
    } else {
      currentTheme = defaultTheme;
    }

    setTheme(currentTheme);
  }, [storageKey, defaultTheme, enableSystem]);

  useEffect(() => {
    const root = window.document.documentElement;

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
      root.style.colorScheme = systemTheme;
      root.setAttribute(attribute, systemTheme);
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(theme);
      root.style.colorScheme = theme;
      root.setAttribute(attribute, theme);
    }

    // Save to localStorage
    localStorage.setItem(storageKey, theme);
  }, [theme, attribute, storageKey]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const newTheme = mediaQuery.matches ? "dark" : "light";
      const root = window.document.documentElement;

      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
      root.style.colorScheme = newTheme;
      root.setAttribute(attribute, newTheme);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, attribute]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
