"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@/components/icons/search-icon";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  expanded?: boolean;
}

export default function SearchBar({
  placeholder = "Search products...",
  className = "",
  expanded = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(expanded);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  // Toggle search input visibility
  const toggleExpanded = () => {
    if (!expanded) {
      setIsExpanded(!isExpanded);

      // Focus input when expanded
      if (!isExpanded && inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }
  };

  // Close search on outside click
  useEffect(() => {
    if (!expanded && isExpanded) {
      const handleOutsideClick = (e: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
          setIsExpanded(false);
        }
      };

      document.addEventListener("click", handleOutsideClick);
      return () => document.removeEventListener("click", handleOutsideClick);
    }
  }, [isExpanded, expanded]);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="flex items-center">
        <button
          type="button"
          onClick={toggleExpanded}
          className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full ${
            isExpanded ? "text-primary-600" : ""
          }`}
          aria-label="Search"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
        <div
          className={`
            overflow-hidden transition-all duration-300 
            ${expanded ? "w-auto" : isExpanded ? "w-48 md:w-60" : "w-0"}
          `}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`
              w-full py-1 px-2 text-sm border-b-2 border-gray-200 dark:border-gray-700
              focus:border-primary-600 dark:focus:border-primary-600
              bg-transparent outline-none
            `}
          />
        </div>
        <button
          type="submit"
          className={`
            ${isExpanded || expanded ? "block" : "hidden"}
            ml-1 px-2 py-1 text-xs rounded
            text-primary-600 hover:text-primary-700 dark:text-primary-400
          `}
        >
          Search
        </button>
      </form>
    </div>
  );
}
