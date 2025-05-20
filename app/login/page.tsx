import { Suspense } from "react";
import LoginForm from "@/components/auth/login-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface LoginPageProps {
  searchParams?: {
    registered?: string;
    error?: string;
    callbackUrl?: string;
  };
}

export default async function LoginPage({ searchParams = {} }: LoginPageProps) {
  // Check if user is already authenticated
  const session = await auth();
  if (session) {
    redirect("/profile");
  }

  // Properly handle searchParams as per Next.js recommendations
  const registered = searchParams?.registered;
  const error = searchParams?.error;
  const redirectUrl = searchParams?.callbackUrl || "/";
  const justRegistered = registered === "true";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm
          justRegistered={justRegistered}
          error={error}
          callbackUrl={redirectUrl}
        />
      </Suspense>

      {justRegistered && (
        <div className="absolute top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Registration successful! Please log in.
        </div>
      )}
    </div>
  );
}
