import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import crypto from "crypto";

// POST handler for email verification
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const schema = z.object({
      token: z.string().min(1, "Token is required"),
      email: z.string().email("Please provide a valid email"),
    });

    const { token, email } = schema.parse(body);

    // Hash the token for database comparison
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the token in the database
    const verificationRecord = await prisma.verificationToken.findFirst({
      where: {
        token: hashedToken,
        identifier: email,
        expires: { gt: new Date() },
      },
    });

    if (!verificationRecord) {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // Find user by the original email linked to this token
    const user = await prisma.user.findFirst({
      where: { email: verificationRecord.identifier },
    });

    if (user) {
      // This is not an email change but a new user verification
      return NextResponse.json(
        { error: "This email is already verified" },
        { status: 400 }
      );
    }

    // Update the user's email
    // For email changes, we need to find the user who requested the change
    // This is a simplified approach; in a real app, you might store the user ID with the token
    await prisma.user.update({
      where: {
        // This assumes there's only one user changing to this email
        // In a real app, you'd store the user ID with the token
        id: verificationRecord.identifier.split("|")[1],
      },
      data: { email },
    });

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { id: verificationRecord.id },
    });

    return NextResponse.json({
      message: "Email verified successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}
