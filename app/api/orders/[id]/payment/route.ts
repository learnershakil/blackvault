import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// POST handler to update order payment status
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const schema = z.object({
      paymentMethod: z.enum(["card", "razorpay", "cod"]),
      status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED"]),
      paymentId: z.string().optional(),
    });

    const { paymentMethod, status, paymentId } = schema.parse(body);

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify the order belongs to the authenticated user
    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update order payment method and status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        paymentMethod,
        // Only update order status for specific payment methods/scenarios
        ...(paymentMethod === "cod" ? { status: "PENDING" } : {}),
        ...(paymentMethod === "razorpay" && status === "COMPLETED"
          ? { status: "PROCESSING" }
          : {}),
      },
    });

    // Create payment record
    if (paymentMethod === "cod") {
      // For COD, create a pending payment record
      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: order.total,
          paymentMethod: "cod",
          status: "PENDING",
          paymentId: `COD-${order.orderNumber}`,
        },
      });
    } else if (paymentId) {
      // For online payments, create payment record with paymentId from gateway
      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: order.total,
          paymentMethod,
          status,
          paymentId,
        },
      });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error updating payment status:", error);
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 }
    );
  }
}
