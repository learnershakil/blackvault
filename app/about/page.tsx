import React from "react";
import Image from "next/image";

export const metadata = {
  title: "About Us | BlackVault",
  description: "Learn more about BlackVault, our story, mission, and values.",
};

export default function AboutPage() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          About BlackVault
        </h1>

        <div className="mb-12 relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
          <Image
            src="/images/store-front.jpg"
            alt="BlackVault storefront"
            fill
            className="object-cover"
            priority
          />
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
          <p className="text-lg mb-4">
            Founded in 2020, BlackVault began as a small specialty store focused
            on delivering premium quality tech products with exceptional
            customer service. What started as a passion project quickly evolved
            into one of the fastest-growing online tech retailers in the
            country.
          </p>
          <p className="text-lg mb-4">
            Our founder, Alex Chen, recognized a gap in the market for a tech
            retailer that truly understood the needs of both casual users and
            tech enthusiasts. Drawing from years of experience in the technology
            sector, Alex built BlackVault on the principles of quality,
            accessibility, and exceptional service.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg mb-4">
            At BlackVault, our mission is to make cutting-edge technology
            accessible to everyone. We believe that great tech enhances lives,
            and our goal is to help our customers find the perfect products that
            match their needs, lifestyle, and budget.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Quality</h3>
              <p>
                We curate only the best products from trusted brands and
                manufacturers.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p>
                We're always on the lookout for the newest and most innovative
                tech products.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Customer Service</h3>
              <p>
                Our knowledgeable team is here to provide personalized support
                and guidance.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Our Team</h2>
          <p className="text-lg mb-4">
            Behind BlackVault is a diverse team of tech enthusiasts, industry
            experts, and customer service specialists. We're united by our
            passion for technology and our commitment to providing an
            outstanding shopping experience.
          </p>
          <p className="text-lg">
            From our product specialists who carefully select each item we
            carry, to our customer service representatives who are always ready
            to help, every member of our team contributes to making BlackVault
            the go-to destination for tech products.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Visit Us</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg mb-2">
                <strong>Headquarters:</strong>
              </p>
              <p className="mb-4">
                1234 Tech Avenue
                <br />
                San Francisco, CA 94105
                <br />
                United States
              </p>
              <p className="text-lg mb-2">
                <strong>Contact:</strong>
              </p>
              <p className="mb-1">Email: support@blackvault.com</p>
              <p>Phone: (555) 123-4567</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <p className="font-semibold mb-2">Hours of Operation:</p>
              <p className="mb-1">Monday - Friday: 9AM - 6PM PST</p>
              <p className="mb-1">Saturday: 10AM - 4PM PST</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
