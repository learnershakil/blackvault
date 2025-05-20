import React from "react";

export const metadata = {
  title: "Shipping Policy | BlackVault",
  description:
    "Learn about our shipping policies, delivery times, and shipping methods.",
};

export default function ShippingPolicyPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Shipping Policy</h1>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            Shipping Methods & Delivery Times
          </h2>
          <p className="mb-6">
            At BlackVault, we strive to provide fast, reliable shipping for all
            orders. We offer the following shipping options for domestic orders:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse mb-4">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-2 border dark:border-gray-600">
                    Shipping Method
                  </th>
                  <th className="px-4 py-2 border dark:border-gray-600">
                    Estimated Delivery Time
                  </th>
                  <th className="px-4 py-2 border dark:border-gray-600">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    Standard Shipping
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    3-5 business days
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    $5.99 (Free over $50)
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    Express Shipping
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    1-2 business days
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    $14.99
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    Next Day Delivery
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    Next business day if ordered before 12PM EST
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    $24.99
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            *Business days exclude weekends and holidays. Orders placed after
            3PM EST may be processed the following business day.
          </p>
        </section>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            International Shipping
          </h2>
          <p className="mb-4">
            We ship to most countries worldwide. International shipping rates
            and delivery times vary by location, package weight, and shipping
            method.
          </p>
          <p className="mb-4">
            International customers may be responsible for import duties, taxes,
            and customs clearance fees. These charges vary by country and are
            not included in our shipping costs.
          </p>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded">
            <p className="font-medium text-yellow-800 dark:text-yellow-300">
              Please note that international shipping times may be affected by
              customs processing in your country.
            </p>
          </div>
        </section>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Order Processing</h2>
          <p className="mb-4">
            Most orders are processed within 1 business day of payment
            confirmation. During high-volume periods (holidays, special sales),
            processing may take 1-2 additional business days.
          </p>
          <div className="space-y-4">
            <h3 className="text-xl font-medium">Order Status Definitions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold">Order Received</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Your order has been submitted but payment is still processing.
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold">Payment Confirmed</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Payment has been verified and your order is queued for
                  processing.
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold">Processing</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Your order is being prepared for shipping in our warehouse.
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold">Shipped</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Your order has been shipped and is on its way!
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Tracking Your Order</h2>
          <p className="mb-4">
            Once your order ships, you'll receive a confirmation email with
            tracking information. You can also track your order by:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              Logging into your BlackVault account and viewing your order
              history
            </li>
            <li>
              Clicking the tracking link in your shipping confirmation email
            </li>
            <li>Contacting our customer service team with your order number</li>
          </ul>
          <p>
            Please allow 24-48 hours after receiving your shipping confirmation
            for tracking information to become active.
          </p>
        </section>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Shipping Restrictions</h2>
          <p className="mb-4">
            Certain products cannot be shipped to specific locations due to
            local regulations or shipping carrier restrictions. These include:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Products containing lithium batteries to certain international
              destinations
            </li>
            <li>Oversized items to remote locations</li>
            <li>
              Products with specific import restrictions in certain countries
            </li>
          </ul>
          <p className="mt-4">
            If you have questions about shipping to your location, please{" "}
            <a href="/contact" className="text-primary-600 hover:underline">
              contact our customer service team
            </a>
            .
          </p>
        </section>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Free Shipping Policy</h2>
          <p className="mb-4">
            We offer free standard shipping on domestic orders over $50. Free
            shipping applies to:
          </p>
          <ul className="list-disc pl-5 space-y-2 mb-4">
            <li>
              Addresses within the contiguous United States (excludes Alaska,
              Hawaii, and US territories)
            </li>
            <li>Standard shipping method only (3-5 business days)</li>
          </ul>
          <p>
            Free shipping promotions may not be combined with certain other
            offers or discounts unless specifically stated.
          </p>
        </section>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            Shipping Address Changes
          </h2>
          <p className="mb-4">
            If you need to change your shipping address after placing your
            order:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Contact us within 1 hour of placing your order.</li>
            <li>
              Once your order status changes to "Processing," address changes
              may not be possible.
            </li>
            <li>
              Once shipped, we cannot redirect packages to a different address.
            </li>
          </ul>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            Contact Us About Shipping
          </h2>
          <p className="mb-4">
            If you have questions about shipping or need help with a specific
            order, our customer service team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/contact"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/faqs"
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              View FAQs
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
