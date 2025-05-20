import React from "react";

export const metadata = {
  title: "Warranty Information | BlackVault",
  description:
    "Details about product warranties, coverage, and how to make warranty claims at BlackVault.",
};

export default function WarrantyPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Warranty Information</h1>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            Our Warranty Commitment
          </h2>
          <p className="mb-4">
            At BlackVault, we stand behind the quality of the products we sell.
            Most products sold through our store come with a manufacturer's
            warranty that covers defects in materials and workmanship.
          </p>
          <p>
            In addition to manufacturer warranties, we offer our own BlackVault
            Guarantee on select products, providing you with additional peace of
            mind with your purchase.
          </p>
        </section>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            Types of Warranty Coverage
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-2">
                Manufacturer's Warranty
              </h3>
              <p className="mb-2">
                Most new products sold by BlackVault come with the original
                manufacturer's warranty. These warranties vary by brand and
                product category.
              </p>
              <p>
                Manufacturer warranties typically cover defects in materials and
                workmanship but may not cover damage from accidents, misuse, or
                normal wear and tear.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">
                BlackVault Extended Warranty
              </h3>
              <p className="mb-2">
                For many electronics and appliances, you can purchase an
                extended warranty at checkout that provides coverage beyond the
                manufacturer's warranty period.
              </p>
              <p>
                Our extended warranties include additional benefits like
                accidental damage protection, power surge coverage, and
                no-deductible repairs.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">BlackVault Guarantee</h3>
              <p>
                Select products feature our BlackVault Guarantee, which provides
                a 60-day satisfaction guarantee in addition to any manufacturer
                warranty. If you're not completely satisfied, you can return
                these products within 60 days for a full refund.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            Standard Warranty Periods by Category
          </h2>
          <p className="mb-4">
            While warranty periods vary by manufacturer, these are typical
            warranty periods for products in our store:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-2 border dark:border-gray-600">
                    Product Category
                  </th>
                  <th className="px-4 py-2 border dark:border-gray-600">
                    Standard Warranty Period
                  </th>
                  <th className="px-4 py-2 border dark:border-gray-600">
                    Extended Options
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    Laptops & Desktops
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    1 year
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    +1, +2, or +3 years
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    Smartphones & Tablets
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    1 year
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    +1 or +2 years
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    TVs & Monitors
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    1-2 years
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    +2 or +3 years
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    Audio Equipment
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    1 year
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    +1 or +2 years
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    Gaming Consoles
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    1 year
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    +1 or +2 years
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    Accessories
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    90 days - 1 year
                  </td>
                  <td className="px-4 py-2 border dark:border-gray-600">
                    Varies by product
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Always check the specific product page for exact warranty details
            for each item.
          </p>
        </section>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            How to File a Warranty Claim
          </h2>

          <div className="space-y-6">
            <h3 className="text-xl font-medium">
              Option 1: Through BlackVault
            </h3>
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <p className="font-medium">Contact our customer service team</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Call us at (555) 123-4567 or email warranty@blackvault.com
                  with your order number and a description of the issue.
                </p>
              </li>
              <li>
                <p className="font-medium">Provide documentation</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Our team may request photos of the product, proof of purchase,
                  and a description of when the issue began.
                </p>
              </li>
              <li>
                <p className="font-medium">Receive your claim approval</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Within 1-2 business days, we'll provide instructions for next
                  steps, which may include returning the product, scheduling a
                  repair, or receiving a replacement.
                </p>
              </li>
              <li>
                <p className="font-medium">Resolution</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Depending on the warranty terms, we'll repair, replace, or
                  refund the product once we've received and evaluated the
                  returned item.
                </p>
              </li>
            </ol>
          </div>

          <div className="mt-8 space-y-6">
            <h3 className="text-xl font-medium">
              Option 2: Through Manufacturer
            </h3>
            <p className="mb-4">
              For some products, you may need to contact the manufacturer
              directly:
            </p>
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <p className="font-medium">Find warranty information</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Check the product manual, packaging, or manufacturer's website
                  for warranty contact information.
                </p>
              </li>
              <li>
                <p className="font-medium">Contact the manufacturer</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Reach out to the manufacturer's support department with your
                  product information and proof of purchase.
                </p>
              </li>
              <li>
                <p className="font-medium">Follow their process</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Complete any required forms and follow their specific warranty
                  claim procedures.
                </p>
              </li>
            </ol>
            <p className="mt-4 text-sm">
              If you need assistance with a manufacturer warranty claim, our
              customer service team is available to help guide you through the
              process.
            </p>
          </div>
        </section>

        <section className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Warranty Exclusions</h2>
          <p className="mb-4">
            Most warranties do not cover damage resulting from:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Accidents, drops, or liquid damage</li>
            <li>Misuse or abuse</li>
            <li>Unauthorized repairs or modifications</li>
            <li>Normal wear and tear</li>
            <li>Environmental factors (power surges, extreme weather, etc.)</li>
            <li>
              Improper installation or failure to follow product instructions
            </li>
          </ul>
          <div className="p-4 mt-4 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="font-medium">Extended Warranty Advantage</p>
            <p className="text-sm mt-1">
              Our extended warranty plans often cover many of these exclusions,
              including accidental damage and power surges, providing more
              comprehensive protection for your purchase.
            </p>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">
            Warranty & Support Contact Information
          </h2>
          <div className="space-y-4">
            <div>
              <p className="font-semibold">Warranty Support:</p>
              <p>Phone: (555) 123-4567</p>
              <p>Email: warranty@blackvault.com</p>
              <p>Hours: Monday-Friday, 9 AM - 6 PM EST</p>
            </div>

            <div>
              <p className="font-semibold">Extended Warranty Claims:</p>
              <p>Phone: (555) 987-6543</p>
              <p>Email: extended-warranty@blackvault.com</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
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
          </div>
        </section>
      </div>
    </main>
  );
}
