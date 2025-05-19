"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface FeaturedProduct {
  id: string;
  product: {
    name: string;
    price: number;
  };
}

interface FeaturedCollection {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  priority: number;
  startDate: string | null;
  endDate: string | null;
  products: FeaturedProduct[];
  createdAt: string;
}

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<FeaturedCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch collections on component mount
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch("/api/admin/featured-collections");

        if (!response.ok) {
          throw new Error("Failed to fetch collections");
        }

        const data = await response.json();
        setCollections(data);
      } catch (err: any) {
        console.error("Error fetching collections:", err);
        setError(err.message || "Failed to load collections");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // Toggle collection active status
  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/featured-collections/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update collection");
      }

      // Update state
      setCollections(
        collections.map((collection) =>
          collection.id === id
            ? { ...collection, isActive: !currentStatus }
            : collection
        )
      );
    } catch (err: any) {
      console.error("Error updating collection:", err);
      alert(err.message || "Failed to update collection");
    }
  };

  // Delete collection
  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this collection? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/featured-collections/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete collection");
      }

      // Remove from state
      setCollections(collections.filter((collection) => collection.id !== id));
    } catch (err: any) {
      console.error("Error deleting collection:", err);
      alert(err.message || "Failed to delete collection");
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No date set";
    return new Date(dateString).toLocaleDateString();
  };

  // Check if collection is currently active
  const isCurrentlyActive = (collection: FeaturedCollection) => {
    if (!collection.isActive) return false;

    const now = new Date();
    const startDate = collection.startDate
      ? new Date(collection.startDate)
      : null;
    const endDate = collection.endDate ? new Date(collection.endDate) : null;

    if (startDate && now < startDate) return false;
    if (endDate && now > endDate) return false;

    return true;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Featured Collections</h1>
        <Link href="/admin/collections/new">
          <Button>Add New Collection</Button>
        </Link>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 rounded-lg mb-6">
          {error}
        </div>
      ) : collections.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No featured collections found
          </p>
          <Link href="/admin/collections/new">
            <Button variant="outline">Create Your First Collection</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Collection image or placeholder */}
              <div className="h-48 bg-gray-100 dark:bg-gray-700 relative">
                {collection.imageUrl ? (
                  <img
                    src={collection.imageUrl}
                    alt={collection.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                    No image
                  </div>
                )}
                <div
                  className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded ${
                    isCurrentlyActive(collection)
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                  }`}
                >
                  {isCurrentlyActive(collection) ? "Active" : "Inactive"}
                </div>
              </div>

              {/* Collection details */}
              <div className="p-4">
                <h2 className="font-bold text-lg mb-2 truncate">
                  {collection.title}
                </h2>

                <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex justify-between">
                    <span>Slug:</span>
                    <span className="font-mono">{collection.slug}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Products:</span>
                    <span>{collection.products.length}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Priority:</span>
                    <span>{collection.priority}</span>
                  </div>
                  {collection.startDate && (
                    <div className="flex justify-between mt-1">
                      <span>Valid:</span>
                      <span>
                        {formatDate(collection.startDate)} -{" "}
                        {formatDate(collection.endDate)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <button
                      onClick={() =>
                        handleToggleActive(collection.id, collection.isActive)
                      }
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                    >
                      {collection.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleDelete(collection.id)}
                      className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                  <Link
                    href={`/admin/collections/${collection.id}`}
                    className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
