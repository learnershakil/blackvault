"use client";

import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import UserProfileTab from "./tabs/user-profile-tab";
import UserOrdersTab from "./tabs/user-orders-tab";
import UserAddressesTab from "./tabs/user-addresses-tab";
import UserActivityTab from "./tabs/user-activity-tab";

interface UserDetailTabsProps {
  id: string;
  activeTab: string;
}

export default function UserDetailTabs({ id, activeTab }: UserDetailTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "orders", label: "Orders" },
    { id: "addresses", label: "Addresses" },
    { id: "activity", label: "Activity" },
  ];

  const handleTabChange = (tabId: string) => {
    router.push(`${pathname}?tab=${tabId}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-b-2 border-primary-600 text-primary-600 dark:text-primary-500"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <Suspense
          fallback={
            <div className="h-64 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
          }
        >
          {activeTab === "profile" && <UserProfileTab userId={id} />}
          {activeTab === "orders" && <UserOrdersTab userId={id} />}
          {activeTab === "addresses" && <UserAddressesTab userId={id} />}
          {activeTab === "activity" && <UserActivityTab userId={id} />}
        </Suspense>
      </div>
    </div>
  );
}
