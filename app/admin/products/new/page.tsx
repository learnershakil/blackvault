import prisma from "@/lib/prisma";
import ProductFormFixed from "@/components/admin/product-form-fixed";

export const metadata = {
  title: "Add New Product | BlackVault Admin",
};

export default async function AddNewProduct() {
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">
          Create a new product to sell in your store.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 mb-6">
        <h3 className="text-blue-800 dark:text-blue-300 font-medium text-sm mb-1">
          Image Upload
        </h3>
        <p className="text-blue-600 dark:text-blue-400 text-sm">
          Once you create your product, you'll be able to add product images on
          the edit page.
        </p>
      </div>

      <ProductFormFixed categories={categories} />
    </div>
  );
}
