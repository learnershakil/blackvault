import RegisterForm from "@/components/auth/register-form";
import Link from "next/link";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Register | BlackVault",
  description: "Create a new account on BlackVault",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Join BlackVault to start shopping
            </p>
          </div>

          <RegisterForm />

          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </Suspense>
    </div>
  );
}
