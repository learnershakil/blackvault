import { useState, useEffect } from "react";
import useSWR, { SWRConfiguration } from "swr";
import { swrConfig } from "@/lib/cache-config";

// Generic fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.message = await response.text();
    throw error;
  }
  return response.json();
};

interface UseApiQueryOptions<T> extends SWRConfiguration {
  initialData?: T;
  shouldFetch?: boolean;
}

export function useApiQuery<T>(
  url: string | null,
  options: UseApiQueryOptions<T> = {}
) {
  const { initialData, shouldFetch = true, ...swrOptions } = options;

  // Only fetch if url is provided and shouldFetch is true
  const { data, error, isLoading, isValidating, mutate } = useSWR<T>(
    shouldFetch ? url : null,
    fetcher,
    {
      ...swrConfig,
      ...swrOptions,
      fallbackData: initialData,
    }
  );

  // Add a state to track first successful load
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (data && !isLoading && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [data, isLoading, hasLoaded]);

  return {
    data,
    isLoading: isLoading && !hasLoaded,
    isValidating,
    isError: !!error,
    error,
    mutate,
    hasLoaded,
  };
}
