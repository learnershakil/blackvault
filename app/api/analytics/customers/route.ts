import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    // Only allow admin users
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate")
      ? new Date(searchParams.get("startDate") as string)
      : new Date(new Date().setMonth(new Date().getMonth() - 6));

    const endDate = searchParams.get("endDate")
      ? new Date(searchParams.get("endDate") as string)
      : new Date();

    // Get new customer registrations over time
    const customerAcquisition = await getCustomerAcquisition(
      startDate,
      endDate
    );

    // Get top customers by order value
    const topCustomers = await getTopCustomers(startDate, endDate);

    // Get customer retention data
    const customerRetention = await getCustomerRetention(startDate, endDate);

    // Get average order frequency
    const averageOrderFrequency = await getAverageOrderFrequency(
      startDate,
      endDate
    );

    return NextResponse.json({
      customerAcquisition,
      topCustomers,
      customerRetention,
      averageOrderFrequency,
    });
  } catch (error) {
    console.error("Error fetching customer analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer analytics" },
      { status: 500 }
    );
  }
}

// Helper function to get customer acquisition over time
async function getCustomerAcquisition(startDate: Date, endDate: Date) {
  // Get monthly new customer count
  const customerRegistrations = await prisma.$queryRaw`
    SELECT
      to_char("createdAt", 'YYYY-MM') as month,
      COUNT(*) as new_customers
    FROM "User"
    WHERE
      "createdAt" BETWEEN ${startDate} AND ${endDate}
      AND "role" = 'CUSTOMER'
    GROUP BY month
    ORDER BY month
  `;

  return customerRegistrations;
}

// Helper function to get top customers
async function getTopCustomers(startDate: Date, endDate: Date, limit = 10) {
  // Using raw query to get top customers with their order stats
  const topCustomers = await prisma.$queryRaw`
    SELECT
      u.id,
      u.name,
      u.email,
      COUNT(o.id) as order_count,
      SUM(o.total::numeric) as total_spent,
      AVG(o.total::numeric) as average_order
    FROM "User" u
    JOIN "Order" o ON u.id = o."userId"
    WHERE
      o."createdAt" BETWEEN ${startDate} AND ${endDate}
      AND o.status != 'CANCELLED'
    GROUP BY u.id, u.name, u.email
    ORDER BY total_spent DESC
    LIMIT ${limit}
  `;

  return topCustomers;
}

// Helper function to get customer retention data
async function getCustomerRetention(startDate: Date, endDate: Date) {
  // This is a simplified version - in a real app, you'd use more sophisticated cohort analysis
  // Get repeat purchase rate
  const totalCustomers = await prisma.order.groupBy({
    by: ["userId"],
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: {
        not: "CANCELLED",
      },
    },
  });

  // Customers with more than one order
  const repeatCustomers = await prisma.order.groupBy({
    by: ["userId"],
    _count: {
      id: true,
    },
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: {
        not: "CANCELLED",
      },
    },
    having: {
      id: {
        _count: {
          gt: 1,
        },
      },
    },
  });

  return {
    totalCustomers: totalCustomers.length,
    repeatCustomers: repeatCustomers.length,
    repeatPurchaseRate:
      totalCustomers.length > 0
        ? repeatCustomers.length / totalCustomers.length
        : 0,
  };
}

// Helper function to get average order frequency
async function getAverageOrderFrequency(startDate: Date, endDate: Date) {
  // Calculate days between first and last order for each customer
  const customerOrderFrequency = await prisma.$queryRaw`
    SELECT
      u.id,
      COUNT(o.id) as order_count,
      EXTRACT(EPOCH FROM (MAX(o."createdAt") - MIN(o."createdAt")))/86400 as days_between_orders
    FROM "User" u
    JOIN "Order" o ON u.id = o."userId"
    WHERE
      o."createdAt" BETWEEN ${startDate} AND ${endDate}
      AND o.status != 'CANCELLED'
    GROUP BY u.id
    HAVING COUNT(o.id) > 1
  `;

  // Calculate average order frequency
  let totalDays = 0;
  let totalOrders = 0;
  let customerCount = 0;

  for (const customer of customerOrderFrequency as any[]) {
    totalDays += Number(customer.days_between_orders);
    totalOrders += Number(customer.order_count) - 1; // Subtract 1 because we want gaps between orders
    customerCount++;
  }

  const averageDaysBetweenOrders =
    customerCount > 0 ? totalDays / totalOrders : 0;

  return {
    averageDaysBetweenOrders,
    customersWithMultipleOrders: customerCount,
  };
}
