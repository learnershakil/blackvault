import LoginForm from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | SoundWave",
  description: "Log in to your SoundWave account",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { registered?: string };
}) {
  const justRegistered = searchParams?.registered === "true";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {justRegistered && (
          <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-200 rounded-md text-sm text-center">
            Account created successfully! Please sign in with your credentials.
          </div>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
