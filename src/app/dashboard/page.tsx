"use client";

import { useAuth } from "@/lib/auth/session";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name || user?.email}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              This is a protected route. Only authenticated users can access this page.
            </p>
          </div>

          <div className="flex space-x-4">
            <Link
              href="/"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 