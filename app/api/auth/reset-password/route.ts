import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/server";
import { z } from "zod";
import crypto from "crypto";

// POST handler for password reset confirmation
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const schema = z.object({
      token: z.string().min(1, "Token is required"),
      password: z.string().min(8, "Password must be at least 8 characters"),
    });

    const { token, password } = schema.parse(body);

    // Hash the token for comparison with the stored token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the token in the database
    const storedToken = await prisma.verificationToken.findFirst({
      where: {
        token: hashedToken,
        expires: { gt: new Date() },
      },
    });

    if (!storedToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Find the user associated with the token
    const user = await prisma.user.findUnique({
      where: { email: storedToken.identifier },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update the user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete the token
    await prisma.verificationToken.delete({
      where: { token: hashedToken },
    });

    return NextResponse.json({
      message: "Password reset successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
