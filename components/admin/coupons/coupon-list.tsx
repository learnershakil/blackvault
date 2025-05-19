"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface CouponListProps {
  coupons: any[];
}

export default function CouponList({
  coupons: initialCoupons,
}: CouponListProps) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDiscountDisplay = (coupon: any) => {
    switch (coupon.discountType) {
      case "PERCENTAGE":
        return `${coupon.discountValue}%`;
      case "FIXED_AMOUNT":
        return formatPrice(Number(coupon.discountValue));
      case "FREE_SHIPPING":
        return "Free Shipping";
      default:
        return "";
    }
  };

  const handleToggleActive = async (couponId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/coupons/${couponId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        // Update local state
        setCoupons((prevCoupons) =>
          prevCoupons.map((coupon) =>
            coupon.id === couponId
              ? { ...coupon, isActive: !coupon.isActive }
              : coupon
          )
        );
        // Refresh the page to ensure data is up-to-date
        router.refresh();
      }
    } catch (error) {
      console.error("Error toggling coupon status:", error);
    }
  };

  const handleDelete = async (couponId: string) => {
    setIsDeleting(couponId);

    try {
      const response = await fetch(`/api/coupons/${couponId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted coupon from the list
        setCoupons((prevCoupons) =>
          prevCoupons.filter((coupon) => coupon.id !== couponId)
        );
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Code
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Discount
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Period
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Usage
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {coupons.length > 0 ? (
            coupons.map((coupon) => (
              <tr
                key={coupon.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/70"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{coupon.code}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                    {coupon.description || "No description"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>{getDiscountDisplay(coupon)}</div>
                  {coupon.minPurchase && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Min. purchase: {formatPrice(Number(coupon.minPurchase))}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    {formatDate(coupon.startDate)} -{" "}
                    {formatDate(coupon.endDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    {coupon.usesCount || 0} used
                    {coupon.maxUses && ` / ${coupon.maxUses}`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      coupon.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleToggleActive(coupon.id, coupon.isActive)
                    }
                  >
                    {coupon.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Link href={`/admin/coupons/${coupon.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(coupon.id)}
                    disabled={isDeleting === coupon.id}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                  >
                    {isDeleting === coupon.id ? "Deleting..." : "Delete"}
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
              >
                No coupons found. Create your first coupon to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
