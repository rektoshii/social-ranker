"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { getAllPostsWithVotes } from "@/lib/storage";
import { getCurrentUser, logout, canPost, type User } from "@/lib/auth";
import VoteButtons from "@/components/VoteButtons";

/* ---------------- TYPES ---------------- */

interface Post {
  id: string;
  tweetUrl: string;
  upvotes: number;
  downvotes: number;
  postedBy: string;
  postedAt: number;
}

type SortOption =
  | "trending-24h"
  | "trending-7d"
  | "trending-30d"
  | "latest"
  | "top";

/* ---------------- PAGE ---------------- */

export default function Home() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("trending-24h");

  /* ---------- AUTH ONLY (NO POSTS HERE) ---------- */
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    setCurrentUser(user);
  }, [router]);

  /* ---------- POSTS (NO EFFECT) ---------- */
  const posts: Post[] = useMemo(() => {
    return getAllPostsWithVotes();
  }, []);

  /* ---------- TWITTER WIDGET ---------- */
  useEffect(() => {
    if (posts.length === 0) return;
    if (typeof window !== "undefined" && "twttr" in window) {
      (window as any).twttr.widgets.load();
    }
  }, [posts, sortBy]);

  /* ---------- SORT HELPERS ---------- */
  const calculateTrendingScore = useMemo(
    () => (post: Post, hours: number) => {
      const age = (Date.now() - post.postedAt) / 36e5;
      if (age > hours) return -Infinity;
      return (post.upvotes * 2 - post.downvotes) / Math.pow(age + 2, 1.5);
    },
    []
  );

  const sortedPosts = useMemo(() => {
    const copy = [...posts];

    switch (sortBy) {
      case "trending-24h":
        return copy.sort(
          (a, b) =>
            calculateTrendingScore(b, 24) -
            calculateTrendingScore(a, 24)
        );
      case "trending-7d":
        return copy.sort(
          (a, b) =>
            calculateTrendingScore(b, 168) -
            calculateTrendingScore(a, 168)
        );
      case "trending-30d":
        return copy.sort(
          (a, b) =>
            calculateTrendingScore(b, 720) -
            calculateTrendingScore(a, 720)
        );
      case "latest":
        return copy.sort((a, b) => b.postedAt - a.postedAt);
      case "top":
        return copy.sort(
          (a, b) =>
            b.upvotes * 2 - b.downvotes -
            (a.upvotes * 2 - a.downvotes)
        );
      default:
        return copy;
    }
  }, [posts, sortBy, calculateTrendingScore]);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading…
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <main className="p-6 max-w-2xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Social Ranker</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {currentUser.email}
          </span>

          {canPost() && (
            <button
              onClick={() => router.push("/submit")}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              + Submit
            </button>
          )}

          <button
            onClick={() => router.push("/admin")}
            className="text-sm text-blue-500 hover:underline"
          >
            Admin
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* SORT */}
      <div className="mb-6 bg-white border rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {[
            ["trending-24h", "🔥 24h"],
            ["trending-7d", "📈 7d"],
            ["trending-30d", "📊 30d"],
            ["latest", "⏰ Latest"],
            ["top", "⭐ Top"],
          ].map(([v, label]) => (
            <button
              key={v}
              onClick={() => setSortBy(v as SortOption)}
              className={`px-4 py-2 rounded text-sm ${
                sortBy === v
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* POSTS */}
      {sortedPosts.map((post) => (
        <div
          key={post.id}
          className="border p-4 mb-4 rounded bg-white"
        >
          <blockquote className="twitter-tweet">
            <a href={post.tweetUrl}>Loading tweet…</a>
          </blockquote>

          <a
            href={post.tweetUrl}
            target="_blank"
            className="text-blue-500 text-sm block my-2"
          >
            View on X →
          </a>

          <VoteButtons postId={post.id} />

          <div className="text-xs text-gray-400 mt-2 flex justify-between">
            <span>{post.postedBy}</span>
            <span>
              {new Date(post.postedAt).toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </main>
  );
}
