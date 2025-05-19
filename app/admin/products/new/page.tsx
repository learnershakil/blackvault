import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/product-form";

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

      <ProductForm categories={categories} />
    </div>
  );
}
