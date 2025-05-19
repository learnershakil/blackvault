import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

// POST handler to deactivate a user
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    // Only admin can deactivate users
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Don't allow deactivating the current admin user
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot deactivate your own account" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a random string to replace email (to prevent re-registration)
    const randomString = crypto.randomBytes(8).toString("hex");

    // Update user to deactivate them
    // We'll keep their data but make it impossible to login by:
    // 1. Changing their email to something random (but keeping original as a note)
    // 2. Invalidating their password
    // 3. Setting emailVerified to null
    await prisma.user.update({
      where: { id },
      data: {
        email: `deactivated_${randomString}@example.com`,
        password: null, // Remove password hash
        emailVerified: null, // Remove email verification
      },
    });

    // Log the user deactivation in activity log
    await prisma.userActivity.create({
      data: {
        userId: session.user.id, // Admin who deactivated the user
        action: "DEACTIVATE_USER",
        entityType: "USER",
        entityId: id,
        metadata: {
          deactivatedUserId: id,
          deactivatedUserEmail: user.email,
          deactivatedUserRole: user.role,
        },
      },
    });

    return NextResponse.json({ message: "User deactivated successfully" });
  } catch (error) {
    console.error("Error deactivating user:", error);
    return NextResponse.json(
      { error: "Failed to deactivate user" },
      { status: 500 }
    );
  }
}
