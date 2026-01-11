"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, logout, canPost } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { addPost } from "@/lib/storage";

export default function SubmitPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [tweetUrl, setTweetUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push("/login");
      return;
    }
    setCurrentUser(user);
  }, [router]);

  function isValidTwitterUrl(url: string): boolean {
    const twitterPatterns = [
      /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/\w+\/status\/\d+/,
      /^https?:\/\/(www\.)?twitter\.com\/\w+\/status\/\d+/,
      /^https?:\/\/(www\.)?x\.com\/\w+\/status\/\d+/,
    ];

    return twitterPatterns.some(pattern => pattern.test(url));
  }

  function handleSubmit() {
    setError("");
    setSuccess("");

    // Validation
    if (!tweetUrl.trim()) {
      setError("Please enter a tweet URL");
      return;
    }

    if (!isValidTwitterUrl(tweetUrl)) {
      setError("Please enter a valid Twitter/X tweet URL (e.g., https://twitter.com/user/status/123...)");
      return;
    }

    if (!canPost()) {
      setError("You don't have permission to post. Contact admin for approval.");
      return;
    }

    setLoading(true);

    try {
      addPost(tweetUrl.trim(), currentUser.email);
      setSuccess("Tweet added successfully!");
      setTweetUrl("");
      
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      setError("Failed to add tweet. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (!currentUser) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Submit Tweet</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{currentUser.email}</span>
            <button
              onClick={() => router.push("/")}
              className="text-sm text-blue-500 hover:underline"
            >
              Feed
            </button>
            <button
              onClick={() => router.push("/admin")}
              className="text-sm text-blue-500 hover:underline"
            >
              Admin
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {!canPost() ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 font-semibold mb-2">
                ⚠️ Posting Not Enabled
              </p>
              <p className="text-yellow-700 text-sm">
                Your account needs to be approved as a "poster" by an admin before you can submit tweets.
                Contact the admin for approval.
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                ✅ You have posting permissions
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter/X Tweet URL
              </label>
              <input
                type="url"
                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="https://twitter.com/username/status/123456789..."
                value={tweetUrl}
                onChange={(e) => setTweetUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading || !canPost()}
              />
              <p className="text-xs text-gray-500 mt-2">
                Example: https://twitter.com/elonmusk/status/1234567890
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !canPost()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Tweet"}
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-blue-800 mb-2">
              How to get a tweet URL:
            </p>
            <ol className="list-decimal ml-5 text-sm text-blue-700 space-y-1">
              <li>Go to Twitter/X and find the tweet you want to submit</li>
              <li>Click the share icon on the tweet</li>
              <li>Click "Copy link"</li>
              <li>Paste the link here</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}