"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error");

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link may have been used or is no longer valid.",
    CredentialsSignin: "The email or password you entered is incorrect.",
    Default: "An error occurred during authentication.",
    MissingTokenOrEmail: "The verification link is invalid or incomplete.",
    InvalidToken: "The verification token is invalid or has expired.",
    TokenExpired: "The verification token has expired. Please request a new one.",
    InternalServerError: "An unexpected error occurred. Please try again later.",
  };

  const errorMessage = errorMessages[error || ""] || errorMessages.Default;

  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-red-600 dark:text-red-400">Authentication Error</h1>
      
      <div className="mb-6 p-4 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 rounded">
        <p>{errorMessage}</p>
      </div>
      
      <div className="flex flex-col space-y-4 items-center">
        {error === "TokenExpired" || error === "InvalidToken" || error === "Verification" ? (
          <Link href="/auth/signup" className="text-blue-500 hover:text-blue-600">
            Sign Up Again
          </Link>
        ) : null}
        
        <Link href="/auth/signin" className="text-blue-500 hover:text-blue-600">
          Return to Sign In
        </Link>
        
        <Link href="/" className="text-blue-500 hover:text-blue-600">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
} 