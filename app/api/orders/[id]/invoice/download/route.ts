import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateInvoicePdf } from "@/lib/invoice-generator";

// GET handler to download invoice as PDF
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
          select: { paymentId: true, status: true },
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
      paymentMethod: order.paymentMethod || "Online Payment",
      paymentId: order.Payment[0]?.paymentId,
    };

    // Generate PDF (in a real app, you would generate an actual PDF)
    const pdfContent = await generateInvoicePdf(invoiceData);

    // In a real application, you would return the PDF binary
    // For now, we'll return HTML with PDF content type header
    return new NextResponse(pdfContent, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${order.orderNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice PDF" },
      { status: 500 }
    );
  }
}
