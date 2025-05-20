import { NextRequest, NextResponse } from "next/server";
import      subtotal: Number(order.subTotal),
      tax: Number(order.tax),
      shipping: Number(order.shipping),
      discount: Number(order.discount),
      total: Number(order.total),
      paymentMethod: order.Payment?.[0]?.paymentMethod || "Online Payment",
      paymentId: order.Payment?.[0]?.paymentId || undefined, } from "@/auth";
import prisma from "@/lib/prisma";
import {
  generateInvoiceHtml,
  generateInvoicePdf,
} from "@/lib/invoice-generator";

// GET handler to fetch invoice HTML
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the order with all related data
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        shippingAddress: true,
        billingAddress: true,
        user: {
          select: { email: true, name: true },
        },
        Payment: {
          select: { paymentId: true, status: true, paymentMethod: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify the order belongs to the authenticated user or user is admin
    if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Format invoice data
    const invoiceData = {
      invoiceNumber: `INV-${order.orderNumber.replace("BV-", "")}`,
      orderNumber: order.orderNumber,
      date: order.createdAt.toISOString(),
      dueDate: order.createdAt.toISOString(), // Same as order date for e-commerce
      customerName: order.user.name || "Valued Customer",
      customerEmail: order.user.email || "",
      billingAddress: order.billingAddress,
      shippingAddress: order.shippingAddress,
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: Number(item.price),
      })),
      subtotal: Number(order.subTotal),
      tax: Number(order.tax),
      shipping: Number(order.shipping),
      discount: Number(order.discount),
      total: Number(order.total),
      paymentMethod: order.Payment?.[0]?.paymentMethod || "Online Payment",
      paymentId: order.Payment?.[0]?.paymentId,
    };

    // Generate invoice HTML
    const invoiceHtml = generateInvoiceHtml(invoiceData);

    return NextResponse.json({ invoiceHtml });
  } catch (error) {
    console.error("Error generating invoice:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}
