import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // Only admin can access this endpoint
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const query = searchParams.get("query");
    const customerIdParam = searchParams.get("customerId");

    const skip = (page - 1) * limit;

    // Build where conditions
    const where: any = {};

    // Status filter
    if (status) {
      where.status = status;
    }

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999);
        where.createdAt.lte = endDateObj;
      }
    }

    // Customer ID filter
    if (customerIdParam) {
      where.userId = customerIdParam;
    }

    // Search by order number, customer name, or email
    if (query) {
      where.OR = [
        { orderNumber: { contains: query, mode: "insensitive" } },
        { user: { name: { contains: query, mode: "insensitive" } } },
        { user: { email: { contains: query, mode: "insensitive" } } },
      ];
    }

    // Fetch orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          shipment: {
            select: {
              id: true,
              status: true,
              trackingNumber: true,
              carrier: true,
            },
          },
          Payment: {
            take: 1,
            orderBy: { createdAt: "desc" },
            select: {
              status: true,
              paymentMethod: true,
            },
          },
          _count: {
            select: { items: true },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST handler for batch operations (e.g., mark multiple orders as shipped)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    // Only admin can access this endpoint
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const schema = z.object({
      action: z.enum(["updateStatus", "delete", "export"]),
      orderIds: z.array(z.string()),
      status: z
        .enum([
          "PENDING",
          "PROCESSING",
          "SHIPPED",
          "DELIVERED",
          "CANCELLED",
          "REFUNDED",
        ])
        .optional(),
    });

    const { action, orderIds, status } = schema.parse(body);

    // Prevent operations on empty array
    if (orderIds.length === 0) {
      return NextResponse.json(
        { error: "No orders selected" },
        { status: 400 }
      );
    }

    // Perform the requested action
    if (action === "updateStatus" && status) {
      // Update status of multiple orders
      await prisma.order.updateMany({
        where: { id: { in: orderIds } },
        data: { status },
      });

      return NextResponse.json({
        message: `Updated ${orderIds.length} orders to status: ${status}`,
      });
    } else if (action === "delete") {
      // Delete multiple orders (careful with this in production!)
      await prisma.order.deleteMany({
        where: { id: { in: orderIds } },
      });

      return NextResponse.json({
        message: `Deleted ${orderIds.length} orders`,
      });
    } else if (action === "export") {
      // Get order data for export
      const orders = await prisma.order.findMany({
        where: { id: { in: orderIds } },
        include: {
          items: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          shippingAddress: true,
          billingAddress: true,
        },
      });

      // In a real system, you'd format this for CSV/Excel
      return NextResponse.json({ orders });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error processing batch order action:", error);
    return NextResponse.json(
      { error: "Failed to process orders" },
      { status: 500 }
    );
  }
}
