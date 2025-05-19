"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CheckoutStepper from "@/components/checkout/checkout-stepper";
import OrderSummary from "@/components/checkout/order-summary";
import AddressSelector from "@/components/checkout/address-selector";
import PaymentMethods from "@/components/checkout/payment-methods";
import useCartStore, { CartItem } from "@/store/cart-store";
import { Address } from "@prisma/client";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import CouponForm from "@/components/checkout/coupon-form";

// Define checkout steps
const STEPS = ["Shipping", "Payment", "Review"];

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { items, totalPrice, clearCart } = useCartStore();

  // Checkout state
  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientItems, setClientItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Form data state
  const [checkoutData, setCheckoutData] = useState({
    shippingAddressId: "",
    billingAddressId: "",
    sameAsShipping: true,
    paymentMethod: "card",
    couponCode: "",
    // These will be calculated by the server but we estimate for display
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  });

  // Add state for coupon handling
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  // Initialize client-side state
  useEffect(() => {
    // Set cart items
    setClientItems(items);

    // Calculate estimated totals
    const subtotal = totalPrice();
    // Simple estimates - in a real app these would be calculated by the API
    const tax = subtotal * 0.1; // 10% tax rate
    const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100

    setCheckoutData((prev) => ({
      ...prev,
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping,
    }));

    setIsInitialized(true);
  }, [items, totalPrice]);

  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    // Only fetch addresses if authenticated
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch user addresses
  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await fetch("/api/user/address");
      if (!response.ok) throw new Error("Failed to fetch addresses");

      const addressData = await response.json();
      setAddresses(addressData);

      // Set default addresses if available
      const defaultShippingAddress = addressData.find(
        (addr: Address) =>
          addr.isDefault && (addr.type === "SHIPPING" || addr.type === "BOTH")
      );

      const defaultBillingAddress = addressData.find(
        (addr: Address) =>
          addr.isDefault && (addr.type === "BILLING" || addr.type === "BOTH")
      );

      setCheckoutData((prev) => ({
        ...prev,
        shippingAddressId: defaultShippingAddress?.id || "",
        billingAddressId: defaultBillingAddress?.id || "",
      }));
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError("Failed to load your saved addresses");
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Handle address changes
  const handleShippingAddressChange = (addressId: string) => {
    setCheckoutData((prev) => ({
      ...prev,
      shippingAddressId: addressId,
      billingAddressId: prev.sameAsShipping ? addressId : prev.billingAddressId,
    }));
  };

  const handleBillingAddressChange = (addressId: string) => {
    setCheckoutData((prev) => ({
      ...prev,
      billingAddressId: addressId,
    }));
  };

  // Handle checkbox for using shipping address as billing
  const handleSameAsShippingChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = e.target.checked;
    setCheckoutData((prev) => ({
      ...prev,
      sameAsShipping: checked,
      billingAddressId: checked ? prev.shippingAddressId : "",
    }));
  };

  // Handle payment method changes
  const handlePaymentMethodChange = (method: string) => {
    setCheckoutData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  // Handle step navigation
  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  // Submit the order
  const handleSubmitOrder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const orderData = {
        shippingAddressId: checkoutData.shippingAddressId,
        billingAddressId: checkoutData.billingAddressId,
        paymentMethod: checkoutData.paymentMethod,
        items: clientItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          variantSku: item.variantSku,
        })),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create order");
      }

      const { order } = await response.json();

      // Clear the cart
      clearCart();

      // Redirect to success page
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (err: any) {
      console.error("Error creating order:", err);
      setError(err.message || "Failed to place your order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add coupon validation function
  const validateCoupon = async (code: string) => {
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          cartTotal: checkoutData.subtotal,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Invalid coupon");
      }

      const data = await response.json();
      if (!data.valid) {
        throw new Error(data.message || "Invalid coupon");
      }

      // Apply coupon
      setAppliedCoupon(data.coupon);

      // Update checkout data
      setCheckoutData((prev) => ({
        ...prev,
        couponCode: code,
        discount: data.coupon.discountAmount,
        total:
          prev.subtotal + prev.tax + prev.shipping - data.coupon.discountAmount,
      }));

      setCouponError(null);
    } catch (err: any) {
      setCouponError(err.message || "Failed to apply coupon");
      throw err;
    }
  };

  // Function to remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    setCheckoutData((prev) => ({
      ...prev,
      couponCode: "",
      discount: 0,
      total: prev.subtotal + prev.tax + prev.shipping,
    }));
  };

  // Show loading state while initializing
  if (!isInitialized || authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to cart if empty
  if (clientItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Add some products to your cart before proceeding to checkout
        </p>
        <Button onClick={() => router.push("/products")}>
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Stepper component */}
        <CheckoutStepper
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={goToStep}
        />

        {/* Error display */}
        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-200 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main checkout content - changes based on current step */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {currentStep === 0 && (
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-6">
                <h2 className="text-xl font-semibold">Shipping Information</h2>

                {loadingAddresses ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                  </div>
                ) : (
                  <>
                    <AddressSelector
                      addresses={addresses}
                      selectedAddressId={checkoutData.shippingAddressId}
                      onAddressSelect={handleShippingAddressChange}
                      addressType="shipping"
                    />

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center mb-6">
                        <input
                          id="same-as-shipping"
                          name="sameAsShipping"
                          type="checkbox"
                          checked={checkoutData.sameAsShipping}
                          onChange={handleSameAsShippingChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="same-as-shipping"
                          className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                        >
                          Billing address is the same as shipping address
                        </label>
                      </div>

                      {!checkoutData.sameAsShipping && (
                        <AddressSelector
                          addresses={addresses}
                          selectedAddressId={checkoutData.billingAddressId}
                          onAddressSelect={handleBillingAddressChange}
                          addressType="billing"
                        />
                      )}
                    </div>

                    <div className="flex justify-end mt-6">
                      <Button
                        onClick={nextStep}
                        disabled={
                          !checkoutData.shippingAddressId ||
                          (!checkoutData.sameAsShipping &&
                            !checkoutData.billingAddressId)
                        }
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 1 && (
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-6">
                <h2 className="text-xl font-semibold">Payment Method</h2>

                <PaymentMethods
                  selectedMethod={checkoutData.paymentMethod}
                  onMethodSelect={handlePaymentMethodChange}
                />

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button onClick={nextStep}>Continue to Review</Button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 2 && (
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-6">
                <h2 className="text-xl font-semibold">Review Your Order</h2>

                <div className="space-y-6">
                  {/* Shipping address */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Shipping Address
                    </h3>
                    {checkoutData.shippingAddressId && (
                      <AddressSummary
                        address={
                          addresses.find(
                            (addr) => addr.id === checkoutData.shippingAddressId
                          )!
                        }
                      />
                    )}
                  </div>

                  {/* Billing address */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Billing Address
                    </h3>
                    {checkoutData.sameAsShipping ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Same as shipping address
                      </p>
                    ) : (
                      <AddressSummary
                        address={
                          addresses.find(
                            (addr) => addr.id === checkoutData.billingAddressId
                          )!
                        }
                      />
                    )}
                  </div>

                  {/* Payment method */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Method
                    </h3>
                    <p className="text-sm">
                      {checkoutData.paymentMethod === "card" &&
                        "Credit/Debit Card"}
                      {checkoutData.paymentMethod === "razorpay" && "Razorpay"}
                      {checkoutData.paymentMethod === "cod" &&
                        "Cash on Delivery"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                  <Button onClick={handleSubmitOrder} disabled={isLoading}>
                    {isLoading ? "Processing..." : "Place Order"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary (stays consistent across steps) */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={clientItems}
              subtotal={checkoutData.subtotal}
              shipping={checkoutData.shipping}
              tax={checkoutData.tax}
              discount={checkoutData.discount}
              total={checkoutData.total}
              editable={false}
            />

            {/* Add coupon form */}
            <div className="mt-4">
              <CouponForm
                onApplyCoupon={validateCoupon}
                onRemoveCoupon={removeCoupon}
                appliedCoupon={appliedCoupon}
                disabled={isLoading}
                cartTotal={checkoutData.subtotal}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component to display address information
function AddressSummary({ address }: { address: Address }) {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <p className="font-medium">
        {address.firstName} {address.lastName}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {address.address1}
        {address.address2 && <>, {address.address2}</>}
        <br />
        {address.city}, {address.state} {address.postalCode}
        <br />
        {address.country}
      </p>
      {address.phone && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {address.phone}
        </p>
      )}
    </div>
  );
}
