import ResetPasswordForm from "@/components/auth/reset-password-form";
import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Reset Password | BlackVault",
  description: "Create a new password for your BlackVault account",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  // Check if user is already authenticated
  const session = await auth();
  if (session) {
    redirect("/profile");
  }

  const token = searchParams.token || "";

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Invalid Link</h2>
            <p className="text-gray-600 dark:text-gray-400">
              The password reset link is invalid or has expired.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
