"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Address } from "@prisma/client";
import AddressForm from "@/components/profile/address-form";

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onAddressSelect: (addressId: string) => void;
  addressType: "shipping" | "billing";
}

export default function AddressSelector({
  addresses,
  selectedAddressId,
  onAddressSelect,
  addressType,
}: AddressSelectorProps) {
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [formKey, setFormKey] = useState(0); // To reset form when needed

  // Filter addresses by type
  const filteredAddresses = addresses.filter((address) => {
    if (addressType === "shipping") {
      return address.type === "SHIPPING" || address.type === "BOTH";
    } else {
      return address.type === "BILLING" || address.type === "BOTH";
    }
  });

  // Callback for when new address is saved
  const handleNewAddressSaved = (newAddressId: string) => {
    setShowNewAddressForm(false);
    onAddressSelect(newAddressId);
    setFormKey(formKey + 1); // Reset form for next use
  };

  return (
    <div>
      {/* Existing addresses selection */}
      {filteredAddresses.length > 0 && !showNewAddressForm && (
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {addressType === "shipping" ? "Shipping" : "Billing"} Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredAddresses.map((address) => (
              <div
                key={address.id}
                onClick={() => onAddressSelect(address.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedAddressId === address.id
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    name={`${addressType}-address`}
                    checked={selectedAddressId === address.id}
                    onChange={() => onAddressSelect(address.id)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <p className="font-medium">
                      {address.firstName} {address.lastName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {address.address1}
                      {address.address2 && <>, {address.address2}</>}
                      <br />
                      {address.city}, {address.state} {address.postalCode}
                      <br />
                      {address.country}
                    </p>
                    {address.phone && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {address.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggle for new address form */}
      {!showNewAddressForm ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowNewAddressForm(true)}
          className="mt-2"
        >
          Add New {addressType.charAt(0).toUpperCase() + addressType.slice(1)}{" "}
          Address
        </Button>
      ) : (
        <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium">
              New {addressType.charAt(0).toUpperCase() + addressType.slice(1)}{" "}
              Address
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowNewAddressForm(false)}
            >
              Cancel
            </Button>
          </div>

          {/* Use the existing AddressForm component with special callback */}
          <AddressForm
            key={formKey} // Reset form when key changes
            onAddressSaved={handleNewAddressSaved}
            initialData={{
              type: addressType === "shipping" ? "SHIPPING" : "BILLING",
            }}
          />
        </div>
      )}
    </div>
  );
}
