import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { verifyRazorpayPayment } from "@/lib/payment-utils";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const schema = z.object({
      orderId: z.string().min(1, "Order ID is required"),
      paymentId: z.string().min(1, "Payment ID is required"),
      razorpayOrderId: z.string().min(1, "Razorpay order ID is required"),
      signature: z.string().min(1, "Signature is required"),
    });

    const { orderId, paymentId, razorpayOrderId, signature } =
      schema.parse(body);

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify order belongs to user
    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Verify payment signature
    const isValidPayment = verifyRazorpayPayment({
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    });

    if (!isValidPayment) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Update order with payment details
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "PROCESSING", // Update status to PROCESSING after successful payment
        paymentIntentId: razorpayOrderId,
      },
    });

    // Create a payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.total,
        paymentMethod: "razorpay",
        paymentId,
        status: "COMPLETED",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
