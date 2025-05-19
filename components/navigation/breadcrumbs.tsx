"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon } from "@/components/icons/home-icon";
import { ChevronRightIcon } from "@/components/icons/chevron-right-icon";
import { BreadcrumbStructuredData } from "@/components/seo/structured-data";

interface BreadcrumbItem {
  href: string;
  label: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  customSegments?: { [key: string]: string };
  excludeSegments?: string[];
  homeLabel?: string;
}

export default function Breadcrumbs({
  items,
  customSegments = {},
  excludeSegments = [],
  homeLabel = "Home",
}: BreadcrumbsProps) {
  const pathname = usePathname();

  // If items are provided directly, use those
  if (items) {
    return (
      <>
        {/* Include structured data for breadcrumbs */}
        <BreadcrumbStructuredData
          items={items.map((item) => ({
            name: item.label,
            url: item.href,
          }))}
        />

        <nav aria-label="Breadcrumb" className="py-3">
          <ol className="flex flex-wrap items-center space-x-1 text-sm">
            {items.map((item, index) => {
              const isLastItem = index === items.length - 1;

              return (
                <li key={item.href} className="flex items-center">
                  {index > 0 && (
                    <span className="mx-1 text-gray-400" aria-hidden="true">
                      /
                    </span>
                  )}

                  {isLastItem ? (
                    <span
                      className="font-medium text-gray-800 dark:text-gray-300"
                      aria-current="page"
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </>
    );
  }

  // Otherwise, generate breadcrumbs from the current URL path
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Filter out any excluded segments
  const filteredSegments = pathSegments.filter(
    (segment) => !excludeSegments.includes(segment)
  );

  // Generate breadcrumb items from path
  const breadcrumbItems: BreadcrumbItem[] = [];
  let currentPath = "";

  filteredSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLastSegment = index === filteredSegments.length - 1;

    // Use custom segment label if provided, otherwise format the segment
    const label =
      customSegments[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

    breadcrumbItems.push({
      href: isLastSegment ? "#" : currentPath,
      label,
    });
  });

  return (
    <>
      {/* Include structured data for breadcrumbs */}
      <BreadcrumbStructuredData
        items={breadcrumbItems.map((item) => ({
          name: item.label,
          url: item.href,
        }))}
      />

      <nav aria-label="Breadcrumb" className="py-3">
        <ol className="flex flex-wrap items-center space-x-1 text-sm">
          {breadcrumbItems.map((item, index) => {
            const isLastItem = index === breadcrumbItems.length - 1;

            return (
              <li key={item.href} className="flex items-center">
                {index > 0 && (
                  <span className="mx-1 text-gray-400" aria-hidden="true">
                    /
                  </span>
                )}

                {isLastItem ? (
                  <span
                    className="font-medium text-gray-800 dark:text-gray-300"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
