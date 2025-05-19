"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface EmailChangeFormProps {
  currentEmail: string;
}

export default function EmailChangeForm({
  currentEmail,
}: EmailChangeFormProps) {
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/user/email-change", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to request email change");
      }

      setSuccess(
        "Email verification sent. Please check your new email address to complete the change."
      );
      setNewEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 border border-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-200 rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-100 border border-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-200 rounded-md text-sm">
          {success}
        </div>
      )}

      <div>
        <label
          htmlFor="currentEmail"
          className="block text-sm font-medium mb-1"
        >
          Current Email
        </label>
        <input
          id="currentEmail"
          type="email"
          value={currentEmail}
          disabled
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
        />
      </div>

      <div>
        <label htmlFor="newEmail" className="block text-sm font-medium mb-1">
          New Email
        </label>
        <input
          id="newEmail"
          type="email"
          required
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Confirm with Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Change Email"}
        </Button>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>
          For security reasons, we'll send a verification link to your new email
          address. Your email won't be updated until you verify the new address.
        </p>
      </div>
    </form>
  );
}
