import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import OrderDetail from "@/components/admin/orders/order-detail";
import prisma from "@/lib/prisma";

interface OrderPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: OrderPageProps) {
  const order = await getOrderData(params.id);
  return {
    title: order
      ? `Order ${order.orderNumber} | BlackVault Admin`
      : "Order Not Found",
  };
}

async function getOrderData(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                slug: true,
                images: {
                  where: { isDefault: true },
                  take: 1,
                  select: {
                    url: true,
                    alt: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        shippingAddress: true,
        billingAddress: true,
        shipment: true,
        Payment: {
          select: {
            id: true,
            amount: true,
            paymentMethod: true,
            status: true,
            paymentId: true,
            createdAt: true,
          },
        },
      },
    });

    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const order = await getOrderData(params.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/orders">Back to Orders</Link>
          </Button>
        </div>
      </div>

      <OrderDetail order={order} />
    </div>
  );
}
