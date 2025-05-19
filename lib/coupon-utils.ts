import { Coupon } from "@prisma/client";

/**
 * Calculate discount amount based on coupon and cart total
 */
export function calculateDiscount(coupon: Coupon, cartTotal: number): number {
  if (!coupon.isActive) {
    return 0;
  }

  const now = new Date();
  if (now < coupon.startDate || now > coupon.endDate) {
    return 0;
  }

  if (coupon.minPurchase && cartTotal < coupon.minPurchase.toNumber()) {
    return 0;
  }

  let discountAmount = 0;

  switch (coupon.discountType) {
    case "PERCENTAGE":
      discountAmount = cartTotal * (coupon.discountValue.toNumber() / 100);
      break;
    case "FIXED_AMOUNT":
      discountAmount = coupon.discountValue.toNumber();
      // Don't allow discount to exceed cart total
      if (discountAmount > cartTotal) {
        discountAmount = cartTotal;
      }
      break;
    case "FREE_SHIPPING":
      // This would be handled separately in shipping calculations
      discountAmount = 0;
      break;
  }

  return discountAmount;
}

/**
 * Format discount information for display
 */
export function formatCouponDiscount(coupon: Coupon): string {
  switch (coupon.discountType) {
    case "PERCENTAGE":
      return `${coupon.discountValue}% off`;
    case "FIXED_AMOUNT":
      return `$${coupon.discountValue} off`;
    case "FREE_SHIPPING":
      return "Free shipping";
    default:
      return "";
  }
}

/**
 * Check if a coupon is valid
 */
export function isCouponValid(coupon: Coupon, cartTotal: number = 0): boolean {
  const now = new Date();

  return (
    coupon.isActive &&
    now >= coupon.startDate &&
    now <= coupon.endDate &&
    (!coupon.maxUses || coupon.usesCount < coupon.maxUses) &&
    (!coupon.minPurchase || cartTotal >= coupon.minPurchase.toNumber())
  );
}

/**
 * Get the status message for a coupon
 */
export function getCouponStatus(coupon: Coupon): string {
  const now = new Date();

  if (!coupon.isActive) {
    return "Inactive";
  }

  if (now < coupon.startDate) {
    return "Upcoming";
  }

  if (now > coupon.endDate) {
    return "Expired";
  }

  if (coupon.maxUses && coupon.usesCount >= coupon.maxUses) {
    return "Fully used";
  }

  return "Active";
}
