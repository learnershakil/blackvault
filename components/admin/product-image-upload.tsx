"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  isDefault: boolean;
}

interface ProductImageUploadProps {
  productId: string;
  initialImages: ProductImage[];
}

export default function ProductImageUpload({
  productId,
  initialImages = [],
}: ProductImageUploadProps) {
  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageAlt, setNewImageAlt] = useState("");

  // Add an image by URL (simplified for demo purposes)
  const handleAddImage = async () => {
    if (!newImageUrl) {
      setError("Please enter an image URL");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 100);

      // API call to add the image
      const response = await fetch(`/api/products/${productId}/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: newImageUrl,
          alt: newImageAlt || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add image");
      }

      const newImage = await response.json();

      // Add the new image to the list
      setImages((prev) => [...prev, newImage]);
      setNewImageUrl("");
      setNewImageAlt("");
    } catch (err: any) {
      console.error("Error adding image:", err);
      setError(err.message || "Failed to add image");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Set an image as the default (primary) image
  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/images/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isDefault: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to set image as default");
      }

      // Update local state - set the selected image as default and others as not default
      setImages((prev) =>
        prev.map((img) => ({
          ...img,
          isDefault: img.id === id,
        }))
      );
    } catch (err) {
      console.error("Error setting default image:", err);
      setError("Failed to set default image");
    }
  };

  // Delete an image
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/images/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      // Remove the image from the list
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      console.error("Error deleting image:", err);
      setError("Failed to delete image");
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-md">
          {error}
        </div>
      )}

      {/* Image list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image) => (
          <div
            key={image.id}
            className={`relative group overflow-hidden rounded-lg border ${
              image.isDefault
                ? "border-primary-500 dark:border-primary-400"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="aspect-square w-full bg-gray-100 dark:bg-gray-800">
              {/* Image preview */}
              <img
                src={image.url}
                alt={image.alt || "Product image"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/300?text=Image+Error";
                }}
              />

              {/* Default badge */}
              {image.isDefault && (
                <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                  Default
                </div>
              )}

              {/* Image actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                {!image.isDefault && (
                  <Button size="sm" onClick={() => handleSetDefault(image.id)}>
                    Set as Default
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(image.id)}
                >
                  Delete
                </Button>
              </div>
            </div>

            {/* Image details */}
            <div className="p-2 bg-white dark:bg-gray-800">
              <p className="text-sm truncate" title={image.alt || ""}>
                {image.alt || "No description"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add new image form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 space-y-4">
        <h3 className="text-lg font-medium">Add New Image</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Alt Text
            </label>
            <input
              type="text"
              value={newImageAlt}
              onChange={(e) => setNewImageAlt(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-600 dark:bg-gray-700 dark:text-white"
              placeholder="Image description"
            />
          </div>

          {/* Upload progress */}
          {isUploading && (
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-primary-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <div>
            <Button
              onClick={handleAddImage}
              disabled={isUploading || !newImageUrl}
            >
              {isUploading ? "Adding..." : "Add Image"}
            </Button>
          </div>
        </div>
      </div>

      {/* Help text */}
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>Recommended image size: 800x800 pixels (1:1 ratio)</p>
        <p>Maximum file size: 2MB</p>
        <p>Supported formats: JPG, PNG, WebP</p>
      </div>
    </div>
  );
}
