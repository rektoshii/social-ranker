"use client";

import { useState } from "react";
import { login, ADMIN_EMAIL } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Captcha from "@/components/Captcha";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
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

    if (!captchaVerified) {
      setError("Please complete the captcha verification");
      return;
    }

    login(email);
    router.push("/");
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && captchaVerified) {
      handleLogin();
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
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

            <Captcha onVerify={setCaptchaVerified} />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {captchaVerified && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                ✓ Captcha verified
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={!captchaVerified}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign In
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>No account needed - just enter your email</p>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-800 mb-2">
            Quick Login:
          </p>
          <button
            onClick={() => setEmail(ADMIN_EMAIL)}
            className="text-sm text-blue-600 hover:underline block w-full text-left"
          >
            {ADMIN_EMAIL} (Admin)
          </button>
        </div>
      </div>
    </main>
  );
}