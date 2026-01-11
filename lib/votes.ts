// lib/votes.ts

export type Vote = {
  postId: string;
  userId: string;
  type: "up" | "down";
  timestamp: number;
};

const VOTES_KEY = "sr_votes";

export function getAllVotes(): Vote[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(VOTES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveVotes(votes: Vote[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}

export function getUserVote(postId: string, userId: string): "up" | "down" | null {
  const votes = getAllVotes();
  const userVote = votes.find(v => v.postId === postId && v.userId === userId);
  return userVote ? userVote.type : null;
}

export function addVote(postId: string, userId: string, type: "up" | "down") {
  const votes = getAllVotes();
  const existingVoteIndex = votes.findIndex(
    v => v.postId === postId && v.userId === userId
  );

  // Remove existing vote if present
  if (existingVoteIndex !== -1) {
    votes.splice(existingVoteIndex, 1);
  }

  // Add new vote
  votes.push({
    postId,
    userId,
    type,
    timestamp: Date.now(),
  });

  saveVotes(votes);
}

export function removeVote(postId: string, userId: string) {
  const votes = getAllVotes();
  const filtered = votes.filter(v => !(v.postId === postId && v.userId === userId));
  saveVotes(filtered);
}

export function getPostVotes(postId: string): { upvotes: number; downvotes: number } {
  const votes = getAllVotes();
  const postVotes = votes.filter(v => v.postId === postId);

  return {
    upvotes: postVotes.filter(v => v.type === "up").length,
    downvotes: postVotes.filter(v => v.type === "down").length,
  };
}