"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/auth";
import { addVote, getUserVote } from "@/lib/votes";

export default function VoteButtons({ postId }: { postId: string }) {
  const [currentVote, setCurrentVote] = useState<"up" | "down" | null>(null);
  const [loading, setLoading] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      const vote = getUserVote(postId, currentUser.email);
      setCurrentVote(vote);
    }
  }, [postId, currentUser]);

  function handleVote(type: "up" | "down") {
    if (!currentUser || loading) return;
    
    // If clicking same vote, do nothing
    if (currentVote === type) return;
    
    setLoading(true);
    addVote(postId, currentUser.email, type);
    
    // Reload to show updated counts
    window.location.reload();
  }

  if (!currentUser) {
    return (
      <div className="mt-2 text-sm text-gray-500">
        Login to vote
      </div>
    );
  }

  if (!currentUser.approved) {
    return (
      <div className="mt-2 text-sm text-gray-500">
        Wait for admin approval to vote
      </div>
    );
  }

  return (
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => handleVote("up")}
        disabled={loading}
        className={`px-3 py-1 rounded border transition-colors ${
          currentVote === "up"
            ? "bg-green-500 text-white border-green-600"
            : "bg-white hover:bg-gray-50 border-gray-300"
        }`}
      >
        👍 Upvote
      </button>
      <button
        onClick={() => handleVote("down")}
        disabled={loading}
        className={`px-3 py-1 rounded border transition-colors ${
          currentVote === "down"
            ? "bg-red-500 text-white border-red-600"
            : "bg-white hover:bg-gray-50 border-gray-300"
        }`}
      >
        👎 Downvote
      </button>
    </div>
  );
}