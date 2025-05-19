"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export interface DataColumn {
  header: string;
  accessorKey: string;
  align?: "left" | "right" | "center";
  format?: (value: any) => React.ReactNode;
}

interface DataTableProps {
  data: Record<string, any>[];
  columns: DataColumn[];
  title?: string;
  loading?: boolean;
  rowsPerPage?: number;
  onRowClick?: (row: Record<string, any>) => void;
}

export default function DataTable({
  data,
  columns,
  title,
  loading = false,
  rowsPerPage = 5,
  onRowClick,
}: DataTableProps) {
  const [page, setPage] = useState(0);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const start = page * rowsPerPage;
  const end = Math.min(start + rowsPerPage, data.length);
  const currentPageData = data.slice(start, end);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {title && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        )}

        <div className="p-4">
          <div className="space-y-4">
            {Array.from({ length: rowsPerPage }).map((_, i) => (
              <div
                key={i}
                className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {title && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-base">{title}</h3>
          </div>
        )}

        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {title && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-base">{title}</h3>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.accessorKey}
                  scope="col"
                  className={`px-6 py-3 text-xs font-medium tracking-wider text-gray-500 dark:text-gray-400 uppercase ${
                    column.align === "right"
                      ? "text-right"
                      : column.align === "center"
                      ? "text-center"
                      : "text-left"
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentPageData.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                className={`${onRowClick ? "cursor-pointer" : ""} 
                  ${
                    hoveredRow === rowIndex
                      ? "bg-gray-50 dark:bg-gray-700/50"
                      : ""
                  }`}
                onClick={() => onRowClick && onRowClick(row)}
                onMouseEnter={() => setHoveredRow(rowIndex)}
                onMouseLeave={() => setHoveredRow(null)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: rowIndex * 0.05 }}
              >
                {columns.map((column) => (
                  <td
                    key={column.accessorKey}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      column.align === "right"
                        ? "text-right"
                        : column.align === "center"
                        ? "text-center"
                        : "text-left"
                    }`}
                  >
                    {column.format
                      ? column.format(row[column.accessorKey])
                      : row[column.accessorKey]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex justify-between items-center">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{start + 1}</span> to{" "}
              <span className="font-medium">{end}</span> of{" "}
              <span className="font-medium">{data.length}</span> results
            </p>

            <div className="flex space-x-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-3 py-1 text-sm border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1 text-sm border rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
