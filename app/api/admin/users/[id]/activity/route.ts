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

    // Get user activities
    const [activities, total] = await Promise.all([
      prisma.userActivity.findMany({
        where: {
          OR: [
            { userId: id }, // Activities performed by this user
            {
              AND: [
                { entityType: "USER" },
                { entityId: id }, // Activities performed on this user
              ],
            },
          ],
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.userActivity.count({
        where: {
          OR: [
            { userId: id },
            {
              AND: [{ entityType: "USER" }, { entityId: id }],
            },
          ],
        },
      }),
    ]);

    return NextResponse.json({
      activities,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        hasMore: skip + activities.length < total,
      },
    });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch user activity" },
      { status: 500 }
    );
  }
}
