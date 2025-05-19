import Link from "next/link";
import CreateUserForm from "@/components/admin/users/create-user-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New User | BlackVault Admin",
  description: "Create a new user account",
};

export default function CreateUserPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Link
              href="/admin/users"
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <span className="sr-only">Back to Users</span>
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold">Add New User</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Create a new user account in the system
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <CreateUserForm />
      </div>
    </div>
  );
}
