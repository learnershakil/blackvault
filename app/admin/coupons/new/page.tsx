import { Button } from "@/components/ui/button";
import CouponForm from "@/components/admin/coupon-form";
import Link from "next/link";

export const metadata = {
  title: "Add New Coupon | BlackVault Admin",
};

export default function CreateCouponPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Coupon</h1>
        <p className="text-muted-foreground">
          Create a new coupon code for your customers
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <CouponForm />
      </div>
    </div>
  );
}
