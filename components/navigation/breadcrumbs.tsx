"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon } from "@/components/icons/home-icon";
import { ChevronRightIcon } from "@/components/icons/chevron-right-icon";

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
      <nav aria-label="Breadcrumb" className="py-3 text-sm">
        <ol className="flex items-center flex-wrap">
          <li className="flex items-center">
            <Link
              href="/"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 flex items-center"
            >
              <HomeIcon className="w-4 h-4 mr-2" />
              <span className="sr-only md:not-sr-only">{homeLabel}</span>
            </Link>
          </li>

          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              <ChevronRightIcon className="w-5 h-5 mx-2 text-gray-400" />
              {index === items.length - 1 ? (
                <span className="font-medium text-gray-800 dark:text-gray-200 truncate">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 truncate"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
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
    <nav aria-label="Breadcrumb" className="py-3 text-sm">
      <ol className="flex items-center flex-wrap">
        <li className="flex items-center">
          <Link
            href="/"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 flex items-center"
          >
            <HomeIcon className="w-4 h-4 mr-2" />
            <span className="sr-only md:not-sr-only">{homeLabel}</span>
          </Link>
        </li>

        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <ChevronRightIcon className="w-5 h-5 mx-2 text-gray-400" />
            {index === breadcrumbItems.length - 1 ? (
              <span className="font-medium text-gray-800 dark:text-gray-200 truncate">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 truncate"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
