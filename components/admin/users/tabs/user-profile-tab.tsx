"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface UserProfileTabProps {
  userId: string;
}

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
}

export default function UserProfileTab({ userId }: UserProfileTabProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch user profile data
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch(`/api/admin/users/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch user profile");

        const userData = await response.json();
        setUser(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          role: userData.role,
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setError("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserProfile();
  }, [userId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update user");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setSuccess("User profile updated successfully");
      setIsEditing(false);
      router.refresh(); // Refresh the page data
    } catch (err: any) {
      setError(err.message || "Failed to update user profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="py-12 text-center text-red-500">User not found</div>;
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
          {success}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                User Information
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Full Name
                  </div>
                  <div className="font-medium">
                    {user.name || "Not provided"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Email Address
                  </div>
                  <div className="font-medium">
                    {user.email || "Not provided"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Role
                  </div>
                  <div className="font-medium">{user.role}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Email Verified
                  </div>
                  <div className="font-medium">
                    {user.emailVerified ? (
                      <span className="text-green-600 dark:text-green-500">
                        Yes
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-500">No</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Account Details
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Account ID
                  </div>
                  <div className="font-mono text-xs">{user.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Created At
                  </div>
                  <div>{new Date(user.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Last Updated
                  </div>
                  <div>{new Date(user.updatedAt).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={() => setIsEditing(true)}>Edit User</Button>
          </div>
        </div>
      )}
    </div>
  );
}
