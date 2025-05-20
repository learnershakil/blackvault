import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Forgot Password | BlackVault",
  description: "Reset your BlackVault account password",
};

export default async function ForgotPasswordPage() {
  // Check if user is already authenticated
  const session = await auth();
  if (session) {
    redirect("/profile");
  }
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
