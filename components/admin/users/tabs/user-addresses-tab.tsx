"use client";

import { useState, useEffect } from "react";

interface UserAddressesTabProps {
  userId: string;
}

interface Address {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | null;
  isDefault: boolean;
}

export default function UserAddressesTab({ userId }: UserAddressesTabProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUserAddresses() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/users/${userId}/addresses`);

        if (!response.ok) throw new Error("Failed to fetch user addresses");

        const data = await response.json();
        setAddresses(data.addresses);
      } catch (error) {
        console.error("Error fetching user addresses:", error);
        setError("Failed to load addresses");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserAddresses();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">{error}</div>;
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          This user hasn't added any addresses yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">User Addresses</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`border rounded-md p-4 ${
              address.isDefault
                ? "border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/10"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    address.type === "SHIPPING"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : address.type === "BILLING"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  }`}
                >
                  {address.type.charAt(0) + address.type.slice(1).toLowerCase()}
                </span>

                {address.isDefault && (
                  <span className="ml-2 text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>
            </div>

            <div className="text-sm space-y-1">
              <p className="font-medium">
                {address.firstName} {address.lastName}
              </p>
              <p>{address.address1}</p>
              {address.address2 && <p>{address.address2}</p>}
              <p>
                {address.city}, {address.state} {address.postalCode}
              </p>
              <p>{address.country}</p>
              {address.phone && <p>Phone: {address.phone}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
