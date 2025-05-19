"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Address } from "@prisma/client";
import { useRouter } from "next/navigation";

interface AddressListProps {
  initialAddresses: Address[];
}

export default function AddressList({ initialAddresses }: AddressListProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const router = useRouter();

  // Set address as default
  const handleSetDefault = async (id: string) => {
    setIsLoading(id);

    try {
      const response = await fetch(`/api/user/address/${id}/default`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to update address");
      }

      // Update local state
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
        }))
      );

      router.refresh();
    } catch (error) {
      console.error("Error updating default address:", error);
    } finally {
      setIsLoading(null);
    }
  };

  // Delete address
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setIsLoading(id);

    try {
      const response = await fetch(`/api/user/address/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete address");
      }

      // Remove from local state
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      router.refresh();
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <div
          key={address.id}
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 relative"
        >
          {address.isDefault && (
            <div className="absolute top-4 right-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Default
            </div>
          )}

          <div className="mb-4">
            <h3 className="font-medium text-lg">
              {address.firstName} {address.lastName}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {address.address1}
              {address.address2 && <>, {address.address2}</>}
              <br />
              {address.city}, {address.state} {address.postalCode}
              <br />
              {address.country}
              {address.phone && (
                <>
                  <br />
                  {address.phone}
                </>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/profile/addresses/${address.id}`)}
            >
              Edit
            </Button>

            {!address.isDefault && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSetDefault(address.id)}
                disabled={isLoading === address.id}
              >
                Set as Default
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(address.id)}
              disabled={isLoading === address.id}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
