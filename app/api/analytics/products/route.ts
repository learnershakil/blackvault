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

    const categoryId = searchParams.get("categoryId") || undefined;

    // Get top selling products
    const topSellingProducts = await getTopSellingProducts(
      startDate,
      endDate,
      categoryId
    );

    // Get product inventory status
    const inventoryStatus = await getInventoryStatus(categoryId);

    // Get product performance metrics
    const productPerformance = await getProductPerformance(
      startDate,
      endDate,
      categoryId
    );

    // Get products with no sales
    const nonSellingProducts = await getNonSellingProducts(
      startDate,
      endDate,
      categoryId
    );

    return NextResponse.json({
      topSellingProducts,
      inventoryStatus,
      productPerformance,
      nonSellingProducts,
    });
  } catch (error) {
    console.error("Error fetching product analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch product analytics" },
      { status: 500 }
    );
  }
}

// Helper function to get top selling products
async function getTopSellingProducts(
  startDate: Date,
  endDate: Date,
  categoryId?: string,
  limit = 10
) {
  const whereClause = categoryId ? `AND p."categoryId" = '${categoryId}'` : "";

  const topProducts = await prisma.$queryRaw`
    SELECT
      p.id,
      p.name,
      p.slug,
      p.sku,
      SUM(oi.quantity) as units_sold,
      SUM((oi.price::numeric * oi.quantity)) as revenue,
      COUNT(DISTINCT o.id) as order_count,
      c.name as category
    FROM "OrderItem" oi
    JOIN "Product" p ON oi."productId" = p.id
    JOIN "Category" c ON p."categoryId" = c.id
    JOIN "Order" o ON oi."orderId" = o.id
    WHERE
      o."createdAt" BETWEEN ${startDate} AND ${endDate}
      AND o.status != 'CANCELLED'
      ${Prisma.raw(whereClause)}
    GROUP BY p.id, p.name, p.slug, p.sku, c.name
    ORDER BY units_sold DESC
    LIMIT ${limit}
  `;

  return topProducts;
}

// Helper function to get inventory status
async function getInventoryStatus(categoryId?: string) {
  let whereClause = {};
  if (categoryId) {
    whereClause = { categoryId };
  }

  // Get overall inventory status
  const inventoryStatus = await prisma.product.groupBy({
    by: ["categoryId"],
    _count: {
      id: true,
    },
    _sum: {
      stock: true,
    },
    where: whereClause,
  });

  // Get low stock products
  const lowStockProducts = await prisma.product.findMany({
    where: {
      ...whereClause,
      stock: {
        lte: 10,
        gt: 0,
      },
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      stock: "asc",
    },
    take: 10,
  });

  // Get out of stock products
  const outOfStockProducts = await prisma.product.findMany({
    where: {
      ...whereClause,
      stock: {
        lte: 0,
      },
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
    take: 10,
  });

  // Get categories and their product counts with stock status
  const categoriesWithStock = await prisma.$queryRaw`
    SELECT
      c.id,
      c.name,
      COUNT(*) as product_count,
      SUM(CASE WHEN p.stock <= 0 THEN 1 ELSE 0 END) as out_of_stock_count,
      SUM(CASE WHEN p.stock BETWEEN 1 AND 10 THEN 1 ELSE 0 END) as low_stock_count,
      SUM(CASE WHEN p.stock > 10 THEN 1 ELSE 0 END) as in_stock_count
    FROM "Product" p
    JOIN "Category" c ON p."categoryId" = c.id
    ${categoryId ? Prisma.raw(`WHERE c.id = '${categoryId}'`) : Prisma.raw("")}
    GROUP BY c.id, c.name
    ORDER BY product_count DESC
  `;

  return {
    inventoryStatus,
    lowStockProducts,
    outOfStockProducts,
    categoriesWithStock,
  };
}

// Helper function to get product performance metrics
async function getProductPerformance(
  startDate: Date,
  endDate: Date,
  categoryId?: string
) {
  const whereClause = categoryId ? `AND p."categoryId" = '${categoryId}'` : "";

  // Using raw query to calculate various metrics
  const productPerformanceData = await prisma.$queryRaw`
    WITH ProductStats AS (
      SELECT
        p.id,
        p.name,
        p.sku,
        c.name as category,
        COUNT(DISTINCT o.id) as order_count,
        SUM(oi.quantity) as units_sold,
        SUM((oi.price::numeric * oi.quantity)) as revenue,
        AVG(oi.price::numeric) as average_price,
        p.stock as current_stock
      FROM "Product" p
      LEFT JOIN "Category" c ON p."categoryId" = c.id
      LEFT JOIN "OrderItem" oi ON p.id = oi."productId"
      LEFT JOIN "Order" o ON oi."orderId" = o.id AND o."createdAt" BETWEEN ${startDate} AND ${endDate} AND o.status != 'CANCELLED'
      WHERE 1=1 ${Prisma.raw(whereClause)}
      GROUP BY p.id, p.name, p.sku, c.name, p.stock
    )
    SELECT
      id,
      name,
      sku,
      category,
      order_count,
      units_sold,
      revenue,
      average_price,
      current_stock,
      CASE 
        WHEN units_sold > 0 THEN revenue / units_sold 
        ELSE 0 
      END as revenue_per_unit,
      CASE
        WHEN current_stock > 0 AND units_sold > 0 THEN current_stock / (units_sold / EXTRACT(EPOCH FROM (${endDate}::timestamp - ${startDate}::timestamp)) * 86400)
        ELSE 0
      END as days_to_stockout
    FROM ProductStats
    ORDER BY revenue DESC
    LIMIT 50
  `;

  return productPerformanceData;
}

// Helper function to get products with no sales
async function getNonSellingProducts(
  startDate: Date,
  endDate: Date,
  categoryId?: string
) {
  // Get products that haven't sold in the given period
  const nonSellingProducts = await prisma.product.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      isPublished: true,
      NOT: {
        orderItems: {
          some: {
            order: {
              createdAt: {
                gte: startDate,
                lte: endDate,
              },
              status: {
                not: "CANCELLED",
              },
            },
          },
        },
      },
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
    take: 20,
  });

  return nonSellingProducts;
}

// Dynamically import Prisma for raw query support
import { Prisma } from "@prisma/client";
