"use client";

import { useState } from "react";
import { login, ADMIN_EMAIL } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  function handleLogin() {
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    login(email);
    router.push("/");
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleLogin();
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Social Ranker</h1>
            <p className="text-gray-600">Sign in to continue</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>No account needed - just enter your email</p>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-800 mb-2">Quick Login:</p>
          <button
            onClick={() => setEmail(ADMIN_EMAIL)}
            className="text-sm text-blue-600 hover:underline block"
          >
            {ADMIN_EMAIL} (Admin)
          </button>
        </div>
      </div>
    </main>
  );
}