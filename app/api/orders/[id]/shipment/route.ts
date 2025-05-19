import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// POST handler to create a shipment for an order
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await auth();

    // Only admins can create shipments
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const schema = z.object({
      carrier: z.string().min(1, "Carrier is required"),
      trackingNumber: z.string().min(1, "Tracking number is required"),
      status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"]),
      estimatedDelivery: z.string().optional(),
    });

    const validatedData = schema.parse(body);

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Create shipment
    const shipment = await prisma.shipment.create({
      data: {
        carrier: validatedData.carrier,
        trackingNumber: validatedData.trackingNumber,
        status: validatedData.status,
        estimatedDelivery: validatedData.estimatedDelivery
          ? new Date(validatedData.estimatedDelivery)
          : undefined,
      },
    });

    // Update order with shipment ID and update status if needed
    await prisma.order.update({
      where: { id },
      data: {
        shipmentId: shipment.id,
        // If order is in processing and shipment is shipped, update order status
        ...(validatedData.status === "SHIPPED" && order.status === "PROCESSING"
          ? { status: "SHIPPED" }
          : {}),
      },
    });

    return NextResponse.json({ shipment }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating shipment:", error);
    return NextResponse.json(
      { error: "Failed to create shipment" },
      { status: 500 }
    );
  }
}
