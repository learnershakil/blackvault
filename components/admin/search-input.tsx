"use client";

import { useState } from "react";

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

export default function SearchInput({
  onSearch,
  placeholder = "Search...",
  defaultValue = "",
  className = "",
}: SearchInputProps) {
  const [searchQuery, setSearchQuery] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full md:max-w-xs ${className}`}
    >
      <div className="relative w-full">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full ps-10 p-2.5"
        />
        <button
          type="submit"
          className="absolute end-0 top-0 h-full px-3 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-e-lg border border-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300"
        >
          Search
        </button>
      </div>
    </form>
  );
}
