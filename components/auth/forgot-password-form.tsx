"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Show success message
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      {success ? (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We've sent a link to reset your password to <strong>{email}</strong>
            . Please check your inbox.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            If you don't see it, please check your spam folder or{" "}
            <button
              onClick={() => setSuccess(false)}
              className="text-primary-600 hover:underline"
            >
              try again
            </button>
            .
          </p>
        </div>
      ) : (
        <>
          <div className="text-center">
            <h2 className="text-3xl font-bold">Reset Password</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Enter your email and we'll send you a link to reset your password
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-200 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium pb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3"
              size="lg"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center mt-4 text-sm">
              Remember your password?{" "}
              <Link href="/login" className="text-primary-600 hover:underline">
                Back to login
              </Link>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
