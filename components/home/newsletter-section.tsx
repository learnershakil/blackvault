"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send this to your API
    console.log(`Subscribing email: ${email}`);
    setSubmitted(true);
    setEmail("");

    // Reset the submitted state after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <section className="bg-gradient-to-b from-primary-50 to-white dark:from-primary-950/30 dark:to-gray-950 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-100 dark:bg-primary-900/20 rounded-full"></div>
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-secondary-100 dark:bg-secondary-900/20 rounded-full"></div>

          <div className="relative">
            <div className="text-center mb-8">
              <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-sm font-medium py-1 px-3 rounded-full">
                Stay In Touch
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">
                Never Miss a Beat
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Subscribe to our newsletter to receive updates on new products,
                special offers, and exclusive deals directly to your inbox.
              </p>
            </div>

            {submitted ? (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 text-green-800 dark:text-green-200 text-center animate-fade-in">
                <svg
                  className="w-6 h-6 mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="font-medium">Thank you for subscribing!</p>
                <p className="text-sm mt-1">
                  You'll now receive our latest updates.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-grow px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="whitespace-nowrap bg-primary-600 hover:bg-primary-700 text-white font-medium px-6"
                  >
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  By subscribing, you agree to our Privacy Policy and consent to
                  receive updates from our company.
                </p>
              </form>
            )}

            <div className="flex justify-center mt-8 space-x-8 text-muted-foreground">
              <div className="flex flex-col items-center">
                <span className="font-bold text-2xl text-foreground">30K+</span>
                <span className="text-sm">Subscribers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-2xl text-foreground">
                  4.8/5
                </span>
                <span className="text-sm">Customer Rating</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-2xl text-foreground">95%</span>
                <span className="text-sm">Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
