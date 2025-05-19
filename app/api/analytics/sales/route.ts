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
    const period = searchParams.get("period") || "monthly";
    const startDate = searchParams.get("startDate")
      ? new Date(searchParams.get("startDate") as string)
      : new Date(new Date().setMonth(new Date().getMonth() - 6));

    const endDate = searchParams.get("endDate")
      ? new Date(searchParams.get("endDate") as string)
      : new Date();

    // Get current and previous period dates for comparison
    const currentPeriodStart = new Date(startDate);
    const previousPeriodDuration = endDate.getTime() - startDate.getTime();
    const previousPeriodStart = new Date(
      startDate.getTime() - previousPeriodDuration
    );
    const previousPeriodEnd = new Date(startDate);
    previousPeriodEnd.setMilliseconds(previousPeriodEnd.getMilliseconds() - 1);

    // Get sales data grouped by the requested period
    const salesData = await getSalesByPeriod(period, startDate, endDate);

    // Get total metrics for current period
    const currentPeriodMetrics = await getAggregateSalesMetrics(
      startDate,
      endDate
    );

    // Get total metrics for previous period
    const previousPeriodMetrics = await getAggregateSalesMetrics(
      previousPeriodStart,
      previousPeriodEnd
    );

    // Get top products for the period
    const topProducts = await getTopSellingProducts(startDate, endDate);

    // Get sales by category
    const salesByCategory = await getSalesByCategory(startDate, endDate);

    return NextResponse.json({
      salesData,
      currentPeriodMetrics,
      previousPeriodMetrics,
      topProducts,
      salesByCategory,
    });
  } catch (error) {
    console.error("Error fetching sales analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales analytics" },
      { status: 500 }
    );
  }
}

// Helper function to get sales data by period
async function getSalesByPeriod(
  period: string,
  startDate: Date,
  endDate: Date
) {
  // Format for the SQL query based on period
  let format;
  let groupBy;
  let orderBy;

  switch (period) {
    case "daily":
      format = "YYYY-MM-DD";
      groupBy = "date";
      orderBy = "date";
      break;
    case "weekly":
      format = "IYYY-IW"; // ISO year and week number
      groupBy = "week";
      orderBy = "week";
      break;
    case "monthly":
    default:
      format = "YYYY-MM";
      groupBy = "month";
      orderBy = "month";
      break;
  }

  // Postgres query using to_char
  // Using raw queries for date formatting
  const sales = await prisma.$queryRaw`
    SELECT
      to_char("createdAt", ${format}) as ${groupBy},
      SUM("total"::numeric) as revenue,
      COUNT(*) as orders,
      AVG("total"::numeric) as average_order_value
    FROM "Order"
    WHERE
      "createdAt" BETWEEN ${startDate} AND ${endDate}
      AND "status" != 'CANCELLED'
    GROUP BY ${groupBy}
    ORDER BY ${orderBy}
  `;

  return sales;
}

// Helper function to get aggregate sales metrics
async function getAggregateSalesMetrics(startDate: Date, endDate: Date) {
  // Aggregate metrics
  const [ordersTotals, customerCount, aov] = await Promise.all([
    prisma.order.aggregate({
      _sum: {
        total: true,
      },
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
    }),
    prisma.order
      .groupBy({
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
      })
      .then((result) => result.length),
    prisma.order.aggregate({
      _avg: {
        total: true,
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
    }),
  ]);

  return {
    revenue: Number(ordersTotals._sum.total || 0),
    orders: ordersTotals._count.id,
    customers: customerCount,
    averageOrderValue: Number(aov._avg.total || 0),
  };
}

// Helper function to get top selling products
async function getTopSellingProducts(
  startDate: Date,
  endDate: Date,
  limit = 10
) {
  // Using raw query for more complex aggregation
  const topProducts = await prisma.$queryRaw`
    SELECT
      p.id,
      p.name,
      p.slug,
      SUM(oi.quantity) as units_sold,
      SUM((oi.price::numeric * oi.quantity)) as revenue
    FROM "OrderItem" oi
    JOIN "Product" p ON oi."productId" = p.id
    JOIN "Order" o ON oi."orderId" = o.id
    WHERE
      o."createdAt" BETWEEN ${startDate} AND ${endDate}
      AND o.status != 'CANCELLED'
    GROUP BY p.id, p.name, p.slug
    ORDER BY revenue DESC
    LIMIT ${limit}
  `;

  return topProducts;
}

// Helper function to get sales by category
async function getSalesByCategory(startDate: Date, endDate: Date) {
  // Using raw query to join tables and aggregate
  const salesByCategory = await prisma.$queryRaw`
    SELECT
      c.id,
      c.name,
      SUM(oi.quantity) as units_sold,
      SUM((oi.price::numeric * oi.quantity)) as revenue
    FROM "OrderItem" oi
    JOIN "Product" p ON oi."productId" = p.id
    JOIN "Category" c ON p."categoryId" = c.id
    JOIN "Order" o ON oi."orderId" = o.id
    WHERE
      o."createdAt" BETWEEN ${startDate} AND ${endDate}
      AND o.status != 'CANCELLED'
    GROUP BY c.id, c.name
    ORDER BY revenue DESC
  `;

  return salesByCategory;
}
