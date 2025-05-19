"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  expanded?: boolean;
  className?: string;
}

export default function SearchBar({
  expanded = false,
  className = "",
}: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  return (
    <div className={`relative ${className}`}>
      <motion.form
        onSubmit={handleSubmit}
        className={`relative flex items-center ${
          isExpanded ? "w-full sm:w-64" : "w-10"
        }`}
      >
        <motion.button
          type="button"
          onClick={() => !isExpanded && setIsExpanded(true)}
          className={`absolute left-0 top-0 flex items-center justify-center h-10 w-10 p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 ${
            isExpanded ? "pointer-events-none" : ""
          }`}
          whileHover={!isExpanded ? { scale: 1.1 } : {}}
          whileTap={!isExpanded ? { scale: 0.9 } : {}}
        >
          <svg
            className={`w-5 h-5 ${
            !isExpanded ? "mb-8" : "mt-4"
          }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </motion.button>

        <AnimatePresence>
          {isExpanded && (
            <motion.input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 mt-2 pr-4 py-2 w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "100%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onBlur={() => {
                if (query.trim() === "" && !expanded) {
                  setIsExpanded(false);
                }
              }}
            />
          )}
        </AnimatePresence>
      </motion.form>
    </div>
  );
}
