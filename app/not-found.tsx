import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | BlackVault",
};

export default function NotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[70vh] px-4 py-16">
      <div className="max-w-md text-center">
        <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-500">
          404
        </h1>

        <div className="my-8">
          <div className="h-1.5 w-16 bg-primary-600 dark:bg-primary-500 mx-auto rounded-full mb-8"></div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't seem to exist. It might have
            been moved, deleted, or perhaps the URL was mistyped.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg">Go to Homepage</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="lg">
              Browse Products
            </Button>
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help?{" "}
            <Link
              href="/contact"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
