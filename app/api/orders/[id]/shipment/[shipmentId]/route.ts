import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// PATCH handler to update a shipment
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; shipmentId: string } }
) {
  try {
    const { id, shipmentId } = params;
    const session = await auth();

    // Only admins can update shipments
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
      include: {
        shipment: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify shipment belongs to the order
    if (order.shipmentId !== shipmentId) {
      return NextResponse.json(
        { error: "Shipment does not belong to this order" },
        { status: 400 }
      );
    }

    // Update shipment
    const updatedShipment = await prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        carrier: validatedData.carrier,
        trackingNumber: validatedData.trackingNumber,
        status: validatedData.status,
        estimatedDelivery: validatedData.estimatedDelivery
          ? new Date(validatedData.estimatedDelivery)
          : null,
      },
    });

    // If shipment status changed and it affects order status, update the order too
    if (
      validatedData.status !== order.shipment?.status &&
      ((validatedData.status === "SHIPPED" && order.status === "PROCESSING") ||
        (validatedData.status === "DELIVERED" && order.status === "SHIPPED"))
    ) {
      await prisma.order.update({
        where: { id },
        data: {
          status: validatedData.status,
        },
      });
    }

    return NextResponse.json({ shipment: updatedShipment });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error updating shipment:", error);
    return NextResponse.json(
      { error: "Failed to update shipment" },
      { status: 500 }
    );
  }
}
