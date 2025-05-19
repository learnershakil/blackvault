import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import CouponForm from "@/components/admin/coupons/coupon-form";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Edit Coupon | BlackVault Admin",
};

export default async function EditCouponPage({
  params,
}: {
  params: { id: string };
}) {
  const coupon = await prisma.coupon.findUnique({
    where: { id: params.id },
  });

  if (!coupon) {
    notFound();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Coupon: {coupon.code}</h1>
        <Link href="/admin/coupons">
          <Button variant="outline">Back to Coupons</Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <CouponForm coupon={coupon} />
      </div>
    </div>
  );
}
