"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQ {
  question: string;
  answer: string | React.ReactNode;
  category: string;
}

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const faqs: FAQ[] = [
    {
      question: "How long will it take to receive my order?",
      answer: (
        <>
          <p>
            Standard domestic shipping typically takes 3-5 business days after
            your order ships.
          </p>
          <p className="mt-2">
            Express shipping (1-2 business days) and international shipping
            options are also available during checkout.
          </p>
        </>
      ),
      category: "shipping",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can view shipping options for your location at checkout.",
      category: "shipping",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also view tracking information by logging into your account and navigating to the 'Orders' section.",
      category: "shipping",
    },
    {
      question: "What is your return policy?",
      answer:
        "We accept returns within 30 days of delivery for most products in their original condition. Please visit our Returns & Exchanges page for detailed instructions and exceptions.",
      category: "returns",
    },
    {
      question: "How do I initiate a return?",
      answer:
        "To initiate a return, log into your account, navigate to your order history, and select 'Return Items'. Follow the prompts to generate a return label and instructions.",
      category: "returns",
    },
    {
      question: "Will I get a refund for returned items?",
      answer:
        "Yes, once we receive and process your return, you'll be refunded to your original payment method. Processing typically takes 5-7 business days after we receive your items.",
      category: "returns",
    },
    {
      question: "Are all products covered by warranty?",
      answer:
        "Most electronics come with a manufacturer's warranty. The specific warranty period varies by product and brand. You can find warranty information on individual product pages.",
      category: "warranty",
    },
    {
      question: "How do I claim a warranty?",
      answer:
        "For warranty claims, please contact our customer service team with your order number and a description of the issue. We'll guide you through the process for your specific product.",
      category: "warranty",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, Google Pay, and shop-specific financing options through Affirm.",
      category: "payments",
    },
    {
      question: "Is my payment information secure?",
      answer:
        "Absolutely. We use industry-standard encryption and secure payment processors to ensure your payment information is protected during transmission and storage.",
      category: "payments",
    },
    {
      question: "Can I modify or cancel my order after placing it?",
      answer:
        "You can modify or cancel your order within 1 hour of placing it by contacting our customer service team. After that, we begin processing orders and may not be able to make changes.",
      category: "orders",
    },
    {
      question: "Do you offer price matching?",
      answer:
        "Yes, we offer price matching on identical products from major authorized retailers within 14 days of purchase. Contact our customer service team with proof of the lower price.",
      category: "pricing",
    },
  ];

  const categories = [
    { id: "all", name: "All FAQs" },
    { id: "shipping", name: "Shipping" },
    { id: "returns", name: "Returns" },
    { id: "warranty", name: "Warranty" },
    { id: "payments", name: "Payments" },
    { id: "orders", name: "Orders" },
    { id: "pricing", name: "Pricing" },
  ];

  const filteredFaqs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h1>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${
                  activeCategory === category.id
                    ? "bg-primary-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Search input - Placeholder for future enhancement */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <button
                className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium text-lg">{faq.question}</span>
                <svg
                  className={`w-5 h-5 transform transition-transform ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="max-w-3xl mx-auto mt-16 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm text-center">
          <h2 className="text-2xl font-semibold mb-4">Still Have Questions?</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Our customer support team is ready to help you with any other
            questions you might have.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/contact"
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="tel:+15551234567"
              className="px-6 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Call Us: (555) 123-4567
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
