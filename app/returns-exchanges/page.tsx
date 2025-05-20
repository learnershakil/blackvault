import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Returns & Exchanges | BlackVault",
  description: "Learn about our returns and exchanges policy at BlackVault.",
};

export default function ReturnsPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Returns & Exchanges Policy</h1>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Our Promise</h2>
          <p className="mb-4">
            At BlackVault, we want you to be completely satisfied with your
            purchase. If you're not entirely happy with your order, we're here
            to help.
          </p>
          <div className="p-4 border-l-4 border-primary-500 bg-primary-50 dark:bg-primary-900/20 rounded">
            <p className="font-medium">
              We offer a 30-day return policy for most products, giving you
              peace of mind with your purchases.
            </p>
          </div>
        </section>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            Return Policy Overview
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Returns are accepted within 30 days of receiving your order.
            </li>
            <li>Items must be in their original condition and packaging.</li>
            <li>Original receipt or proof of purchase is required.</li>
            <li>Refunds will be issued to the original payment method.</li>
            <li>
              Shipping costs for returns are the responsibility of the customer
              unless the return is due to our error.
            </li>
          </ul>
        </section>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">How to Return an Item</h2>
          <ol className="list-decimal pl-5 space-y-4">
            <li>
              <h3 className="text-xl font-medium">Start your return online</h3>
              <p className="mt-1">
                Sign in to your account, find your order, and select "Return
                Items". Follow the prompts to complete your return request.
              </p>
            </li>
            <li>
              <h3 className="text-xl font-medium">Package your return</h3>
              <p className="mt-1">
                Securely pack the item in its original packaging if possible.
                Include all accessories, manuals, and parts that came with the
                product.
              </p>
            </li>
            <li>
              <h3 className="text-xl font-medium">Print your return label</h3>
              <p className="mt-1">
                After submitting your return request, you'll receive a return
                shipping label via email. Print this label and attach it to your
                package.
              </p>
            </li>
            <li>
              <h3 className="text-xl font-medium">Ship your return</h3>
              <p className="mt-1">
                Drop off your package at any authorized shipping location. We
                recommend getting a tracking number for your records.
              </p>
            </li>
            <li>
              <h3 className="text-xl font-medium">Receive your refund</h3>
              <p className="mt-1">
                Once we receive and process your return, a refund will be issued
                to your original payment method within 5-7 business days.
              </p>
            </li>
          </ol>
        </section>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Exchange Process</h2>
          <p className="mb-4">
            If you'd like to exchange an item rather than return it:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Start the return process as described above.</li>
            <li>Select "Exchange" as your return reason.</li>
            <li>
              Specify the item you'd like in exchange (same item, different
              size/color, etc.).
            </li>
            <li>
              If the exchange item has a different price, we'll charge or refund
              the difference.
            </li>
            <li>
              Once we receive your return, we'll process your exchange and ship
              the new item to you.
            </li>
          </ol>
          <p className="mt-4">
            For faster service, you may prefer to place a new order for the
            desired item and return the unwanted item for a refund separately.
          </p>
        </section>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            Items Not Eligible for Return
          </h2>
          <p className="mb-4">The following items cannot be returned:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Items marked as "Final Sale" or "Non-Returnable"</li>
            <li>Opened software, games, or digital content</li>
            <li>Gift cards and promotional codes</li>
            <li>Personalized or custom-made products</li>
            <li>Products with removed, damaged, or missing serial numbers</li>
            <li>
              Items showing signs of excessive use or damage caused after
              delivery
            </li>
          </ul>
        </section>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            Damaged or Defective Items
          </h2>
          <p className="mb-4">If you receive a damaged or defective item:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Contact us within 48 hours of receiving your order.</li>
            <li>
              Provide photos of the damaged item and packaging if possible.
            </li>
            <li>
              We'll arrange for a return shipping label at no cost to you.
            </li>
            <li>
              Once we receive the item, we'll send a replacement or issue a full
              refund including original shipping costs.
            </li>
          </ol>
        </section>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            Refund Processing Times
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-2 border dark:border-gray-600">
                    Payment Method
                  </th>
                  <th className="px-4 py-2 border dark:border-gray-600">
                    Processing Time
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    Credit/Debit Card
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    3-5 business days
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    PayPal
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    1-2 business days
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    Store Credit
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    Immediate
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    Gift Card
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    Immediate
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Note: Some banks may take additional time to process refunds to your
            account.
          </p>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
          <p className="mb-4">
            If you have any questions or need assistance with your return or
            exchange, our customer service team is ready to help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/contact"
              className="block p-4 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 rounded-lg text-center transition-colors"
            >
              <h3 className="text-lg font-medium text-primary-800 dark:text-primary-300 mb-1">
                Contact Us
              </h3>
              <p className="text-primary-700 dark:text-primary-400">
                Submit a support ticket
              </p>
            </Link>
            <Link
              href="/faqs"
              className="block p-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-center transition-colors"
            >
              <h3 className="text-lg font-medium mb-1">FAQs</h3>
              <p>Find answers to common questions</p>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
