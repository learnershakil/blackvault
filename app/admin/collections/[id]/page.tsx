"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  sku: string;
  images: { url: string }[];
}

interface FeaturedProduct {
  id: string;
  productId: string;
  priority: number;
  specialPrice: number | null;
  specialPriceEndDate: string | null;
  product: {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
  };
}

interface CollectionFormData {
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  priority: number;
  startDate: string;
  endDate: string;
  products: FeaturedProduct[];
}

export default function CollectionFormPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const isNewCollection = id === "new";
  const router = useRouter();

  const [formData, setFormData] = useState<CollectionFormData>({
    title: "",
    slug: "",
    description: "",
    imageUrl: "",
    isActive: true,
    priority: 0,
    startDate: "",
    endDate: "",
    products: [],
  });

  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(!isNewCollection);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Fetch collection data if editing
  useEffect(() => {
    const fetchCollectionData = async () => {
      if (isNewCollection) {
        // Initialize with default values for new collection
        setFormData({
          title: "",
          slug: "",
          description: "",
          imageUrl: "",
          isActive: true,
          priority: 0,
          // Set default dates (now and 30 days from now)
          startDate: new Date().toISOString().split("T")[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          products: [],
        });
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/admin/featured-collections/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch collection details");
        }

        const collection = await response.json();

        // Format dates for form inputs
        setFormData({
          title: collection.title,
          slug: collection.slug,
          description: collection.description || "",
          imageUrl: collection.imageUrl || "",
          isActive: collection.isActive,
          priority: collection.priority,
          startDate: collection.startDate
            ? new Date(collection.startDate).toISOString().split("T")[0]
            : "",
          endDate: collection.endDate
            ? new Date(collection.endDate).toISOString().split("T")[0]
            : "",
          products: collection.products || [],
        });

        // Prepare list of product IDs already in the collection
        setSelectedProductIds(collection.products.map((p: any) => p.productId));
      } catch (error) {
        console.error("Error fetching collection:", error);
        setError("Failed to load collection data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollectionData();
  }, [id, isNewCollection]);

  // Fetch all products for selection
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/admin/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const products = await response.json();
        setAvailableProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "priority"
          ? parseInt(value) || 0
          : value,
    }));
  };

  // Generate slug from title
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
    setFormData({ ...formData, slug });
  };

  // Handle product selection
  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        productIds: selectedProductIds,
      };

      const url = isNewCollection
        ? "/api/admin/featured-collections"
        : `/api/admin/featured-collections/${id}`;
      const method = isNewCollection ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save collection");
      }

      router.push("/admin/collections");
    } catch (err: any) {
      console.error("Error saving collection:", err);
      setError(err.message || "Failed to save collection");
      window.scrollTo(0, 0);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter products based on search term
  const filteredProducts = availableProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-2xl font-bold">
          {isNewCollection ? "Create Collection" : "Edit Collection"}
        </h1>
        <Link href="/admin/collections">
          <Button variant="outline">Back to Collections</Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Collection Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
              />
              <div className="mt-2 flex gap-2 items-center">
                <button
                  type="button"
                  onClick={generateSlug}
                  className="text-xs text-primary-600 hover:text-primary-800"
                >
                  Generate slug
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                pattern="[a-z0-9-]+"
                title="Lowercase letters, numbers, and hyphens only"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL-friendly name (lowercase, no spaces)
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium mb-1"
              >
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
              />
            </div>
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium mb-1"
              >
                Display Priority
              </label>
              <input
                type="number"
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">
                Higher values appear first
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="isActive"
                className="flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium">Active</span>
              </label>
            </div>
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium mb-1"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium mb-1"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
              />
            </div>
          </div>

          {/* Product Selection */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-4">Select Products</h3>

            {/* Search input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search products by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
              />
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto p-2">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`border rounded p-3 flex items-center space-x-3 cursor-pointer ${
                    selectedProductIds.includes(product.id)
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                  onClick={() => toggleProductSelection(product.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedProductIds.includes(product.id)}
                    onChange={() => {}}
                    className="h-4 w-4 text-primary-600"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sku}</p>
                  </div>
                  <div className="h-10 w-10 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No matching products found
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {selectedProductIds.length} products selected
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Link href="/admin/collections">
              <Button variant="outline" type="button" disabled={isSaving}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Collection"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
