export default function ProductListingSkeleton() {
  return (
    <div>
      {/* Results summary skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
      </div>

      {/* Products grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
          >
            <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
            <div className="p-4">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="mt-10 flex justify-center">
        <div className="flex space-x-2 animate-pulse">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-9 w-10 bg-gray-200 dark:bg-gray-700 rounded"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
