"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { useAuth } from "@/lib/auth/session";

export default function AuthTestingSection() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  // Sign-up form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError(null);
    setSignupSuccess(null);
    
    // Validate passwords match
    if (signupPassword !== confirmPassword) {
      setSignupError("Passwords do not match");
      setSignupLoading(false);
      return;
    }
    
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Error during signup");
      }
      
      setSignupSuccess(data.message || "Account created! Please check your email for verification.");
      setSignupEmail("");
      setSignupPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setSignupError(err.message);
    } finally {
      setSignupLoading(false);
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: loginEmail,
        password: loginPassword,
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
      
      setLoginEmail("");
      setLoginPassword("");
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };
  
  const handleLogout = async () => {
    await signOut({ redirect: false });
  };
  
  return (
    <div className="mt-8 border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-100 dark:bg-gray-700 p-4 text-left font-medium flex items-center justify-between"
      >
        <span>Authentication Testing</span>
        <span className="transform transition-transform duration-200">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>
      
      {isOpen && (
        <div className="p-6 bg-white dark:bg-gray-800">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Authentication Status */}
            <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6 md:mb-0">
              <h3 className="text-lg font-medium mb-4">Auth Status</h3>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="mb-2">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={
                      isAuthenticated ? "text-green-500" : "text-red-500"
                    }
                  >
                    {isAuthenticated ? "Authenticated" : "Not authenticated"}
                  </span>
                </p>
                
                {isAuthenticated && user && (
                  <>
                    <p className="mb-2">
                      <span className="font-semibold">Email:</span> {user.email}
                    </p>
                    <p className="mb-4">
                      <span className="font-semibold">Role:</span>{" "}
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                    </p>
                    <button
                      onClick={handleLogout}
                      className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      Log Out
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Sign Up Form */}
            <div className="w-full md:w-1/3">
              <h3 className="text-lg font-medium mb-4">Sign Up</h3>
              {signupSuccess ? (
                <div className="p-4 bg-green-100 text-green-800 rounded-lg mb-4">
                  {signupSuccess}
                </div>
              ) : (
                <form onSubmit={handleSignup}>
                  {signupError && (
                    <div className="p-3 mb-4 bg-red-100 text-red-800 rounded-lg">
                      {signupError}
                    </div>
                  )}
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="signup-email"
                    >
                      Email
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="signup-password"
                    >
                      Password
                    </label>
                    <input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      minLength={8}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-1"
                      htmlFor="confirm-password"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      minLength={8}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={signupLoading}
                    className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
                  >
                    {signupLoading ? "Signing Up..." : "Sign Up"}
                  </button>
                </form>
              )}
            </div>
            
            {/* Login Form */}
            <div className="w-full md:w-1/3">
              <h3 className="text-lg font-medium mb-4">Login</h3>
              <form onSubmit={handleLogin}>
                {loginError && (
                  <div className="p-3 mb-4 bg-red-100 text-red-800 rounded-lg">
                    {loginError}
                  </div>
                )}
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="login-email"
                  >
                    Email
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="login-password"
                  >
                    Password
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded disabled:opacity-50"
                >
                  {loginLoading ? "Logging In..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 