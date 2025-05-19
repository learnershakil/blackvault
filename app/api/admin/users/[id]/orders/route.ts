import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    // Only admin can access this endpoint
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user orders
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          items: {
            select: {
              id: true,
              name: true,
              quantity: true,
            },
          },
        },
      }),
      prisma.order.count({ where: { userId: id } }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch user orders" },
      { status: 500 }
    );
  }
}
