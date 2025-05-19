import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

// PATCH handler to update user profile
export async function PATCH(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const schema = z.object({
      name: z.string().min(2, "Name must be at least 2 characters").optional(),
      // Email can't be changed in this endpoint
    });

    const validatedData = schema.parse(body);

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: validatedData,
    });

    // Remove sensitive data before returning
    const { password, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
