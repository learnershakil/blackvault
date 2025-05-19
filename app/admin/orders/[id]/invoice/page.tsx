import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InvoiceViewer from "@/components/checkout/invoice-viewer";
import prisma from "@/lib/prisma";

interface InvoicePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: InvoicePageProps) {
  const order = await getOrderData(params.id);
  return {
    title: order
      ? `Invoice for Order ${order.orderNumber} | BlackVault Admin`
      : "Invoice Not Found",
  };
}

async function getOrderData(id: string) {
  try {
    return await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        orderNumber: true,
      },
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const order = await getOrderData(params.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoice</h1>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/orders/${params.id}`}>Back to Order</Link>
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Invoice for Order #{order.orderNumber}
          </h2>
        </div>
        <InvoiceViewer orderId={params.id} />
      </div>
    </div>
  );
}
