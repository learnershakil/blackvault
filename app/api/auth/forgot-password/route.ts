import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import crypto from "crypto";

// POST handler for password reset request
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const schema = z.object({
      email: z.string().email("Please provide a valid email"),
    });

    const { email } = schema.parse(body);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Send success response even if user doesn't exist (security)
    if (!user) {
      return NextResponse.json({
        message:
          "If your email is registered, you will receive a password reset link",
      });
    }

    // Generate a unique reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token expiration (1 hour)
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 1);

    // Save the token in the database
    await prisma.verificationToken.create({
      data: {
        identifier: user.email!,
        token: hashedToken,
        expires: tokenExpiry,
      },
    });

    // Generate the reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // In a real application, send this URL via email
    console.log(`Password reset URL: ${resetUrl}`);

    // For a real application, you'd integrate with an email sending service
    // await sendEmail({
    //   to: user.email!,
    //   subject: "Password Reset Request",
    //   text: `Click the link to reset your password: ${resetUrl}`,
    // });

    return NextResponse.json({
      message:
        "If your email is registered, you will receive a password reset link",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Password reset request error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    );
  }
}
