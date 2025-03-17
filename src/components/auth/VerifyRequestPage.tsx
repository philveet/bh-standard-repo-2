"use client";

import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Check Your Email</h1>
      
      <div className="mb-6 text-center">
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          A verification link has been sent to your email address.
        </p>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Please check your inbox and click the link to verify your account.
        </p>
      </div>
      
      <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
        <p className="text-sm">
          <strong>Important:</strong> The link will expire in 24 hours.
        </p>
      </div>
      
      <div className="text-center">
        <Link href="/auth/signin" className="text-blue-500 hover:text-blue-600">
          Return to Sign In
        </Link>
      </div>
    </div>
  );
} 