import { getPostVotes } from "./votes";

export type Post = {
  id: string;
  tweetUrl: string;
  postedBy: string;
  postedAt: number;
};

const POSTS_KEY = "sr_posts";

export function getPosts(): Post[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(POSTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function savePosts(posts: Post[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function addPost(tweetUrl: string, userEmail: string): Post {
  const posts = getPosts();
  const newPost: Post = {
    id: Date.now().toString(),
    tweetUrl,
    postedBy: userEmail,
    postedAt: Date.now(),
  };

  posts.unshift(newPost);
  savePosts(posts);
  return newPost;
}

export function getPostWithVotes(postId: string) {
  const posts = getPosts();
  const post = posts.find((p) => p.id === postId);
  if (!post) return null;

  const votes = getPostVotes(postId);
  return {
    ...post,
    upvotes: votes.upvotes,
    downvotes: votes.downvotes,
  };
}

export function getAllPostsWithVotes() {
  const posts = getPosts();
  return posts.map((post) => {
    const votes = getPostVotes(post.id);
    return {
      ...post,
      upvotes: votes.upvotes,
      downvotes: votes.downvotes,
    };
  });
}