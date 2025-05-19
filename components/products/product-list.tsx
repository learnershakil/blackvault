import { useEffect, useState } from "react";
import ProductCard from "@/components/product/product-card";
import LazyComponent from "@/components/lazy-component";
import { Product } from "@/types";

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
}

export default function ProductList({ products, isLoading }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {isLoading
        ? Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg"
            />
          ))
        : products.map((product) => (
            <LazyComponent
              key={product.id}
              rootMargin="200px"
              className="min-h-[320px]"
            >
              <ProductCard product={product} />
            </LazyComponent>
          ))}

      {!isLoading && products.length === 0 && (
        <div className="col-span-full text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No products found.</p>
        </div>
      )}
    </div>
  );
}
