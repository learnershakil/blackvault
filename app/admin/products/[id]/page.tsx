import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/product-form";
import ProductImageUpload from "@/components/admin/product-image-upload";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export const metadata = {
  title: "Edit Product | BlackVault Admin",
};

export default async function EditProduct({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // Fetch the product
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  // Fetch categories for the form dropdown
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Fetch product images
  const images = await prisma.productImage.findMany({
    where: { productId: id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                product.isPublished
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
              }`}
            >
              {product.isPublished ? "Published" : "Draft"}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              {formatPrice(Number(product.price))}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              SKU: {product.sku}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/products/${product.slug}`} target="_blank">
            <Button variant="outline">View Product</Button>
          </Link>
          <Link href="/admin/products">
            <Button variant="ghost">Back to Products</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - product form */}
        <div className="lg:col-span-2">
          <ProductForm
            categories={categories}
            initialData={product}
            isEditing={true}
          />
        </div>

        {/* Sidebar - product images */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Product Images</h2>
              <ProductImageUpload productId={id} initialImages={images} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
