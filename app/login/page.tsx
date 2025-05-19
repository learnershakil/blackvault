import { Suspense } from "react";
import LoginForm from "@/components/auth/login-form";

interface LoginPageProps {
  searchParams?: {
    registered?: string;
    error?: string;
    callbackUrl?: string;
  };
}

export default async function LoginPage({ searchParams = {} }: LoginPageProps) {
  // Using searchParams with proper await for Next.js 15 compliance
  const { registered, error, callbackUrl: redirectUrl = "/" } = searchParams;
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
