import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { comparePasswords } from "@/server";
import crypto from "crypto";

// POST handler for email change request
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await request.json();
    const schema = z.object({
      newEmail: z.string().email("Please provide a valid email"),
      password: z.string().min(1, "Password is required"),
    });

    const { newEmail, password } = schema.parse(body);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true, email: true },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "User not found or invalid authentication method" },
        { status: 404 }
      );
    }

    // Check if the new email is already in use by another account
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      return NextResponse.json(
        { error: "Email already in use by another account" },
        { status: 400 }
      );
    }

    // Verify current password
    const passwordValid = await comparePasswords(password, user.password);
    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    // Set token expiration (1 hour)
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);

    // Store the token for email verification
    await prisma.verificationToken.create({
      data: {
        identifier: newEmail,
        token: hashedToken,
        expires: expiry,
      },
    });

    // Generate verification URL
    const verifyUrl = `${
      process.env.NEXTAUTH_URL
    }/verify-email?token=${verificationToken}&email=${encodeURIComponent(
      newEmail
    )}`;

    // In a real application, send this URL via email
    console.log(`Email change verification URL: ${verifyUrl}`);

    // For a real application, you'd integrate with an email sending service
    // await sendEmail({
    //   to: newEmail,
    //   subject: "Verify your new email address",
    //   text: `Click the link to verify your new email address: ${verifyUrl}`,
    // });

    return NextResponse.json({
      message: "Email verification sent. Please check your new email address.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Email change request error:", error);
    return NextResponse.json(
      { error: "Failed to process email change request" },
      { status: 500 }
    );
  }
}
