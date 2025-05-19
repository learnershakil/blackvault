import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { UserRole } from "@prisma/client";

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

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
        _count: {
          select: {
            orders: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PATCH handler for updating user details
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    // Only admin can update users
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Parse and validate request body
    const body = await request.json();
    const schema = z.object({
      name: z.string().optional(),
      email: z.string().email("Invalid email address").optional(),
      role: z.enum(["ADMIN", "CUSTOMER"]).optional(),
    });

    const validatedData = schema.parse(body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check email uniqueness if changing email
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: validatedData.email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // Updated data to track changes
    const changedFields: Record<string, { from: any; to: any }> = {};

    if (
      validatedData.name !== undefined &&
      validatedData.name !== existingUser.name
    ) {
      changedFields.name = { from: existingUser.name, to: validatedData.name };
    }

    if (
      validatedData.email !== undefined &&
      validatedData.email !== existingUser.email
    ) {
      changedFields.email = {
        from: existingUser.email,
        to: validatedData.email,
      };
    }

    if (
      validatedData.role !== undefined &&
      validatedData.role !== existingUser.role
    ) {
      changedFields.role = { from: existingUser.role, to: validatedData.role };
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        emailVerified: true,
      },
    });

    // Log the user update in activity log if fields changed
    if (Object.keys(changedFields).length > 0) {
      await prisma.userActivity.create({
        data: {
          userId: session.user.id, // Admin who updated the user
          action: "UPDATE_USER",
          entityType: "USER",
          entityId: id,
          metadata: {
            updatedUserId: id,
            changedFields,
          },
        },
      });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE handler for removing a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    // Only admin can delete users
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Don't allow deleting the current admin user
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        orders: {
          select: { id: true },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If user has orders, prevent deletion
    if (user.orders && user.orders.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot delete user with existing orders. Consider deactivating instead.",
        },
        { status: 400 }
      );
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    // Log the user deletion in activity log
    await prisma.userActivity.create({
      data: {
        userId: session.user.id, // Admin who deleted the user
        action: "DELETE_USER",
        entityType: "USER",
        entityId: id,
        metadata: {
          deletedUserId: id,
          deletedUserEmail: user.email,
        },
      },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
